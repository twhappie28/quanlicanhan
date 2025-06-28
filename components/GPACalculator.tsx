
import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { GRADE_SCALE } from '../constants';
import { calculateGPA, classifyPerformance } from '../utils/gradeCalculator';
import Card from './shared/Card';
import Button from './shared/Button';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface GPACalculatorProps {
  courses: Course[];
}

interface SimulatedCourse {
  id: string;
  name: string;
  credits: number;
  grade: number;
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ courses }) => {
  const [simulatedCourses, setSimulatedCourses] = useState<SimulatedCourse[]>([]);
  
  const baseGpaInfo = useMemo(() => calculateGPA(courses), [courses]);

  const addSimulatedCourse = () => {
    setSimulatedCourses([
      ...simulatedCourses,
      { id: Date.now().toString(), name: 'Môn học mới', credits: 3, grade: 4.0 },
    ]);
  };

  const updateSimulatedCourse = (id: string, field: keyof SimulatedCourse, value: string | number) => {
    setSimulatedCourses(
      simulatedCourses.map(c => c.id === id ? { ...c, [field]: value } : c)
    );
  };

  const removeSimulatedCourse = (id: string) => {
    setSimulatedCourses(simulatedCourses.filter(c => c.id !== id));
  };
  
  const projectedGpaInfo = useMemo(() => {
    const totalSimulatedCredits = simulatedCourses.reduce((sum, c) => sum + Number(c.credits), 0);
    const totalSimulatedPoints = simulatedCourses.reduce((sum, c) => sum + Number(c.grade) * Number(c.credits), 0);
    
    const totalCredits = baseGpaInfo.totalCredits + totalSimulatedCredits;
    const totalPoints = (baseGpaInfo.gpa * baseGpaInfo.totalCredits) + totalSimulatedPoints;

    const projectedGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    return {
      gpa: projectedGpa,
      totalCredits: totalCredits,
      performance: classifyPerformance(projectedGpa)
    }
  }, [simulatedCourses, baseGpaInfo]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bảng tính điểm giả lập</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Tính điểm mục tiêu để đạt học lực mong muốn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Các môn học giả lập</h2>
                <Button onClick={addSimulatedCourse} variant="secondary">
                    <PlusIcon className="w-5 h-5 mr-2"/>
                    Thêm môn
                </Button>
            </div>
            {simulatedCourses.length > 0 ? (
                <div className="space-y-4">
                    {simulatedCourses.map(course => (
                        <div key={course.id} className="grid grid-cols-1 sm:grid-cols-10 gap-2 items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                            <input type="text" value={course.name} onChange={e => updateSimulatedCourse(course.id, 'name', e.target.value)} className="sm:col-span-4 rounded-md border-slate-300 dark:bg-slate-600 dark:border-slate-500 dark:text-white p-2 text-sm" />
                            <input type="number" value={course.credits} onChange={e => updateSimulatedCourse(course.id, 'credits', Number(e.target.value))} className="sm:col-span-2 rounded-md border-slate-300 dark:bg-slate-600 dark:border-slate-500 dark:text-white p-2 text-sm" placeholder="Tín chỉ"/>
                            <select value={course.grade} onChange={e => updateSimulatedCourse(course.id, 'grade', Number(e.target.value))} className="sm:col-span-3 rounded-md border-slate-300 dark:bg-slate-600 dark:border-slate-500 dark:text-white p-2 text-sm">
                                {GRADE_SCALE.map(g => <option key={g.letter} value={g.value}>{g.letter} ({g.value.toFixed(1)})</option>)}
                            </select>
                            <button onClick={() => removeSimulatedCourse(course.id)} className="sm:col-span-1 flex justify-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">Bấm "Thêm môn" để bắt đầu giả lập.</p>
            )}
        </Card>
        <div className="space-y-6">
            <Card>
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">CPA Hiện tại</h2>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-300 mt-1">{baseGpaInfo.gpa.toFixed(2)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{baseGpaInfo.totalCredits} tín chỉ</p>
            </Card>
            <Card>
                <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">CPA Dự kiến</h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">{projectedGpaInfo.gpa.toFixed(2)}</p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">{projectedGpaInfo.performance}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{projectedGpaInfo.totalCredits} tín chỉ</p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default GPACalculator;