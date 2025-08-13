export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PomodoroSession {
  duration: number;
  elapsed: number;
  isActive: boolean;
  isPaused: boolean;
}