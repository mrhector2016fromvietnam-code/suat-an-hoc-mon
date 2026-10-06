import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar, Clock, Sparkles, Building2, CheckCircle2, TrendingUp } from 'lucide-react';
import { VendorPortionRow, MealShift } from '../types/report';
import { DAYS_OF_WEEK } from '../data/vinhomesMenuData';

interface RightSidebarSummaryProps {
  currentShift: MealShift;
  setCurrentShift: (shift: MealShift) => void;
  currentDateStr: string;
  setCurrentDateStr: (date: string) => void;
  currentDayOfWeek: string;
  setCurrentDayOfWeek: (day: string) => void;
  selectedVendor: VendorPortionRow;
  selectedVendorIds: string[];
  onToggleVendorId: (id: string) => void;
  allVendors: VendorPortionRow[];
}

export const RightSidebarSummary: React.FC<RightSidebarSummaryProps> = ({
  currentShift,
  setCurrentShift,
  currentDateStr,
  setCurrentDateStr,
  currentDayOfWeek,
  setCurrentDayOfWeek,
  selectedVendor,
  selectedVendorIds,
  onToggleVendorId,
  allVendors
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const shifts: { shift: MealShift; time: string }[] = [
    { shift: 'Bữa sáng', time: '06:00 - 08:30' },
    { shift: 'Bữa trưa', time: '11:00 - 13:30' },
    { shift: 'Bữa tối', time: '17:00 - 19:30' },
  ];

  const filteredVendors = allVendors.filter((v) =>
    v.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Stats
  const grandTotal = allVendors.reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);
  const selectedTotal = allVendors
    .filter((v) => selectedVendorIds.includes(v.id))
    .reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);

  return (
    <div className="space-y-5">
      {/* Dark Control & Shift Hub */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0b1e33] to-[#123154] text-white p-5 sm:p-6 shadow-sm space-y-4 border border-[#1b3d63]">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 uppercase">
              BỘ ĐIỀU KHIỂN CA ĂN
            </span>
            <span className="text-[11px] text-teal-200 font-semibold">
              Ký Túc Xá Hóc Môn
            </span>
          </div>

          {/* Shift Selection Segmented Buttons */}
          <div className="grid grid-cols-3 gap-1 mt-3 bg-black/30 p-1 rounded-xl border border-white/10">
            {shifts.map(({ shift, time }) => (
              <button
                key={shift}
                type="button"
                onClick={() => setCurrentShift(shift)}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  currentShift === shift
                    ? 'bg-teal-500 text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-300 hover:text-white font-medium hover:bg-white/5'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{shift}</div>
                <div className="text-[9px] opacity-70 leading-tight mt-0.5">{time}</div>
              </button>
            ))}
          </div>

          {/* Day / Date Quick Selector */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Ngày phục vụ:</span>
              </span>
              <select
                value={currentDayOfWeek}
                onChange={(e) => {
                  const dayObj = DAYS_OF_WEEK.find((d) => d.day === e.target.value);
                  if (dayObj) {
                    setCurrentDayOfWeek(dayObj.day);
                    setCurrentDateStr(dayObj.date);
                  }
                }}
                className="bg-[#0b1e33] text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-teal-500/40 focus:outline-none cursor-pointer"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.day} value={d.day} className="bg-[#0b1e33] text-white">
                    {d.day} ({d.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Metrics Card */}
        <div className="rounded-xl bg-white/10 p-3.5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300">Tổng suất ca {currentShift}:</span>
            <span className="text-lg font-black font-mono text-white">
              {grandTotal.toLocaleString('vi-VN')} <span className="text-xs font-normal text-teal-300">suất</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
            <span className="text-neutral-400">Suất đang chọn xuất:</span>
            <span className="font-bold font-mono text-teal-300">
              {selectedTotal.toLocaleString('vi-VN')} suất ({selectedVendorIds.length} NCC)
            </span>
          </div>
        </div>
      </div>

      {/* Vendor Status List Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between text-neutral-900 border-b border-neutral-100 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Danh Sách Nhà Cung Cấp ({allVendors.length})
            </h3>
            <p className="text-[11px] text-neutral-400">Nhấp để bật/tắt hiển thị trong báo cáo</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            {selectedVendorIds.length} Bật
          </span>
        </div>

        <div className="space-y-1.5">
          {filteredVendors.map((vendor) => {
            const isSelected = selectedVendorIds.includes(vendor.id);
            const vendorTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;

            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => onToggleVendorId(vendor.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/70 border border-teal-400 text-teal-950 font-semibold shadow-2xs'
                    : 'hover:bg-neutral-50 border border-neutral-100 text-neutral-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {vendor.code}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{vendor.name}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      TĐ8: {vendor.td8} · 11.1: {vendor.td11_1} · 11.3: {vendor.td11_3}
                    </div>
                  </div>
                </div>

                <span className={`text-xs px-2 py-1 rounded-lg font-mono font-bold ${
                  isSelected ? 'bg-teal-700 text-white' : 'text-neutral-400 bg-neutral-100'
                }`}>
                  {vendorTotal > 0 ? `${vendorTotal}s` : '0s'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
