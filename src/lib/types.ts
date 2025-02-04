export interface TestSession {
  examDate: string;
  examTime: string;
  room: string;
  course: string;
  proctors: string[];
  students: string[];
}

export interface TestSessionsByName {
  [key: string]: TestSession[];
}

export type TestSessionsByStudent = Record<string, TestSession[]>;
export type TestSessionsByProctor = Record<string, TestSession[]>; 