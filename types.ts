export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING',
  FILL_IN_BLANK = 'FILL_IN_BLANK'
}

export interface MultipleChoiceQuestion {
  id: number;
  type: QuestionType.MULTIPLE_CHOICE;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface MatchingQuestion {
  id: number;
  type: QuestionType.MATCHING;
  text: string;
  columnA: string[];
  columnB: string[];
  pairs: { aIndex: number; bIndex: number }[]; // Correct mapping
}

export interface FillInBlankQuestion {
  id: number;
  type: QuestionType.FILL_IN_BLANK;
  text: string; // The sentence with placeholders like ___
  answers: string[]; // The words to fill in
}

export type ExamQuestion = MultipleChoiceQuestion | MatchingQuestion | FillInBlankQuestion;

export interface ExamData {
  title: string;
  durationMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamConfig {
  semester: string;
  grade: string;
  subject: string;
  book: string;
}

export enum AppSection {
  HOME = 'HOME',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  EXAM_GENERATOR = 'EXAM_GENERATOR',
  ONLINE_TEST = 'ONLINE_TEST'
}
