
import { AcademicPerformance } from './types';

export const GRADE_SCALE = [
  { letter: 'A+', value: 4.0, gpa10: 9.5 },
  { letter: 'A', value: 4.0, gpa10: 9.0 },
  { letter: 'B+', value: 3.5, gpa10: 8.0 },
  { letter: 'B', value: 3.0, gpa10: 7.0 },
  { letter: 'C+', value: 2.5, gpa10: 6.0 },
  { letter: 'C', value: 2.0, gpa10: 5.0 },
  { letter: 'D+', value: 1.5, gpa10: 4.0 },
  { letter: 'D', value: 1.0, gpa10: 3.0 },
  { letter: 'F', value: 0.0, gpa10: 0.0 },
];

export const PERFORMANCE_THRESHOLDS: { threshold: number; classification: AcademicPerformance }[] = [
  { threshold: 3.6, classification: 'Xuất sắc' },
  { threshold: 3.2, classification: 'Giỏi' },
  { threshold: 2.5, classification: 'Khá' },
  { threshold: 2.0, classification: 'Trung bình' },
  { threshold: 1.0, classification: 'Yếu' },
  { threshold: 0.0, classification: 'Kém' },
];

export const EVENT_COLORS: { [key: string]: { bg: string, border: string, text: string } } = {
  class: { bg: 'bg-blue-100 dark:bg-blue-900/50', border: 'border-blue-500', text: 'text-blue-800 dark:text-blue-200' },
  exam: { bg: 'bg-red-100 dark:bg-red-900/50', border: 'border-red-500', text: 'text-red-800 dark:text-red-200' },
  assignment: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', border: 'border-yellow-500', text: 'text-yellow-800 dark:text-yellow-200' },
  deadline: { bg: 'bg-purple-100 dark:bg-purple-900/50', border: 'border-purple-500', text: 'text-purple-800 dark:text-purple-200' },
};

export const EVENT_TYPE_NAMES: { [key: string]: string } = {
    class: 'Lớp học',
    exam: 'Thi',
    assignment: 'Bài tập',
    deadline: 'Deadline'
};