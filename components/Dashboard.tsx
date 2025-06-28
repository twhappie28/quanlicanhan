import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Course, AcademicEvent, AcademicPerformance } from '../types';
import Card from './shared/Card';
import { calculateGPA, classifyPerformance } from '../utils/gradeCalculator';
import { EVENT_COLORS, EVENT_TYPE_NAMES } from '../constants';

interface DashboardProps {
  courses: Course[];
  events: AcademicEvent[];
}

const GpaTrendChart: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const chartData = useMemo(() => {
    const semesterMap = courses.reduce((acc, course) => {
      if (!acc[course.semester]) {
        acc[course.semester] = [];
      }
      acc[course.semester].push(course);
      return acc;
    }, {} as Record<string, Course[]>);

    return Object.keys(semesterMap)
      .sort()
      .map(semester => ({
        name: semester.replace('Học kỳ ', 'HK '),
        GPA: calculateGPA(semesterMap[semester]).gpa,
      }));
  }, [courses]);

  if (chartData.length < 2) {
    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-slate-500 dark:text-slate-400">Cần ít nhất 2 học kỳ để hiển thị biểu đồ xu hướng.</p>
        </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="hsl(var(--slate-500))" />
        <YAxis domain={[0, 4]} stroke="hsl(var(--slate-500))" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #ccc',
            color: '#333'
          }}
          formatter={(value: number) => value.toFixed(2)}
        />
        <Legend />
        <Line type="monotone" dataKey="GPA" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ courses, events }) => {
  const { gpa: cpa, totalCredits } = calculateGPA(courses);
  const performance: AcademicPerformance = classifyPerformance(cpa);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const todaysEvents = events
    .filter(event => event.date === todayStr)
    .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  
  const semesterCount = new Set(courses.map(c => c.semester)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">Bảng điều khiển</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">CPA Tích lũy</h2>
          <div>
            <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{cpa.toFixed(2)}</p>
            <p className="font-semibold text-slate-600 dark:text-slate-300 mt-2">{performance}</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{totalCredits} tín chỉ đã tích lũy</p>
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Số môn đã học</h2>
          <p className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{courses.length}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">qua {semesterCount} học kỳ</p>
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Sự kiện hôm nay</h2>
          <p className="text-5xl font-extrabold text-green-600 dark:text-green-400 mt-1">{todaysEvents.length}</p>
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{todaysEvents.length > 0 ? 'cần hoàn thành' : 'yên tĩnh!'}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Xu hướng GPA</h2>
          <GpaTrendChart courses={courses} />
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Lịch trình hôm nay</h2>
          {todaysEvents.length > 0 ? (
            <ul className="space-y-3">
              {todaysEvents.map(event => {
                   const colorInfo = EVENT_COLORS[event.type];
                   return (
                      <li key={event.id} className={`flex items-center p-3 rounded-lg border-l-4 ${colorInfo.bg} ${colorInfo.border}`}>
                          <div className="flex-1">
                             <p className={`font-semibold ${colorInfo.text}`}>{event.title}</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400">{EVENT_TYPE_NAMES[event.type]}</p>
                          </div>
                          {event.time && <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{event.time}</span>}
                      </li>
                   );
              })}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">Không có sự kiện nào hôm nay. Hãy nghỉ ngơi!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;