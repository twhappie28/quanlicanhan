
import { Course, AcademicPerformance, GpaResult } from '../types';
import { PERFORMANCE_THRESHOLDS } from '../constants';

export const calculateGPA = (courses: Course[]): GpaResult => {
  if (courses.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    totalPoints += course.grade * course.credits;
    totalCredits += course.credits;
  });

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return { gpa, totalCredits };
};

export const classifyPerformance = (gpa: number): AcademicPerformance => {
  for (const level of PERFORMANCE_THRESHOLDS) {
    if (gpa >= level.threshold) {
      return level.classification;
    }
  }
  return 'Kém';
};