
export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: number; // Grade on a 4.0 scale
  semester: string;
}

export interface AcademicEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'assignment' | 'deadline';
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
}

export type AcademicPerformance = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' | 'Kém';

export interface GpaResult {
    gpa: number;
    totalCredits: number;
}

export type View = 'dashboard' | 'grades' | 'calculator' | 'scheduler';