import React, { useState } from 'react';
import { Filter, ChevronDown, Calendar, Clock } from 'lucide-react';
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

  const shifts: MealShift[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];

  const filteredVendors = allVendors.filter((v) =>
    v.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Dark Summary Card */}
      <div className="rounded-2xl bg-[#0f2d4a] text-white p-6 shadow-sm space-y-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-teal-400 uppercase">
            TÓM TẮT BÁO CÁO
          </div>

          {/* Shift Selection Pills */}
          <div className="flex items-center gap-1.5 mt-2 bg-[#173b5e] p-1 rounded-xl">
            {shifts.map((shift) => (
              <button
                key={shift}
                onClick={() => setCurrentShift(shift)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                  currentShift === shift
                    ? 'bg-teal-500 text-white shadow-2xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {shift}
              </button>
            ))}
          </div>

          {/* Day / Date Selector */}
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-300">
            <select
              value={currentDayOfWeek}
              onChange={(e) => {
                const dayObj = DAYS_OF_WEEK.find((d) => d.day === e.target.value);
                if (dayObj) {
                  setCurrentDayOfWeek(dayObj.day);
                  setCurrentDateStr(dayObj.date);
                }
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.day} value={d.day} className="bg-[#0f2d4a] text-white">
                  {d.day} ({d.date})
                </option>
              ))}
            </select>
            <span className="text-neutral-400">Vinhomes Hóc Môn</span>
          </div>
        </div>

        {/* Inner Card */}
        <div className="rounded-xl bg-[#173b5e] p-4 space-y-1">
          <div className="text-[11px] text-neutral-400 font-medium">Nhà cung cấp đang chọn ({selectedVendorIds.length})</div>
          <div className="text-base font-bold text-white truncate">
            {selectedVendorIds.length === 1
              ? selectedVendor.name
              : `${selectedVendorIds.length} Nhà cung cấp đang được chọn`}
          </div>
          <div className="text-[11px] text-teal-300 pt-0.5">Khu bếp / nhà ăn</div>
        </div>
      </div>

      {/* Vendor List Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between text-neutral-900">
          <h3 className="text-sm font-bold">Nhà cung cấp ({selectedVendorIds.length}/{allVendors.length})</h3>
          <span className="text-[11px] text-neutral-400">Bấm để bật/tắt</span>
        </div>

        <div className="space-y-1.5">
          {filteredVendors.map((vendor) => {
            const isSelected = selectedVendorIds.includes(vendor.id);
            const vendorTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;

            return (
              <button
                key={vendor.id}
                onClick={() => onToggleVendorId(vendor.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-teal-50/90 border border-teal-400 text-teal-950 font-semibold'
                    : 'hover:bg-neutral-50 border border-neutral-100 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {vendor.code}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{vendor.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {vendorTotal > 0 ? `${vendorTotal} suất` : 'Chưa có suất'}
                    </div>
                  </div>
                </div>

                <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-teal-600 text-white' : 'text-neutral-400 bg-neutral-100'
                }`}>
                  {isSelected ? 'Đã chọn' : '+'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
