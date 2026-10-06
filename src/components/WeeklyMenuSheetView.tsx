import React, { useState, useMemo } from 'react';
import { DAYS_OF_WEEK, getMenuForVendorAndShift } from '../data/vinhomesMenuData';
import { MealShift, DayShiftMenu } from '../types/report';
import { cleanDishName } from './ReportTextOutput';
import { DeleteMenuModal } from './DeleteMenuModal';
import { 
  Printer, Calendar, Check, Search, Filter, 
  ArrowRight, Edit3, Table, LayoutGrid, Eye, Plus, Sparkles,
  Columns, RotateCcw, Building2, Utensils, Coffee, Moon, Sun, CheckCircle2, Trash2
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

  // Edit modal state
  const [editingItem, setEditingItem] = useState<DayShiftMenu | null>(null);
  const [editMeat, setEditMeat] = useState('');
  const [editMeatDessert, setEditMeatDessert] = useState('');
  const [editVeg, setEditVeg] = useState('');
  const [editVegDessert, setEditVegDessert] = useState('');

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

  // Open edit modal
  const openEdit = (menu: DayShiftMenu) => {
    setEditingItem(menu);
    setEditMeat(menu.meatDishes.join(', '));
    setEditMeatDessert(menu.meatDessert);
    setEditVeg(menu.vegDishes.join(', '));
    setEditVegDessert(menu.vegDessert);
  };

  const handleSaveModal = () => {
    if (!editingItem) return;
    const updated: DayShiftMenu = {
      ...editingItem,
      meatDishes: editMeat.split(',').map((s) => s.trim()).filter(Boolean),
      meatDessert: editMeatDessert.trim(),
      vegDishes: editVeg.split(',').map((s) => s.trim()).filter(Boolean),
      vegDessert: editVegDessert.trim(),
    };
    onUpdateMenu(updated);
    setEditingItem(null);
    showToast(`Đã lưu cập nhật món cho ${updated.dayOfWeek} (${updated.shift}) của ${currentVendorObj.name}!`);
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
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner matching Image 4 with dynamic vendor branding */}
      <div className="text-center space-y-1.5 pb-5 border-b border-neutral-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-xs uppercase tracking-wide">
          <Building2 className="w-3.5 h-3.5" />
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
          <div className="text-red-600 font-semibold font-mono text-[11px] bg-red-50/80 px-2 py-0.5 rounded border border-red-100">
            SINV =&gt; nghiêm cấm thay đổi form
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
              Chọn nhà cung cấp để xem &amp; chuyển thực đơn:
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">
              Đang xem thực đơn của: <strong className="text-teal-800">{currentVendorObj.name}</strong>
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

        {/* Step 2: Filters, View Toggle, Search */}
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
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món: sữa đậu nành, cá nục, sườn..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'matrix'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="Chế độ bảng ma trận giống mẫu giấy"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Bảng mẫu</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'cards'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="Chế độ thẻ ngày chi tiết"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Thẻ</span>
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'compare'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="So sánh thực đơn các NCC trong ngày"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>So sánh NCC</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50/70 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
              title="Mở bảng chọn để xóa ca ăn hoặc khôi phục thực đơn up nhầm"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Xóa thực đơn</span>
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW: Exact replica of official Vinhomes Catering Form */}
      {viewMode === 'matrix' && (
        <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-xs">
          <table className="w-full border-collapse text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-[#0f2d4a] text-white divide-x divide-neutral-700">
                <th className="py-3 px-3.5 text-center w-28 uppercase text-[11px] font-bold">
                  Thứ / Ngày
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-300" />
                    <span>SÁNG (Ăn nhẹ)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Món chính + Món chay + Tráng miệng</div>
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>TRƯA (Chính)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Món mặn + Món chay + Tráng miệng</div>
                </th>
                <th className="py-3 px-3.5 w-1/3">
                  <div className="font-bold uppercase flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span>TỐI (Tăng ca)</span>
                  </div>
                  <div className="text-[10px] text-teal-300 font-normal">Món mặn + Món chay + Tráng miệng</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {days.map((day) => {
                const dayObj = DAYS_OF_WEEK.find((d) => d.day === day);
                const morning = getMenuForVendorAndShift(menusList, selectedVendorFilter, day, 'Bữa sáng');
                const lunch = getMenuForVendorAndShift(menusList, selectedVendorFilter, day, 'Bữa trưa');
                const dinner = getMenuForVendorAndShift(menusList, selectedVendorFilter, day, 'Bữa tối');

                if (selectedDayFilter !== 'all' && selectedDayFilter !== day) {
                  return null;
                }

                return (
                  <tr key={day} className="divide-x divide-neutral-200 hover:bg-neutral-50/60 transition-colors">
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

                    {/* Sáng */}
                    <td className="py-3.5 px-3.5 align-top space-y-2">
                      {morning ? (
                        <>
                          <div>
                            <div className="font-bold text-neutral-900 leading-snug">
                              {morning.meatDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-amber-800 mt-1">
                              <strong>Chay:</strong> {morning.vegDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Tráng miệng: {cleanDishName(morning.vegDessert || morning.meatDessert)}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectDayShift(day, 'Bữa sáng', selectedVendorFilter);
                                showToast(`Đã áp dụng ${day} (Bữa sáng) của ${currentVendorObj.name} vào báo cáo!`);
                              }}
                              className="text-[11px] text-teal-700 hover:text-teal-900 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Chọn nạp báo cáo</span> &rarr;
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEdit(morning)}
                                className="p-1 rounded text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                                title="Chỉnh sửa món"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onDeleteSingleShift) {
                                    onDeleteSingleShift(selectedVendorFilter, day, 'Bữa sáng');
                                  }
                                }}
                                className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                title="Xóa món ca này (nếu up nhầm)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-neutral-400 italic">Chưa có dữ liệu</span>
                      )}
                    </td>

                    {/* Trưa */}
                    <td className="py-3.5 px-3.5 align-top space-y-2">
                      {lunch ? (
                        <>
                          <div>
                            <div className="font-bold text-neutral-900 leading-snug">
                              {lunch.meatDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-amber-800 mt-1">
                              <strong>Chay:</strong> {lunch.vegDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Tráng miệng: {cleanDishName(lunch.meatDessert)}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectDayShift(day, 'Bữa trưa', selectedVendorFilter);
                                showToast(`Đã áp dụng ${day} (Bữa trưa) của ${currentVendorObj.name} vào báo cáo!`);
                              }}
                              className="text-[11px] text-teal-700 hover:text-teal-900 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Chọn nạp báo cáo</span> &rarr;
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEdit(lunch)}
                                className="p-1 rounded text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                                title="Chỉnh sửa món"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onDeleteSingleShift) {
                                    onDeleteSingleShift(selectedVendorFilter, day, 'Bữa trưa');
                                  }
                                }}
                                className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                title="Xóa món ca này (nếu up nhầm)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-neutral-400 italic">Chưa có dữ liệu</span>
                      )}
                    </td>

                    {/* Tối */}
                    <td className="py-3.5 px-3.5 align-top space-y-2">
                      {dinner ? (
                        <>
                          <div>
                            <div className="font-bold text-neutral-900 leading-snug">
                              {dinner.meatDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-amber-800 mt-1">
                              <strong>Chay:</strong> {dinner.vegDishes.map(cleanDishName).join(', ')}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Tráng miệng: {cleanDishName(dinner.meatDessert)}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectDayShift(day, 'Bữa tối', selectedVendorFilter);
                                showToast(`Đã áp dụng ${day} (Bữa tối) của ${currentVendorObj.name} vào báo cáo!`);
                              }}
                              className="text-[11px] text-teal-700 hover:text-teal-900 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Chọn nạp báo cáo</span> &rarr;
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEdit(dinner)}
                                className="p-1 rounded text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 cursor-pointer"
                                title="Chỉnh sửa món"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onDeleteSingleShift) {
                                    onDeleteSingleShift(selectedVendorFilter, day, 'Bữa tối');
                                  }
                                }}
                                className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                title="Xóa món ca này (nếu up nhầm)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <span className="text-neutral-400 italic">Chưa có dữ liệu</span>
                      )}
                    </td>
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
                      onClick={() => openEdit(item)}
                      className="text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Sửa món
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteSingleShift) {
                          onDeleteSingleShift(item.vendorId || selectedVendorFilter, item.dayOfWeek, item.shift);
                        }
                      }}
                      className="text-neutral-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                      title="Xóa/khôi phục món ca này nếu up nhầm"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa món
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDayShift(item.dayOfWeek, item.shift, item.vendorId);
                      showToast(`Đã áp dụng vào báo cáo (${item.dayOfWeek} ${item.shift})!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0f2d4a] hover:bg-[#163e66] text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Áp dụng vào báo cáo</span> &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COMPARISON VIEW: Side-by-side NCC Comparison on Selected Day */}
      {viewMode === 'compare' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-teal-50/80 p-3 rounded-xl border border-teal-200">
            <span className="font-bold text-teal-950 text-xs">
              Đang so sánh thực đơn các NCC cho ngày: <strong>{selectedDayFilter === 'all' ? 'Thứ 2' : selectedDayFilter}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDayFilter(d)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    (selectedDayFilter === 'all' ? 'Thứ 2' : selectedDayFilter) === d
                      ? 'bg-teal-700 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => {
              const activeDay = selectedDayFilter === 'all' ? 'Thứ 2' : selectedDayFilter;
              const lunchMenu = getMenuForVendorAndShift(menusList, v.id, activeDay, 'Bữa trưa');
              const dinnerMenu = getMenuForVendorAndShift(menusList, v.id, activeDay, 'Bữa tối');
              const morningMenu = getMenuForVendorAndShift(menusList, v.id, activeDay, 'Bữa sáng');

              return (
                <div
                  key={v.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold font-mono flex items-center justify-center text-xs">
                        {v.code}
                      </span>
                      <div>
                        <div className="font-bold text-neutral-900">{v.name}</div>
                        <div className="text-[10px] text-neutral-400">{v.note}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="font-bold text-neutral-800 mb-0.5">Sáng:</div>
                      <div className="text-neutral-700 text-[11px]">{morningMenu.meatDishes.join(', ')}</div>
                      <div className="text-emerald-700 text-[10px] font-semibold mt-0.5">
                        Tráng miệng: {morningMenu.vegDessert || morningMenu.meatDessert}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="font-bold text-neutral-800 mb-0.5">Trưa:</div>
                      <div className="text-neutral-700 text-[11px]">{lunchMenu.meatDishes.join(', ')}</div>
                      <div className="text-neutral-500 text-[10px] mt-0.5">
                        Chay: {lunchMenu.vegDishes.join(', ')}
                      </div>
                      <div className="text-emerald-700 text-[10px] font-semibold mt-0.5">
                        Tráng miệng: {lunchMenu.meatDessert}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                      <div className="font-bold text-neutral-800 mb-0.5">Tối:</div>
                      <div className="text-neutral-700 text-[11px]">{dinnerMenu.meatDishes.join(', ')}</div>
                      <div className="text-emerald-700 text-[10px] font-semibold mt-0.5">
                        Tráng miệng: {dinnerMenu.meatDessert}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVendorFilter(v.id);
                      setViewMode('matrix');
                      showToast(`Đã chọn xem thực đơn đầy đủ tuần của ${v.name}`);
                    }}
                    className="w-full py-1.5 rounded-xl border border-teal-300 text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold text-center text-xs transition-colors cursor-pointer"
                  >
                    Xem toàn bộ tuần của {v.name} &rarr;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Modal Dialog */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 text-xs animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Chỉnh Sửa Thực Đơn {editingItem.dayOfWeek} ({editingItem.shift})
                </h3>
                <span className="text-[11px] text-teal-700 font-medium">
                  Nhà cung cấp: {currentVendorObj.name} · Ngày {editingItem.dateStr}
                </span>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-800">Các món mặn (ngăn cách dấu phẩy):</label>
                <textarea
                  rows={2}
                  value={editMeat}
                  onChange={(e) => setEditMeat(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800">Món tráng miệng mặn:</label>
                <input
                  type="text"
                  value={editMeatDessert}
                  onChange={(e) => setEditMeatDessert(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="space-y-1 pt-1 border-t border-neutral-100">
                <label className="font-bold text-neutral-800">Các món chay (ngăn cách dấu phẩy):</label>
                <textarea
                  rows={2}
                  value={editVeg}
                  onChange={(e) => setEditVeg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800">
                  Món tráng miệng chay (VD: Sữa đậu nành, Ổi, Chuối, Sữa chua...):
                </label>
                <input
                  type="text"
                  value={editVegDessert}
                  onChange={(e) => setEditVegDessert(e.target.value)}
                  className="w-full p-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-700 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer transition-colors"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Menu Modal */}
      <DeleteMenuModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        vendors={vendors}
        menusList={menusList}
        initialVendorId={selectedVendorFilter}
        onDeleteSelectedShifts={(shifts, action) => {
          if (onDeleteSelectedShifts) {
            onDeleteSelectedShifts(shifts, action);
          }
        }}
        onResetVendorMenus={(vId) => {
          if (onResetVendorMenus) {
            onResetVendorMenus(vId);
          }
        }}
        onClearVendorMenus={(vId) => {
          if (onClearVendorMenus) {
            onClearVendorMenus(vId);
          }
        }}
      />
    </div>
  );
};
