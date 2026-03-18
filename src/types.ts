export type LessonType = 'vocabulary' | 'listening' | 'speaking' | 'conversation';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  completed: boolean;
  content: {
    vocabulary?: { word: string; meaning: string; example: string }[];
    audioUrl?: string;
    transcript?: string;
    translation?: string;
    dialogue?: { speaker: string; text: string; translation: string }[];
  };
}

export interface DayPlan {
  day: number;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

export type Screen = 'onboarding' | 'dashboard' | 'lesson' | 'progress' | 'profile' | 'chat';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
