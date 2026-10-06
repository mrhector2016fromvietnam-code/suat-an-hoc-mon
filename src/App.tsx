/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { MenuUploadDropzone } from './components/MenuUploadDropzone';
import { PortionInputTable } from './components/PortionInputTable';
import { ReportTextOutput } from './components/ReportTextOutput';
import { RightSidebarSummary } from './components/RightSidebarSummary';
import { WeeklyMenuSheetView } from './components/WeeklyMenuSheetView';
import { DEFAULT_VENDORS, PRELOADED_MENUS, DAYS_OF_WEEK, getMenuForVendorAndShift } from './data/vinhomesMenuData';
import { VendorPortionRow, MealShift, DayShiftMenu } from './types/report';
import { FileText, Sparkles, Check, RefreshCw, AlertCircle, Building2, Utensils, CheckCircle2 } from 'lucide-react';

// Cache key v5 ensures old wrong caches are superseded
const STORAGE_KEY_MENUS = 'vinhomes_weekly_menus_cache_v5';
const STORAGE_KEY_VENDORS = 'vinhomes_vendors_headcount_cache_v5';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'report' | 'menu-sheet'>('report');
  
  // Vendors headcount data (initialized from Screenshot 2)
  const [vendors, setVendors] = useState<VendorPortionRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VENDORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_VENDORS;
  });

  // Multi-vendor selection: supports selecting one or multiple vendors simultaneously
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(['tam-phuong']);
  
  // Date & Shift state (initialized from Screenshot 1 & 3: Bữa tối, 05/10/2026)
  const [currentShift, setCurrentShift] = useState<MealShift>('Bữa tối');
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<string>('Thứ 2');
  const [currentDateStr, setCurrentDateStr] = useState<string>('05/10/2026');

  // Menus list with persistence
  const [menusList, setMenusList] = useState<DayShiftMenu[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENUS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PRELOADED_MENUS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(menusList));
    } catch (e) {}
  }, [menusList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
    } catch (e) {}
  }, [vendors]);

  // Menu name tracking
  const [activeMenuName, setActiveMenuName] = useState<string>(
    'Menu Tuần 05/10 - 11/10/2026 · Tám Phương, Lim Dương & Các NCC'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Current primary active vendor
  const primarySelectedVendor = vendors.find((v) => v.id === selectedVendorIds[0]) || vendors[0];

  // Headcount cell updater
  const handleUpdateVendorPortion = (
    id: string,
    field: 'td8' | 'td11_1' | 'td11_3',
    value: number
  ) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  // Upload image handler
  const handleImageUploaded = (file: File) => {
    setActiveMenuName(`Đã tải: ${file.name} · Tự động khớp thực đơn`);
    showToast(`Đã nhận diện ảnh thực đơn: ${file.name}!`);
  };

  // Select day & shift from weekly sheet, with vendor selection
  const handleSelectDayShiftFromSheet = (day: string, shift: MealShift, vendorId?: string) => {
    const dayObj = DAYS_OF_WEEK.find((d) => d.day === day);
    if (dayObj) {
      setCurrentDayOfWeek(day);
      setCurrentDateStr(dayObj.date);
      setCurrentShift(shift);
      if (vendorId) {
        setSelectedVendorIds([vendorId]);
      }
      setCurrentTab('report');
      showToast(`Đã nạp thực đơn ${day} (${shift}) vào báo cáo!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Menu updater for a specific vendor
  const handleUpdateVendorMenu = (vendorId: string, partial: Partial<DayShiftMenu>) => {
    setMenusList((prev) => {
      let found = false;
      const next = prev.map((m) => {
        if (m.vendorId === vendorId && m.dayOfWeek === currentDayOfWeek && m.shift === currentShift) {
          found = true;
          return { ...m, ...partial };
        }
        return m;
      });

      if (!found) {
        next.push({
          vendorId,
          dayOfWeek: currentDayOfWeek,
          dateStr: currentDateStr,
          shift: currentShift,
          meatDishes: partial.meatDishes || ['Cơm trắng', 'Món mặn'],
          meatDessert: partial.meatDessert || 'Trái cây',
          vegDishes: partial.vegDishes || ['Cơm trắng', 'Món chay'],
          vegDessert: partial.vegDessert || 'Trái cây',
          isWeighedOk: true,
          ...partial
        });
      }

      return next;
    });
    showToast('Đã lưu thay đổi món ăn vào thực đơn!');
  };

  // Menu updater from weekly sheet modal
  const handleUpdateMenu = (updatedMenu: DayShiftMenu) => {
    setMenusList((prev) => {
      let found = false;
      const next = prev.map((m) => {
        if (m.vendorId === updatedMenu.vendorId && m.dayOfWeek === updatedMenu.dayOfWeek && m.shift === updatedMenu.shift) {
          found = true;
          return { ...m, ...updatedMenu };
        }
        return m;
      });
      if (!found) {
        next.push(updatedMenu);
      }
      return next;
    });
  };

  // Toggle vendor ID from sidebar, table, or pills
  const handleToggleVendorId = (id: string) => {
    if (selectedVendorIds.includes(id)) {
      if (selectedVendorIds.length > 1) {
        setSelectedVendorIds(selectedVendorIds.filter((vId) => vId !== id));
      } else {
        showToast('Cần giữ ít nhất 1 nhà cung cấp trong báo cáo');
      }
    } else {
      setSelectedVendorIds([...selectedVendorIds, id]);
    }
  };

  // Reset default menus
  const handleResetDefaultData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_MENUS);
      localStorage.removeItem(STORAGE_KEY_VENDORS);
    } catch (e) {}
    setMenusList(PRELOADED_MENUS);
    setVendors(DEFAULT_VENDORS);
    showToast('Đã khôi phục toàn bộ thực đơn và số liệu gốc chính xác của 7 nhà cung cấp!');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-neutral-900 font-sans selection:bg-teal-600 selection:text-white">
      {/* Left Sidebar matching Screenshot 1 */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header matching Screenshot 1 */}
        <TopHeader />

        {/* Workspace Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Toast */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center justify-between animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-teal-700 hover:text-teal-900 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {currentTab === 'menu-sheet' ? (
            <WeeklyMenuSheetView
              onSelectDayShift={handleSelectDayShiftFromSheet}
              menusList={menusList}
              onUpdateMenu={handleUpdateMenu}
              onResetMenus={handleResetDefaultData}
              initialVendorId={selectedVendorIds[0] || 'tam-phuong'}
            />
          ) : currentTab === 'overview' ? (
            /* Overview Tab */
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    Tổng quan hệ thống báo cáo suất ăn
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                    Dự án Vinhomes Hóc Môn · Giám sát 7 nhà cung cấp suất ăn công nghiệp &amp; bán trú
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentTab('report')}
                    className="px-4 py-2 rounded-xl bg-[#0f2d4a] hover:bg-[#163e66] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đến trang tạo báo cáo &rarr;
                  </button>
                </div>
              </div>

              {/* NCC Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => {
                  const total = vendor.td8 + vendor.td11_1 + vendor.td11_3;
                  const menu = getMenuForVendorAndShift(menusList, vendor.id, currentDayOfWeek, currentShift);

                  return (
                    <div
                      key={vendor.id}
                      className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-teal-400 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold font-mono flex items-center justify-center text-xs">
                            {vendor.code}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-neutral-900">{vendor.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              Tổng suất: <strong className="text-teal-900 font-bold">{total > 0 ? `${total} suất` : 'Chưa nhập'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-neutral-100 text-xs space-y-1">
                        <div className="text-neutral-500 text-[11px] font-semibold">
                          Thực đơn {currentDayOfWeek} ({currentShift}):
                        </div>
                        <div className="font-medium text-neutral-800 line-clamp-2">
                          {menu.meatDishes.join(', ')}
                        </div>
                        <div className="text-emerald-700 text-[11px] font-medium pt-0.5">
                          Tráng miệng: {menu.meatDessert} (Chay: {menu.vegDessert})
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVendorIds([vendor.id]);
                          setCurrentTab('report');
                        }}
                        className="w-full py-2 rounded-xl bg-neutral-100 hover:bg-teal-50 hover:text-teal-800 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Tạo báo cáo cho {vendor.name} &rarr;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Report Tab */
            <>
              {/* Header Title Section matching Screenshot 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    TRUNG TÂM ĐIỀU PHỐI · VINHOMES HÓC MÔN
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
                    Tạo báo cáo từ thực đơn
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                    Không cố định số liệu. Hàng tuần tải thực đơn, chọn một hoặc nhiều nhà cung cấp cùng lúc để hệ thống tự động điền các món chính xác và xuất văn bản sao chép nhanh.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reset Default Data button */}
                  <button
                    onClick={handleResetDefaultData}
                    className="px-3 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Khôi phục thực đơn gốc chính xác"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Nạp lại menu chuẩn</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast(`Đã đồng bộ báo cáo ca ${currentShift} (${currentDateStr}) cho ${selectedVendorIds.length} nhà cung cấp!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0f2d4a] hover:bg-[#163e66] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>Tạo báo cáo</span>
                  </button>
                </div>
              </div>

              {/* Grid: 2 Columns matching Screenshot 1 & 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols): Upload Dropzone, Portion Table, Report Text */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Block 1: Upload Menu Image */}
                  <MenuUploadDropzone
                    currentMenuName={activeMenuName}
                    onImageUploaded={handleImageUploaded}
                    onOpenHistory={() => setCurrentTab('menu-sheet')}
                  />

                  {/* Block 2: Headcount Portions Input Table matching Screenshot 2 with multi-selection */}
                  <PortionInputTable
                    vendors={vendors}
                    onUpdateVendor={handleUpdateVendorPortion}
                    selectedVendorIds={selectedVendorIds}
                    onToggleVendor={handleToggleVendorId}
                    onSelectAll={() => setSelectedVendorIds(vendors.map((v) => v.id))}
                  />

                  {/* Block 3: Report Text Box with Multi-Vendor Support and strictly accurate vendor menus */}
                  <ReportTextOutput
                    shift={currentShift}
                    dateStr={currentDateStr}
                    dayOfWeek={currentDayOfWeek}
                    selectedVendorIds={selectedVendorIds}
                    setSelectedVendorIds={setSelectedVendorIds}
                    allVendors={vendors}
                    menusList={menusList}
                    onUpdateMenuDishes={handleUpdateVendorMenu}
                  />
                </div>

                {/* Right Column (4 cols): Summary Cards matching Screenshot 1 */}
                <div className="lg:col-span-4 space-y-6 sticky top-20">
                  <RightSidebarSummary
                    currentShift={currentShift}
                    setCurrentShift={setCurrentShift}
                    currentDateStr={currentDateStr}
                    setCurrentDateStr={setCurrentDateStr}
                    currentDayOfWeek={currentDayOfWeek}
                    setCurrentDayOfWeek={setCurrentDayOfWeek}
                    selectedVendor={primarySelectedVendor}
                    selectedVendorIds={selectedVendorIds}
                    onToggleVendorId={handleToggleVendorId}
                    allVendors={vendors}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
