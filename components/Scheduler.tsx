import React, { useState } from 'react';
import { AcademicEvent } from '../types';
import { EVENT_COLORS, EVENT_TYPE_NAMES } from '../constants';
import Card from './shared/Card';
import Button from './shared/Button';
import Modal from './shared/Modal';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface SchedulerProps {
  events: AcademicEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AcademicEvent[]>>;
}

const Scheduler: React.FC<SchedulerProps> = ({ events, setEvents }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<AcademicEvent, 'id'>>({ title: '', type: 'class', date: new Date().toISOString().split('T')[0], time: '' });
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAddEvent = () => {
    if (newEvent.title.trim() && newEvent.date) {
      setEvents(prev => [...prev, { ...newEvent, id: Date.now().toString() }].sort((a,b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')));
      setIsModalOpen(false);
      setNewEvent({ title: '', type: 'class', date: new Date().toISOString().split('T')[0], time: '' });
    }
  };

  const handleDeleteEvent = (id: string) => {
    if(window.confirm('Bạn có chắc muốn xóa sự kiện này không?')) {
        setEvents(events.filter(e => e.id !== id));
    }
  };

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)); // Monday as start of week
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    return date;
  });

  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentDate(newDate);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Lịch trình & Công việc</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Lập kế hoạch học tập và các deadline quan trọng.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm sự kiện
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
            <Button variant="secondary" onClick={() => changeWeek('prev')} aria-label="Tuần trước"><ChevronLeftIcon /></Button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize">{formatDate(startOfWeek)}</h2>
            <Button variant="secondary" onClick={() => changeWeek('next')} aria-label="Tuần sau"><ChevronRightIcon /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 border-t border-slate-200 dark:border-slate-700">
            {weekDates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const dayEvents = events.filter(e => e.date === dateStr).sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                    <div key={index} className={`p-2 border-slate-200 dark:border-slate-700 ${index > 0 ? 'md:border-l' : ''} border-b md:border-b-0`}>
                        <div className="text-center mb-2 p-1">
                           <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</p>
                           <p className={`font-bold text-2xl mt-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{date.getDate()}</p>
                        </div>
                        <div className="space-y-2 min-h-[16rem] overflow-y-auto p-1">
                            {dayEvents.map(event => {
                                const colorInfo = EVENT_COLORS[event.type];
                                return (
                                    <div key={event.id} className={`p-2 rounded-lg border-l-4 text-xs shadow-sm ${colorInfo.bg} ${colorInfo.border}`}>
                                        <div className="flex justify-between items-start gap-1">
                                            <p className={`font-semibold break-words ${colorInfo.text}`}>{event.title}</p>
                                            <button onClick={() => handleDeleteEvent(event.id)} className="shrink-0 text-red-400 hover:text-red-600 opacity-20 hover:opacity-100 transition-opacity">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-baseline mt-1">
                                            <p className="text-slate-500 dark:text-slate-400">{EVENT_TYPE_NAMES[event.type]}</p>
                                            {event.time && <p className="font-mono text-slate-600 dark:text-slate-300">{event.time}</p>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm sự kiện mới">
        <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tiêu đề</label>
              <input id="event-title" type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" placeholder="e.g., Nộp bài tập lớn" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Loại sự kiện</label>
                <select id="event-type" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as AcademicEvent['type']})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2">
                  {Object.entries(EVENT_TYPE_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ngày</label>
                <input id="event-date" type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" required />
              </div>
            </div>
             <div>
                <label htmlFor="event-time" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Thời gian (tùy chọn)</label>
                <input id="event-time" type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2" />
              </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Lưu sự kiện</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Scheduler;