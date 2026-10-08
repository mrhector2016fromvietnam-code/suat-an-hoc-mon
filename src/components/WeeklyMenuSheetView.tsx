import React, { useState, useMemo } from 'react';
import { DAYS_OF_WEEK, getMenuForVendorAndShift, PRELOADED_MENUS } from '../data/vinhomesMenuData';
import { MealShift, DayShiftMenu } from '../types/report';
import { cleanDishName } from './ReportTextOutput';
import { DeleteMenuModal } from './DeleteMenuModal';
import { 
  Printer, Calendar, Check, Search, Filter, 
  ArrowRight, Edit3, Table, LayoutGrid, Eye, Plus, Sparkles,
  Columns, RotateCcw, Building2, Utensils, Coffee, Moon, Sun, CheckCircle2, Trash2,
  Save, X, Wand2, CheckSquare, Square
} from 'lucide-react';

interface WeeklyMenuSheetViewProps {
  onSelectDayShift: (day: string, shift: MealShift, vendorId?: string) => void;
  menusList: DayShiftMenu[];
  onUpdateMenu: (updatedMenu: DayShiftMenu) => void;
  onResetMenus?: () => void;
  onDeleteSelectedShifts?: (shiftsToDelete: { vendorId: string; dayOfWeek: string; shift: MealShift }[], action: 'clear' | 'reset-default') => void;
  onResetVendorMenus?: (vendorId: string) => void;
  onClearVendorMenus?: (vendorId: string) => void;
  onDeleteSingleShift?: (vendorId: string, dayOfWeek: string, shift: MealShift) => void;
  initialVendorId?: string;
}

export const WeeklyMenuSheetView: React.FC<WeeklyMenuSheetViewProps> = ({
  onSelectDayShift,
  menusList,
  onUpdateMenu,
  onResetMenus,
  onDeleteSelectedShifts,
  onResetVendorMenus,
  onClearVendorMenus,
  onDeleteSingleShift,
  initialVendorId = 'tam-phuong'
}) => {
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>(initialVendorId);
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards' | 'compare'>('matrix');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // QUICK INLINE EDIT STATE (Chỉnh sửa nhanh trực tiếp tại ô)
  const [isQuickEditModeActive, setIsQuickEditModeActive] = useState(false);
  const [activeInlineCellKey, setActiveInlineCellKey] = useState<string | null>(null);
  
  // Temporary edit buffer for active inline cell
  const [inlineMeat, setInlineMeat] = useState<string>('');
  const [inlineVeg, setInlineVeg] = useState<string>('');
  const [inlineMeatDessert, setInlineMeatDessert] = useState<string>('');
  const [inlineVegDessert, setInlineVegDessert] = useState<string>('');

  const vendors = [
    { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', color: 'bg-emerald-600', note: 'Suất ăn chuẩn & Bán trú' },
    { id: 'lim-duong', name: 'Lim Dương', code: 'LD', color: 'bg-blue-600', note: 'Có định lượng chi tiết' },
    { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', color: 'bg-amber-600', note: 'Đa dạng món Nam Bộ' },
    { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', color: 'bg-purple-600', note: 'Thực đơn ca đêm & tăng ca' },
    { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', color: 'bg-rose-600', note: 'Đậm đà hương vị truyền thống' },
    { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', color: 'bg-teal-600', note: 'Thực đơn xôi & món nóng' },
    { id: 'vina-story', name: 'Vina Story', code: 'VS', color: 'bg-indigo-600', note: 'Cháo dinh dưỡng & cơm kho' },
  ];

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const shifts: MealShift[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];

  const currentVendorObj = vendors.find((v) => v.id === selectedVendorFilter) || vendors[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Start inline editing for a specific cell
  const startInlineEdit = (vendorId: string, day: string, shift: MealShift) => {
    const currentMenu = getMenuForVendorAndShift(menusList, vendorId, day, shift);
    const key = `${vendorId}_${day}_${shift}`;
    setActiveInlineCellKey(key);
    setInlineMeat(currentMenu.meatDishes.map(cleanDishName).join(', '));
    setInlineVeg(currentMenu.vegDishes.map(cleanDishName).join(', '));
    setInlineMeatDessert(cleanDishName(currentMenu.meatDessert));
    setInlineVegDessert(cleanDishName(currentMenu.vegDessert));
  };

  // Save active inline edit directly
  const saveInlineEdit = (vendorId: string, day: string, shift: MealShift) => {
    const dayObj = DAYS_OF_WEEK.find((d) => d.day === day);
    const updated: DayShiftMenu = {
      vendorId,
      dayOfWeek: day,
      dateStr: dayObj?.date || '05/10/2026',
      shift,
      meatDishes: inlineMeat.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean),
      meatDessert: cleanDishName(inlineMeatDessert),
      vegDishes: inlineVeg.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean),
      vegDessert: cleanDishName(inlineVegDessert),
      isWeighedOk: true
    };
    onUpdateMenu(updated);
    setActiveInlineCellKey(null);
    showToast(`✓ Đã lưu trực tiếp món cho ${day} (${shift})!`);
  };

  // Cancel inline editing
  const cancelInlineEdit = () => {
    setActiveInlineCellKey(null);
  };

  // Revert single shift in inline edit to preloaded default
  const revertShiftToDefault = (vendorId: string, day: string, shift: MealShift) => {
    const defaultShift = PRELOADED_MENUS.find(
      (m) => m.vendorId === vendorId && m.dayOfWeek === day && m.shift === shift
    );
    if (defaultShift) {
      setInlineMeat(defaultShift.meatDishes.map(cleanDishName).join(', '));
      setInlineVeg(defaultShift.vegDishes.map(cleanDishName).join(', '));
      setInlineMeatDessert(cleanDishName(defaultShift.meatDessert));
      setInlineVegDessert(cleanDishName(defaultShift.vegDessert));
      onUpdateMenu(defaultShift);
      setActiveInlineCellKey(null);
      showToast(`✓ Đã khôi phục thực đơn gốc của ${day} (${shift})!`);
    }
  };

  // Filtered menus for CARDS view
  const filteredMenus = useMemo(() => {
    return menusList.filter((m) => {
      const matchesVendor = selectedVendorFilter === 'all' || m.vendorId === selectedVendorFilter;
      const matchesDay = selectedDayFilter === 'all' || m.dayOfWeek === selectedDayFilter;
      const matchesShift = selectedShiftFilter === 'all' || m.shift === selectedShiftFilter;
      const matchesSearch =
        !searchQuery ||
        (Array.isArray(m.meatDishes) && m.meatDishes.some((d) => (d || '').toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (Array.isArray(m.vegDishes) && m.vegDishes.some((d) => (d || '').toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (m.meatDessert || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.vegDessert || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesVendor && matchesDay && matchesShift && matchesSearch;
    });
  }, [menusList, selectedVendorFilter, selectedDayFilter, selectedShiftFilter, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-teal-700 hover:text-teal-950 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-1.5 pb-5 border-b border-neutral-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs uppercase tracking-wide">
          <Building2 className="w-3.5 h-3.5 text-teal-700" />
          <span>
            {currentVendorObj.id === 'tam-phuong'
              ? 'CÔNG TY TNHH SUẤT ĂN TÁM PHƯƠNG'
              : currentVendorObj.id === 'lim-duong'
              ? 'CÔNG TY CỔ PHẦN LIM DƯƠNG'
              : `NHÀ CUNG CẤP: ${currentVendorObj.name.toUpperCase()}`}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2d4a] uppercase tracking-tight">
          THỰC ĐƠN SUẤT ĂN CA CÔNG NHÂN (MẶN &amp; CHAY)
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-neutral-600 pt-1">
          <div>
            <strong className="text-neutral-900">Dự án:</strong> Ký Túc Xá Hóc Môn
          </div>
          <div className="hidden sm:inline text-neutral-300">|</div>
          <div>
            <strong className="text-neutral-900">Tuần phục vụ:</strong> từ ngày 05/10/2026 đến 11/10/2026
          </div>
          <div className="hidden sm:inline text-neutral-300">|</div>
          <div className="text-teal-700 font-semibold font-mono text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
            Chỉnh sửa trực tiếp tại ô · Đồng bộ tức thì
          </div>
        </div>
      </div>

      {/* Control Bar: Vendor Selection & Filter Tabs */}
      <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 text-xs">
        {/* Step 1: Select Vendor with prominent badges */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <Building2 className="w-4 h-4 text-teal-700" />
              Chọn nhà cung cấp để xem &amp; sửa thực đơn:
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">
              Đang xem: <strong className="text-teal-800 font-bold">{currentVendorObj.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {vendors.map((v) => {
              const isSelected = selectedVendorFilter === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendorFilter(v.id);
                    setActiveInlineCellKey(null);
                    showToast(`Đã chuyển thực đơn sang ${v.name}`);
                  }}
                  className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-700 shadow-sm ring-2 ring-teal-500/30'
                      : 'bg-white border-neutral-200 text-neutral-800 hover:border-teal-300 hover:bg-neutral-50/90'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`w-6 h-6 rounded-md text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                    }`}>
                      {v.code}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-teal-200" />
                    )}
                  </div>
                  <div className="font-bold text-xs leading-tight truncate">
                    {v.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${
                    isSelected ? 'text-teal-200' : 'text-neutral-400'
                  }`}>
                    {v.note}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Filters, View Toggle, Search, Quick Edit Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-neutral-200 items-center">
          {/* Day Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
            >
              <option value="all">Tất cả các ngày (Thứ 2 - CN)</option>
              {days.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Shift Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedShiftFilter}
              onChange={(e) => setSelectedShiftFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer text-xs"
            >
              <option value="all">Tất cả ca ăn (Sáng, Trưa, Tối)</option>
              <option value="Bữa sáng">Bữa sáng</option>
              <option value="Bữa trưa">Bữa trưa</option>
              <option value="Bữa tối">Bữa tối</option>
            </select>
          </div>

          {/* Search Dish */}
          <div className="sm:col-span-3 relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món: sữa đậu nành, cá nục..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Quick Edit Mode Toggle */}
          <div className="sm:col-span-3 flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsQuickEditModeActive(!isQuickEditModeActive);
                if (isQuickEditModeActive) {
                  setActiveInlineCellKey(null);
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isQuickEditModeActive
                  ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400/50'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
              title="Bật/Tắt chế độ nhấp vào ô bất kỳ để chỉnh sửa trực tiếp"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isQuickEditModeActive ? 'Đang sửa nhanh ON' : 'Chỉnh sửa nhanh'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Mở bảng chọn để xóa ca ăn hoặc khôi phục thực đơn up nhầm"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Xóa ca</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK EDIT HELPER BANNER */}
      {isQuickEditModeActive && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Chế độ Chỉnh sửa nhanh đang BẬT:</strong> Nhấp vào bất kỳ ô ca ăn nào trên bảng để sửa món ăn ngay tại chỗ. Bấm <strong>Lưu</strong> hoặc phím <strong>Enter</strong> để xác nhận.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsQuickEditModeActive(false)}
            className="text-amber-800 hover:text-amber-950 font-bold px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
          >
            Tắt sửa nhanh
          </button>
        </div>
      )}

      {/* MATRIX VIEW: Exact replica of official Vinhomes Catering Form WITH DIRECT INLINE EDITING */}
      {viewMode === 'matrix' && (
        <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-xs">
          <table className="w-full border-collapse text-left text-xs min-w-[800px]">
            <thead>
              <tr className="bg-[#0f2d4a] text-white divide-x divide-neutral-700">
                <th className="py-3 px-3.5 text-center w-28 uppercase text-[11px] font-bold">
                  Thứ / Ngày
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-300" />
                    <span>SÁNG (Ăn nhẹ - 20k)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Nhấp ô để sửa món trực tiếp</div>
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>TRƯA (Chính - 40k)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Nhấp ô để sửa món trực tiếp</div>
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span>TỐI (Tăng ca - 40k)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Nhấp ô để sửa món trực tiếp</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {days.map((day) => {
                const dayObj = DAYS_OF_WEEK.find((d) => d.day === day);
                const shiftsInRow: MealShift[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];

                if (selectedDayFilter !== 'all' && selectedDayFilter !== day) {
                  return null;
                }

                return (
                  <tr key={day} className="divide-x divide-neutral-200 hover:bg-neutral-50/40 transition-colors">
                    {/* Day Column */}
                    <td className="py-3.5 px-3 text-center bg-neutral-50/70 font-bold text-neutral-900 align-top">
                      <div className="text-xs font-extrabold">{day}</div>
                      <div className="text-[11px] text-neutral-500 font-normal font-mono mt-0.5">
                        {dayObj?.date || ''}
                      </div>
                      <div className="mt-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                        {currentVendorObj.code}
                      </div>
                    </td>

                    {/* 3 Shifts Cells */}
                    {shiftsInRow.map((shiftName) => {
                      const cellKey = `${selectedVendorFilter}_${day}_${shiftName}`;
                      const isEditingThisCell = activeInlineCellKey === cellKey;
                      const menu = getMenuForVendorAndShift(menusList, selectedVendorFilter, day, shiftName);

                      return (
                        <td
                          key={shiftName}
                          onClick={() => {
                            if (!isEditingThisCell && isQuickEditModeActive) {
                              startInlineEdit(selectedVendorFilter, day, shiftName);
                            }
                          }}
                          className={`py-3 px-3 align-top space-y-2 transition-all ${
                            isEditingThisCell
                              ? 'bg-amber-50/70 ring-2 ring-amber-400 p-3 rounded-lg'
                              : isQuickEditModeActive
                              ? 'cursor-pointer hover:bg-amber-50/30'
                              : ''
                          }`}
                        >
                          {/* INLINE EDIT MODE FOR THIS CELL */}
                          {isEditingThisCell ? (
                            <div className="space-y-2.5 animate-fade-in text-xs">
                              <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                                <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1">
                                  <Edit3 className="w-3 h-3 text-amber-600" />
                                  <span>Sửa trực tiếp: {day} ({shiftName})</span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => revertShiftToDefault(selectedVendorFilter, day, shiftName)}
                                    className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-amber-100 rounded cursor-pointer"
                                    title="Khôi phục món gốc của ca này"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelInlineEdit}
                                    className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-amber-100 rounded cursor-pointer"
                                    title="Hủy sửa"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Món Mặn Input */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-emerald-900 block">
                                  Món mặn (cách nhau dấu phẩy):
                                </label>
                                <textarea
                                  rows={2}
                                  value={inlineMeat}
                                  onChange={(e) => setInlineMeat(e.target.value)}
                                  placeholder="Cơm trắng, Thịt kho, Canh..."
                                  className="w-full p-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              {/* Món Chay Input */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-amber-900 block">
                                  Món chay (cách nhau dấu phẩy):
                                </label>
                                <textarea
                                  rows={2}
                                  value={inlineVeg}
                                  onChange={(e) => setInlineVeg(e.target.value)}
                                  placeholder="Cơm trắng, Đậu hũ kho, Canh chay..."
                                  className="w-full p-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                              </div>

                              {/* Tráng miệng Input */}
                              <div className="grid grid-cols-2 gap-1.5">
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-700 block">
                                    Tráng miệng mặn:
                                  </label>
                                  <input
                                    type="text"
                                    value={inlineMeatDessert}
                                    onChange={(e) => setInlineMeatDessert(e.target.value)}
                                    placeholder="Dưa hấu..."
                                    className="w-full p-1 rounded-lg border border-neutral-300 bg-white text-xs font-medium focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-700 block">
                                    Tráng miệng chay:
                                  </label>
                                  <input
                                    type="text"
                                    value={inlineVegDessert}
                                    onChange={(e) => setInlineVegDessert(e.target.value)}
                                    placeholder="Sữa đậu nành..."
                                    className="w-full p-1 rounded-lg border border-neutral-300 bg-white text-xs font-medium focus:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Action buttons inside cell */}
                              <div className="pt-1 flex items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={cancelInlineEdit}
                                  className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-semibold text-[11px] cursor-pointer"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveInlineEdit(selectedVendorFilter, day, shiftName)}
                                  className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Lưu thay đổi</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* STANDARD VIEW FOR THIS CELL (Step 3.4 requirement) */
                            <>
                              <div className="space-y-1.5">
                              {/* Món Mặn */}
                              <div>
                                <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider mb-0.5">
                                  Món mặn:
                                </div>
                                {menu && menu.meatDishes && menu.meatDishes.length > 0 ? (
                                  <div className="space-y-1">
                                    {menu.meatDishes
                                      .flatMap((dishStr) => dishStr.split(/,(?![^()]*\))/).map((s) => s.trim()).filter(Boolean))
                                      .map((dishStr, dIdx) => {
                                        // Check if has dash or paren quantity
                                        let name = dishStr;
                                        let portions = '';

                                        if (dishStr.includes(' — ')) {
                                          const parts = dishStr.split(' — ');
                                          name = parts[0];
                                          portions = parts[1] || '';
                                        } else {
                                          const parenMatch = dishStr.match(/^(.*?)\s*\((.*?)\)$/);
                                          if (parenMatch) {
                                            name = parenMatch[1];
                                            portions = parenMatch[2];
                                          }
                                        }

                                        return (
                                          <div key={dIdx} className="flex items-start gap-1.5 text-xs leading-snug">
                                            <span className="text-teal-700 font-bold shrink-0 mt-0.5">•</span>
                                            <div className="flex-1 flex flex-wrap items-baseline gap-1">
                                              <span className="font-bold text-neutral-900">{name}</span>
                                              {portions && (
                                                <span className="text-[10px] font-mono font-medium text-teal-800 bg-teal-50 px-1 py-0.2 rounded border border-teal-200">
                                                  {portions}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : (
                                  <span className="text-neutral-400 italic text-[11px]">Chưa có món mặn</span>
                                )}
                              </div>

                              {/* Món Chay */}
                              <div className="pt-1 border-t border-neutral-100">
                                <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider mb-0.5">
                                  Món chay:
                                </div>
                                {menu && menu.vegDishes && menu.vegDishes.length > 0 ? (
                                  <div className="space-y-1">
                                    {menu.vegDishes
                                      .flatMap((dishStr) => dishStr.split(/,(?![^()]*\))/).map((s) => s.trim()).filter(Boolean))
                                      .map((dishStr, dIdx) => {
                                        let name = dishStr;
                                        let portions = '';

                                        if (dishStr.includes(' — ')) {
                                          const parts = dishStr.split(' — ');
                                          name = parts[0];
                                          portions = parts[1] || '';
                                        } else {
                                          const parenMatch = dishStr.match(/^(.*?)\s*\((.*?)\)$/);
                                          if (parenMatch) {
                                            name = parenMatch[1];
                                            portions = parenMatch[2];
                                          }
                                        }

                                        return (
                                          <div key={dIdx} className="flex items-start gap-1.5 text-xs leading-snug">
                                            <span className="text-amber-700 font-bold shrink-0 mt-0.5">•</span>
                                            <div className="flex-1 flex flex-wrap items-baseline gap-1">
                                              <span className="font-bold text-amber-950">{name}</span>
                                              {portions && (
                                                <span className="text-[10px] font-mono font-medium text-amber-900 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                                                  {portions}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                ) : (
                                  <span className="text-neutral-400 italic text-[11px]">Chưa có món chay</span>
                                )}
                              </div>

                              {/* Tráng miệng (NO placeholder "Trái cây theo mùa") */}
                              <div className="pt-1 border-t border-neutral-100 text-[11px]">
                                <span className="font-extrabold text-emerald-800 text-[10px] uppercase tracking-wider mr-1">
                                  Tráng miệng:
                                </span>
                                {(menu?.meatDessert || menu?.vegDessert) ? (
                                  <span className="font-semibold text-emerald-950">
                                    {menu.meatDessert || menu.vegDessert}
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">—</span>
                                )}
                              </div>
                            </div>

                              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectDayShift(day, shiftName, selectedVendorFilter);
                                    showToast(`Đã áp dụng ${day} (${shiftName}) của ${currentVendorObj.name} vào báo cáo!`);
                                  }}
                                  className="text-[11px] text-teal-700 hover:text-teal-900 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>Nạp vào báo cáo</span> &rarr;
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startInlineEdit(selectedVendorFilter, day, shiftName);
                                    }}
                                    className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                                    title="Sửa nhanh trực tiếp tại ô này"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-teal-700" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onDeleteSingleShift) {
                                        onDeleteSingleShift(selectedVendorFilter, day, shiftName);
                                      }
                                    }}
                                    className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                    title="Xóa/làm mới ca này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenus.map((item, idx) => {
            const vendor = vendors.find((v) => v.id === item.vendorId) || currentVendorObj;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-teal-400 hover:shadow-xs transition-all space-y-3 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <span className="font-bold text-neutral-900">{item.dayOfWeek}</span>
                      <span className="text-neutral-500 font-mono ml-2">({item.dateStr})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold text-teal-900 bg-teal-100 text-[11px]">
                      {item.shift}
                    </span>
                  </div>

                  <div className="pt-2 text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>NCC: <strong>{vendor.name}</strong></span>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-100 space-y-1">
                      <span className="font-bold text-neutral-900 block">• Món mặn:</span>
                      <p className="text-neutral-700 leading-relaxed">{item.meatDishes.join(', ')}</p>
                      <div className="text-[11px] text-neutral-500 pt-0.5">
                        Tráng miệng: <strong className="text-neutral-800">{item.meatDessert}</strong>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 space-y-1">
                      <span className="font-bold text-amber-900 block">• Món chay:</span>
                      <p className="text-neutral-700 leading-relaxed">{item.vegDishes.join(', ')}</p>
                      <div className="text-[11px] text-neutral-500 pt-0.5">
                        Tráng miệng chay: <strong className="text-emerald-700">{item.vegDessert}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('matrix');
                        startInlineEdit(item.vendorId || selectedVendorFilter, item.dayOfWeek, item.shift);
                      }}
                      className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa nhanh
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteSingleShift) {
                          onDeleteSingleShift(item.vendorId || selectedVendorFilter, item.dayOfWeek, item.shift);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                      title="Xóa món ca này"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDayShift(item.dayOfWeek, item.shift, item.vendorId);
                      showToast(`Đã chọn ${item.dayOfWeek} (${item.shift}) vào báo cáo!`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Chọn ca này</span> &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Delete / Revert Modal */}
      <DeleteMenuModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        vendors={vendors}
        menusList={menusList}
        initialVendorId={selectedVendorFilter}
        onDeleteSelectedShifts={onDeleteSelectedShifts || (() => {})}
        onResetVendorMenus={onResetVendorMenus || (() => {})}
        onClearVendorMenus={onClearVendorMenus || (() => {})}
      />
    </div>
  );
};
