import React, { useState } from 'react';
import { Course, AcademicPerformance } from '../types';
import { GRADE_SCALE } from '../constants';
import { calculateGPA, classifyPerformance } from '../utils/gradeCalculator';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface GradeManagerProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const GradeManager: React.FC<GradeManagerProps> = ({ courses, setCourses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', credits: 3, grade: 4.0, semester: '' });

  const { gpa: cpa, totalCredits } = calculateGPA(courses);
  const performance: AcademicPerformance = classifyPerformance(cpa);

  const handleAddCourse = () => {
    if (newCourse.name.trim() && newCourse.credits > 0 && newCourse.semester.trim()) {
      setCourses(prev => [...prev, { ...newCourse, id: Date.now().toString() }]);
      setIsModalOpen(false);
      setNewCourse({ name: '', credits: 3, grade: 4.0, semester: '' });
    }
  };

  const handleDeleteCourse = (id: string) => {
    if(window.confirm('Bạn có chắc muốn xóa môn học này không?')) {
        setCourses(courses.filter(c => c.id !== id));
    }
  };

  const groupedCourses = courses.reduce((acc, course) => {
    (acc[course.semester] = acc[course.semester] || []).push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const sortedSemesters = Object.keys(groupedCourses).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Quản lý điểm</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi và tính toán điểm số của bạn.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm môn học
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
            {sortedSemesters.length > 0 ? (
                sortedSemesters.map(semester => {
                const semesterCourses = groupedCourses[semester];
                const { gpa: semesterGpa } = calculateGPA(semesterCourses);
                return (
                    <Card key={semester} className="p-0 overflow-hidden">
                        <div className="flex justify-between items-baseline p-4 border-b border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{semester}</h4>
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">GPA: <span className="text-green-600 dark:text-green-400 font-bold text-base">{semesterGpa.toFixed(2)}</span></p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700/50 dark:text-slate-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Môn học</th>
                                        <th scope="col" className="px-6 py-3 text-center">Tín chỉ</th>
                                        <th scope="col" className="px-6 py-3 text-center">Điểm (Hệ 4)</th>
                                        <th scope="col" className="px-6 py-3 text-center">Điểm chữ</th>
                                        <th scope="col" className="px-6 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {semesterCourses.map(course => (
                                    <tr key={course.id} className="bg-white dark:bg-slate-800/50 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{course.name}</td>
                                        <td className="px-6 py-4 text-center">{course.credits}</td>
                                        <td className="px-6 py-4 text-center">{course.grade.toFixed(1)}</td>
                                        <td className="px-6 py-4 text-center">{GRADE_SCALE.find(g => g.value === course.grade)?.letter || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
                })
            ) : (
                <Card className="lg:col-span-3 flex items-center justify-center h-64">
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">Chưa có môn học nào. <br/>Hãy thêm môn đầu tiên để bắt đầu!</p>
                </Card>
            )}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
           <Card>
             <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">CPA Toàn khóa</h3>
              <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{cpa.toFixed(2)}</p>
               <p className="font-semibold text-slate-600 dark:text-slate-300 mt-2">{performance}</p>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{totalCredits} tín chỉ</p>
           </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm môn học mới">
        <form onSubmit={(e) => { e.preventDefault(); handleAddCourse(); }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tên môn học</label>
            <input type="text" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" placeholder="e.g., Lập trình Web" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Học kỳ</label>
            <input type="text" value={newCourse.semester} onChange={e => setNewCourse({...newCourse, semester: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" placeholder="e.g., Học kỳ 1 2023-2024" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Số tín chỉ</label>
            <input type="number" min="0" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: parseInt(e.target.value) || 0})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Điểm</label>
            <select value={newCourse.grade} onChange={e => setNewCourse({...newCourse, grade: parseFloat(e.target.value)})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2">
              {GRADE_SCALE.map(g => <option key={g.letter} value={g.value}>{g.letter} ({g.value.toFixed(1)})</option>)}
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Lưu môn học</Button>
          </div>
        </div>
        </form>
      </Modal>
    </div>
  );
};

export default GradeManager;