export interface QuizAnswers {
  W1?: boolean;
  W2?: boolean;
  W3?: boolean;
  P1?: boolean;
  P2?: boolean;
  P3?: boolean;
}

export interface QuizResult {
  quadrant: 'I' | 'II' | 'III' | 'IV' | null;
  isComplete: boolean;
}

export function processQuiz(answers: QuizAnswers): QuizResult {
  const wa = ['W1','W2','W3'].filter(k => answers[k as keyof QuizAnswers]).length;
  const ur = ['P1','P2','P3'].filter(k => answers[k as keyof QuizAnswers]).length;
  const count = Object.keys(answers).length;

  if (count === 0) return { quadrant: null, isComplete: false };

  const important = wa >= 2;
  const urgent = ur >= 2;
  const quadrant = important && urgent ? 'I' : important ? 'II' : urgent ? 'III' : 'IV';
  const isComplete = count === 6;

  return { quadrant, isComplete };
}
