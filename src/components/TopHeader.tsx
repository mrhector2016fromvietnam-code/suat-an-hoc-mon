import React from 'react';
import { RefreshCw } from 'lucide-react';

interface TopHeaderProps {
  onSync?: () => void;
  isSyncing?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSync, isSyncing = false }) => {
  return (
    <header className="h-16 px-4 sm:px-8 border-b border-neutral-200/90 bg-white flex items-center justify-between shrink-0">
      {/* Breadcrumb Left */}
      <div>
        <div className="text-sm sm:text-base font-black text-neutral-900 leading-tight uppercase tracking-tight">
          KÝ TÚC XÁ HÓC MÔN
        </div>
        <div className="text-[10px] sm:text-[11px] font-bold text-teal-700 leading-tight mt-0.5 uppercase tracking-wide">
          TRUNG TÂM DỮ LIỆU SUẤT ĂN VÀ BÁO CÁO THỐNG KÊ
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync / Refresh Data Button */}
        {onSync && (
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Đồng bộ và làm mới toàn bộ dữ liệu hệ thống mà không cần F5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-700 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Tải lại dữ liệu</span>
          </button>
        )}

        {/* System Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Hệ thống trực tuyến</span>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0d2a45] text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:opacity-90">
          AT
        </div>
      </div>
    </header>
  );
};
