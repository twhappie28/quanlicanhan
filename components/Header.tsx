import React from 'react';
import MenuIcon from './icons/MenuIcon';

interface HeaderProps {
  toggleSidebar: () => void;
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, pageTitle }) => {
  return (
    <header className="sticky top-0 z-10 bg-slate-50/75 dark:bg-slate-900/75 backdrop-blur-lg flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 md:hidden">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{pageTitle}</h1>
      <button onClick={toggleSidebar} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800">
        <MenuIcon className="w-6 h-6" />
      </button>
    </header>
  );
};

export default Header;