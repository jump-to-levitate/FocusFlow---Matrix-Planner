import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/dexie';
import { classifyTask, type QuadrantNumber } from '../utils/taskClassifier';

export type QuizStep = 'title' | 'importance' | 'urgency' | 'confirm';

const DRAFT_KEY = 'focusflow_quiz_draft';

interface UseQuizFormOptions {
  initialQuadrant?: QuadrantNumber | null;
}

export interface UseQuizFormReturn {
  currentStep: QuizStep;
  taskTitle: string;
  importance: boolean | null;
  urgency: boolean | null;
  predictedQuadrant: QuadrantNumber | null;
  isSubmitting: boolean;
  setTaskTitle: (value: string) => void;
  answerImportance: (value: boolean) => void;
  answerUrgency: (value: boolean) => void;
  setPredictedQuadrant: (value: QuadrantNumber) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  resetQuiz: () => void;
  submitTask: () => Promise<boolean>;
}

export function useQuizForm(options?: UseQuizFormOptions): UseQuizFormReturn {
  const bypass = options?.initialQuadrant ?? null;

  const [currentStep, setCurrentStep] = useState<QuizStep>('title');
  const [taskTitle, setTaskTitleRaw] = useState<string>(() => {
    try {
      return localStorage.getItem(DRAFT_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [importance, setImportanceRaw] = useState<boolean | null>(null);
  const [urgency, setUrgencyRaw] = useState<boolean | null>(null);
  const [predictedQuadrant, setPredictedQuadrantRaw] = useState<QuadrantNumber | null>(bypass);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- localStorage draft persistence ---
  useEffect(() => {
    try {
      if (taskTitle) {
        localStorage.setItem(DRAFT_KEY, taskTitle);
      }
    } catch { /* quota or SSR – ignore */ }
  }, [taskTitle]);

  // --- Setters ---
  const setTaskTitle = useCallback((value: string) => {
    setTaskTitleRaw(value);
  }, []);

  const answerImportance = useCallback((value: boolean) => {
    setImportanceRaw(value);
    setCurrentStep('urgency');
  }, []);

  const answerUrgency = useCallback((value: boolean) => {
    setUrgencyRaw(value);
    // importance is guaranteed non-null here (step guard)
    setImportanceRaw(prev => {
      const imp = prev!;
      setPredictedQuadrantRaw(classifyTask(imp, value));
      return prev;
    });
    setCurrentStep('confirm');
  }, []);

  const setPredictedQuadrant = useCallback((value: QuadrantNumber) => {
    setPredictedQuadrantRaw(value);
  }, []);

  // --- Navigation ---
  const nextStep = useCallback((): boolean => {
    if (currentStep === 'title') {
      if (!taskTitle.trim()) return false;

      if (bypass !== null) {
        // Context-aware bypass: skip classification, go straight to confirm
        setPredictedQuadrantRaw(bypass);
        setCurrentStep('confirm');
        return true;
      }
      setCurrentStep('importance');
      return true;
    }

    // importance and urgency steps are advanced by answerImportance/answerUrgency directly

    return false;
  }, [currentStep, taskTitle, bypass]);

  const prevStep = useCallback(() => {
    if (currentStep === 'confirm') {
      if (bypass !== null) {
        setCurrentStep('title');
      } else {
        setCurrentStep('urgency');
      }
      return;
    }

    if (currentStep === 'urgency') {
      setUrgencyRaw(null);
      setCurrentStep('importance');
      return;
    }

    if (currentStep === 'importance') {
      setImportanceRaw(null);
      setCurrentStep('title');
      return;
    }
  }, [currentStep, bypass]);

  // --- Reset ---
  const resetQuiz = useCallback(() => {
    setCurrentStep('title');
    setTaskTitleRaw('');
    setImportanceRaw(null);
    setUrgencyRaw(null);
    setPredictedQuadrantRaw(bypass);
    setIsSubmitting(false);
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
      });

      // Cleanup after successful save
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      resetQuiz();
      return true;
    } catch {
      setIsSubmitting(false);
      return false;
    }
  }, [isSubmitting, taskTitle, predictedQuadrant, resetQuiz]);

  return {
    currentStep,
    taskTitle,
    importance,
    urgency,
    predictedQuadrant,
    isSubmitting,
    setTaskTitle,
    answerImportance,
    answerUrgency,
    setPredictedQuadrant,
    nextStep,
    prevStep,
    resetQuiz,
    submitTask,
  };
}
