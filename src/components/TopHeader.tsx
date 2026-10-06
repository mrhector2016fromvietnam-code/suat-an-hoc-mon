import React from 'react';

export const TopHeader: React.FC = () => {
  return (
    <header className="h-16 px-6 sm:px-8 border-b border-neutral-200/90 bg-white flex items-center justify-between shrink-0">
      {/* Breadcrumb Left */}
      <div>
        <div className="text-[11px] text-neutral-400 font-medium leading-none">
          Thông tin báo cáo
        </div>
        <div className="text-base font-bold text-neutral-900 leading-tight mt-0.5">
          Báo cáo suất ăn
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Status Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hệ thống đang hoạt động</span>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0d2a45] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:opacity-90">
          AT
        </div>
      </div>
    </header>
  );
};
