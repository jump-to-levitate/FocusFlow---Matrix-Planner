import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../db/dexie';
import { classifyFromScores, type QuadrantNumber } from '../utils/taskClassifier';

export type QuizStep = 'title' | 'quiz' | 'subcategory' | 'confirm';
type TriAnswer = [boolean | null, boolean | null, boolean | null];

const DRAFT_KEY = 'focusflow_quiz_draft';
const AUTO_ADVANCE_MS = 250;

interface UseQuizFormOptions {
  initialQuadrant?: QuadrantNumber | null;
  initialTitle?: string;
  skipTitleStep?: boolean; // default: true if initialTitle provided
}

export interface UseQuizFormReturn {
  currentStep: QuizStep;
  currentSlide: number;
  taskTitle: string;
  importanceAnswers: TriAnswer;
  urgencyAnswers: TriAnswer;
  predictedQuadrant: QuadrantNumber | null;
  subcategory: string | null;
  isSubmitting: boolean;
  setTaskTitle: (value: string) => void;
  answerImportance: (slideIndex: number, value: boolean) => void;
  answerUrgency: (slideIndex: number, value: boolean) => void;
  setPredictedQuadrant: (value: QuadrantNumber) => void;
  setSubcategory: (value: string | null) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  nextStep: () => boolean;
  prevStep: () => void;
  resetQuiz: () => void;
  submitTask: () => Promise<boolean>;
}

export function useQuizForm(options?: UseQuizFormOptions): UseQuizFormReturn {
  const bypass = options?.initialQuadrant ?? null;
  const prefill = options?.initialTitle?.trim() || null;
  const skipTitle = options?.skipTitleStep ?? (prefill ? true : false);

  const [currentStep, setCurrentStep] = useState<QuizStep>(() => {
    if (prefill && bypass !== null) return 'confirm';
    if (prefill && skipTitle) return 'quiz';
    return 'title';
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [taskTitle, setTaskTitleRaw] = useState<string>(() => {
    if (prefill) return prefill;
    try {
      return localStorage.getItem(DRAFT_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [importanceAnswers, setImportanceAnswers] = useState<TriAnswer>([null, null, null]);
  const [urgencyAnswers, setUrgencyAnswers] = useState<TriAnswer>([null, null, null]);
  const [manualQuadrant, setManualQuadrant] = useState<QuadrantNumber | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronous derived state - eliminates race condition with subcategory step
  // Uses classifyFromScores directly to avoid circular dependency
  const predictedQuadrant: QuadrantNumber | null = bypass ?? manualQuadrant ?? classifyFromScores(importanceAnswers, urgencyAnswers);

  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- localStorage draft restore (only when no prefill) ---
  useEffect(() => {
    // Restore draft only in normal flow without prefill
    if (!options?.initialTitle) {
      try {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) setTaskTitleRaw(savedDraft);
      } catch { /* ignore */ }
    }
  }, [options?.initialTitle]);

  // --- Dynamic sync: update title when initialTitle changes ---
  useEffect(() => {
    if (options?.initialTitle) {
      setTaskTitleRaw(options.initialTitle);
    }
  }, [options?.initialTitle]);

  // --- localStorage draft persistence ---
  useEffect(() => {
    try {
      if (taskTitle) {
        localStorage.setItem(DRAFT_KEY, taskTitle);
      }
    } catch { /* quota or SSR – ignore */ }
  }, [taskTitle]);

  // --- Helpers ---
  // Wrapper for classifyFromScores to maintain API compatibility
  const computeQuadrant = useCallback((imp: TriAnswer, urg: TriAnswer): QuadrantNumber => {
    return classifyFromScores(imp, urg);
  }, []);

  const checkAutoAdvance = useCallback((
    slide: number,
    impArr: TriAnswer,
    urgArr: TriAnswer,
    wasNull: boolean,
  ) => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }

    // Only auto-advance if this was a first-time answer (null → value)
    if (!wasNull) return;

    // Both answers on this slide must be filled
    if (impArr[slide] === null || urgArr[slide] === null) return;

    autoAdvanceTimer.current = setTimeout(() => {
      if (slide < 2) {
        setCurrentSlide(slide + 1);
      } else {
        // Last slide completed — compute quadrant synchronously and decide next step
        const computedQuadrant = classifyFromScores(impArr, urgArr);
        // For Q2, Q3 go to subcategory step; for Q1, Q4 go directly to confirm
        if (computedQuadrant === 2 || computedQuadrant === 3) {
          setCurrentStep('subcategory');
        } else {
          setCurrentStep('confirm');
        }
      }
      autoAdvanceTimer.current = null;
    }, AUTO_ADVANCE_MS);
  }, [computeQuadrant]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // --- Setters ---
  const setTaskTitle = useCallback((value: string) => {
    setTaskTitleRaw(value);
  }, []);

  const answerImportance = useCallback((slideIndex: number, value: boolean) => {
    setImportanceAnswers(prev => {
      const wasNull = prev[slideIndex] === null;
      const next = [...prev] as TriAnswer;
      next[slideIndex] = value;

      // Read current urgency to check auto-advance
      setUrgencyAnswers(urgPrev => {
        checkAutoAdvance(slideIndex, next, urgPrev, wasNull);
        return urgPrev;
      });

      return next;
    });
  }, [checkAutoAdvance]);

  const answerUrgency = useCallback((slideIndex: number, value: boolean) => {
    setUrgencyAnswers(prev => {
      const wasNull = prev[slideIndex] === null;
      const next = [...prev] as TriAnswer;
      next[slideIndex] = value;

      // Read current importance to check auto-advance
      setImportanceAnswers(impPrev => {
        checkAutoAdvance(slideIndex, impPrev, next, wasNull);
        return impPrev;
      });

      return next;
    });
  }, [checkAutoAdvance]);

  const setPredictedQuadrant = useCallback((value: QuadrantNumber) => {
    setManualQuadrant(value);
  }, []);

  // --- Slide Navigation ---
  const nextSlide = useCallback(() => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Last slide — quadrant is computed synchronously, decide next step immediately
      const computedQuadrant = computeQuadrant(importanceAnswers, urgencyAnswers);
      // For Q2, Q3 go to subcategory step; for Q1, Q4 go directly to confirm
      if (computedQuadrant === 2 || computedQuadrant === 3) {
        setCurrentStep('subcategory');
      } else {
        setCurrentStep('confirm');
      }
    }
  }, [currentSlide, importanceAnswers, urgencyAnswers, computeQuadrant]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  // --- Step Navigation ---
  const nextStep = useCallback((): boolean => {
    if (currentStep === 'title') {
      if (!taskTitle.trim()) return false;

      if (bypass !== null) {
        // bypass is handled by synchronous predictedQuadrant
        setCurrentStep('confirm');
        return true;
      }
      setCurrentStep('quiz');
      setCurrentSlide(0);
      return true;
    }

    if (currentStep === 'quiz') {
      // Quadrant is computed synchronously - no need to set state
      const computedQuadrant = computeQuadrant(importanceAnswers, urgencyAnswers);
      // For Q2, Q3 go to subcategory step; for Q1, Q4 go directly to confirm
      if (computedQuadrant === 2 || computedQuadrant === 3) {
        setCurrentStep('subcategory');
      } else {
        setCurrentStep('confirm');
      }
      return true;
    }

    if (currentStep === 'subcategory') {
      setCurrentStep('confirm');
      return true;
    }

    return false;
  }, [currentStep, taskTitle, bypass, importanceAnswers, urgencyAnswers, computeQuadrant]);

  const prevStep = useCallback(() => {
    if (currentStep === 'confirm') {
      if (bypass !== null && prefill) {
        // initialTitle + bypass: nowhere to go back, stay
        return;
      }
      // Go back to subcategory if quadrant is 2 or 3, otherwise go to quiz
      if (predictedQuadrant === 2 || predictedQuadrant === 3) {
        setCurrentStep('subcategory');
      } else if (bypass !== null) {
        setCurrentStep('title');
      } else {
        setCurrentStep('quiz');
        setCurrentSlide(2);
      }
      return;
    }

    if (currentStep === 'subcategory') {
      setSubcategory(null); // Reset subcategory when going back
      setCurrentStep('quiz');
      setCurrentSlide(2);
      return;
    }

    if (currentStep === 'quiz') {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      } else if (!prefill) {
        setCurrentStep('title');
      }
      return;
    }
  }, [currentStep, currentSlide, bypass, prefill]);

  // --- Reset ---
  const resetQuiz = useCallback(() => {
    setCurrentStep('title');
    setCurrentSlide(0);
    setTaskTitleRaw('');
    setImportanceAnswers([null, null, null]);
    setUrgencyAnswers([null, null, null]);
    setManualQuadrant(null);
    setSubcategory(null);
    setIsSubmitting(false);
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch { /* ignore */ }
  }, [bypass]);

  // --- Submit ---
  const submitTask = useCallback(async (): Promise<boolean> => {
    if (isSubmitting) return false;
    if (!taskTitle.trim() || predictedQuadrant === null) return false;

    setIsSubmitting(true);
    try {
      await db.tasks.add({
        title: taskTitle.trim(),
        quadrant: predictedQuadrant,
        completed: false,
        createdAt: new Date(),
        subcategory: subcategory,
      });

      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      resetQuiz();
      return true;
    } catch {
      setIsSubmitting(false);
      return false;
    }
  }, [isSubmitting, taskTitle, predictedQuadrant, subcategory, resetQuiz]);

  return {
    currentStep,
    currentSlide,
    taskTitle,
    importanceAnswers,
    urgencyAnswers,
    predictedQuadrant,
    subcategory,
    isSubmitting,
    setTaskTitle,
    answerImportance,
    answerUrgency,
    setPredictedQuadrant,
    setSubcategory,
    nextSlide,
    prevSlide,
    nextStep,
    prevStep,
    resetQuiz,
    submitTask,
  };
}
