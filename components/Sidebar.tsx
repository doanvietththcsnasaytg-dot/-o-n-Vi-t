import React from 'react';
import { AppSection } from '../types';
import { LayoutDashboard, Image, FileText, MonitorPlay, School } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate }) => {
  const navItems = [
    { id: AppSection.HOME, label: 'Trang Chủ', icon: LayoutDashboard },
    { id: AppSection.IMAGE_STUDIO, label: 'Ghép Ảnh Nghề Nghiệp', icon: Image },
    { id: AppSection.EXAM_GENERATOR, label: 'Tạo Đề & Ôn Tập', icon: FileText },
    // Online test is usually accessed via Generator, but we keep a direct link for demo
    { id: AppSection.ONLINE_TEST, label: 'Thi Trực Tuyến (Demo)', icon: MonitorPlay },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <School className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase text-slate-400 tracking-wider">UBND Xã Chiềng Sinh</h2>
            <h1 className="font-bold text-sm">Trường TH&THCS Nà Sáy</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
              currentSection === item.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        <p>© 2024 EduHub Nà Sáy</p>
        <p className="mt-1">Powered by Gemini 2.5 Flash</p>
      </div>
    </div>
  );
};

export default Sidebar;
