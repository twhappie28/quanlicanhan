import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Course, AcademicEvent, View } from './types';
import Dashboard from './components/Dashboard';
import GradeManager from './components/GradeManager';
import GPACalculator from './components/GPACalculator';
import Scheduler from './components/Scheduler';
import Header from './components/Header';

import DashboardIcon from './components/icons/DashboardIcon';
import GradesIcon from './components/icons/GradesIcon';
import CalculatorIcon from './components/icons/CalculatorIcon';
import SchedulerIcon from './components/icons/SchedulerIcon';
import XIcon from './components/icons/XIcon';

const navItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: DashboardIcon },
  { id: 'grades', label: 'Quản lý điểm', icon: GradesIcon },
  { id: 'calculator', label: 'Bảng tính GPA', icon: CalculatorIcon },
  { id: 'scheduler', label: 'Lịch trình', icon: SchedulerIcon },
];

const SidebarContent: React.FC<{ activeView: View; setActiveView: (view: View) => void }> = ({ activeView, setActiveView }) => (
    <>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Student Planner</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveView(item.id as View)}
                    className={`w-full flex items-center p-3 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
    </>
);


const App: React.FC = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [events, setEvents] = useLocalStorage<AcademicEvent[]>('events', []);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleViewChange = (view: View) => {
    setActiveView(view);
    setIsSidebarOpen(false); // Close sidebar on navigation
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard courses={courses} events={events} />;
      case 'grades':
        return <GradeManager courses={courses} setCourses={setCourses} />;
      case 'calculator':
        return <GPACalculator courses={courses} />;
      case 'scheduler':
        return <Scheduler events={events} setEvents={setEvents} />;
      default:
        return <Dashboard courses={courses} events={events} />;
    }
  };

  const currentPageTitle = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
       {/* Mobile Sidebar */}
       <div 
         className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
         }`}
         onClick={() => setIsSidebarOpen(false)}
       ></div>
       <aside 
          className={`fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-slate-800 shadow-lg transform transition-transform md:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
       >
         <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
           <XIcon className="w-6 h-6" />
         </button>
         <SidebarContent activeView={activeView} setActiveView={handleViewChange} />
       </aside>

       {/* Desktop Sidebar */}
       <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <SidebarContent activeView={activeView} setActiveView={handleViewChange} />
       </aside>

       <div className="md:pl-64 flex flex-col flex-1">
         <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} pageTitle={currentPageTitle} />
         <main className="flex-1 p-4 sm:p-6 lg:p-8">
           {renderView()}
         </main>
       </div>
    </div>
  );
};

export default App;
