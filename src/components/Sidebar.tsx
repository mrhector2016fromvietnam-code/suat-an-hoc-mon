import React from 'react';
import { 
  FileText, LayoutGrid, FolderOpen, 
  Sparkles, SlidersHorizontal 
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'overview' | 'report' | 'menu-sheet';
  setCurrentTab: (tab: 'overview' | 'report' | 'menu-sheet') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200/90 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen select-none">
      <div className="p-4 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#0f2d4a] flex items-center justify-center text-white shadow-xs">
            <FileText className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <div className="text-[13px] font-extrabold text-neutral-900 leading-tight tracking-tight uppercase">
              KÝ TÚC XÁ HÓC MÔN
            </div>
            <div className="text-[9px] font-bold text-teal-700 uppercase tracking-wider mt-0.5 leading-tight">
              TRUNG TÂM DỮ LIỆU SUẤT ĂN VÀ BÁO CÁO THỐNG KÊ
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
              currentTab === 'overview'
                ? 'bg-teal-50/80 text-teal-800 font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-neutral-500" />
            <span>Tổng quan</span>
          </button>

          <button
            onClick={() => setCurrentTab('report')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
              currentTab === 'report'
                ? 'bg-[#e7f5f3] text-[#0f766e] font-bold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <FileText className={`w-4 h-4 ${currentTab === 'report' ? 'text-[#0f766e]' : 'text-neutral-500'}`} />
            <span>Báo cáo suất ăn</span>
          </button>

          <button
            onClick={() => setCurrentTab('menu-sheet')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors text-left ${
              currentTab === 'menu-sheet'
                ? 'bg-teal-50/80 text-teal-800 font-semibold'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <FolderOpen className="w-4 h-4 text-neutral-500" />
            <span>Thực đơn nhà cung cấp</span>
          </button>
        </nav>
      </div>

      {/* Bottom Sidebar Box */}
      <div className="p-4 space-y-3">
        {/* Automation Card */}
        <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-neutral-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tự động hóa báo cáo</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-snug">
            Tải ảnh thực đơn để điền báo cáo nhanh hơn.
          </p>
        </div>

        {/* System Settings */}
        <button
          onClick={() => alert('Cài đặt hệ thống: Đã kích hoạt cấu hình tự động cho dự án Vinhomes Hóc Môn.')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors text-left"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Cài đặt hệ thống</span>
        </button>
      </div>
    </aside>
  );
};
