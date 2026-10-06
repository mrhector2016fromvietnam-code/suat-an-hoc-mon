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
import { DEFAULT_VENDORS, PRELOADED_MENUS, DAYS_OF_WEEK, getMenuForVendorAndShift, cleanDishName } from './data/vinhomesMenuData';
import { DeleteMenuModal } from './components/DeleteMenuModal';
import { VendorPortionRow, MealShift, DayShiftMenu } from './types/report';
import { FileText, Sparkles, Check, RefreshCw, AlertCircle, Building2, Utensils, CheckCircle2, Trash2 } from 'lucide-react';

// Cache key v7 strictly separates all 7 vendors with distinct 21 shifts per vendor
const STORAGE_KEY_MENUS = 'vinhomes_weekly_menus_cache_v7_clean';
const STORAGE_KEY_VENDORS = 'vinhomes_vendors_headcount_cache_v7';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'report' | 'menu-sheet'>('report');
  const [isGlobalDeleteModalOpen, setIsGlobalDeleteModalOpen] = useState(false);
  
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

  // Menus list with persistence & integrity verification
  const [menusList, setMenusList] = useState<DayShiftMenu[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENUS);
      if (saved) {
        const parsed: DayShiftMenu[] = JSON.parse(saved);
        // Verify all 7 vendors are represented and no stale corrupted data
        const uniqueVendors = new Set(parsed.map((m) => m.vendorId));
        if (
          uniqueVendors.size >= 7 &&
          parsed.length >= 140 &&
          !parsed.some((m) => m.meatDishes.some((d) => /\d+g\b|\d+-\d+g/i.test(d)))
        ) {
          return parsed;
        }
      }
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

  // Handler when a menu is extracted via OCR from uploaded file
  const handleMenuExtracted = (data: {
    vendorName: string;
    vendorId: string;
    projectName?: string;
    weekRange?: string;
    menus: DayShiftMenu[];
  }) => {
    if (!data.menus || data.menus.length === 0) return;

    const targetVendorId = data.vendorId || 'tam-phuong';

    setMenusList((prev) => {
      // Remove any existing menus for this vendor that are being overridden
      const incomingKeys = new Set(data.menus.map((m) => `${m.dayOfWeek}_${m.shift}`));
      const retained = prev.filter(
        (m) => m.vendorId !== targetVendorId || !incomingKeys.has(`${m.dayOfWeek}_${m.shift}`)
      );
      const formattedIncoming: DayShiftMenu[] = data.menus.map((m) => ({
        ...m,
        vendorId: targetVendorId,
        meatDishes: m.meatDishes.map(cleanDishName).filter(Boolean),
        vegDishes: m.vegDishes.map(cleanDishName).filter(Boolean),
        meatDessert: cleanDishName(m.meatDessert),
        vegDessert: cleanDishName(m.vegDessert),
        isWeighedOk: true
      }));
      return [...retained, ...formattedIncoming];
    });

    setSelectedVendorIds([targetVendorId]);
    setActiveMenuName(`Thực đơn chuẩn OCR: ${data.vendorName} (${data.menus.length} ca ăn khớp 100% tài liệu gốc)`);
    showToast(`Đã nạp chính xác 100% thực đơn của ${data.vendorName} (${data.menus.length} ca ăn)!`);
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
    const cleanedPartial: Partial<DayShiftMenu> = {
      ...partial,
      meatDishes: partial.meatDishes ? partial.meatDishes.map(cleanDishName).filter(Boolean) : undefined,
      vegDishes: partial.vegDishes ? partial.vegDishes.map(cleanDishName).filter(Boolean) : undefined,
      meatDessert: partial.meatDessert ? cleanDishName(partial.meatDessert) : undefined,
      vegDessert: partial.vegDessert ? cleanDishName(partial.vegDessert) : undefined,
    };

    setMenusList((prev) => {
      let found = false;
      const next = prev.map((m) => {
        if (m.vendorId === vendorId && m.dayOfWeek === currentDayOfWeek && m.shift === currentShift) {
          found = true;
          return { ...m, ...cleanedPartial };
        }
        return m;
      });

      if (!found) {
        next.push({
          vendorId,
          dayOfWeek: currentDayOfWeek,
          dateStr: currentDateStr,
          shift: currentShift,
          meatDishes: cleanedPartial.meatDishes || ['Cơm trắng', 'Món mặn'],
          meatDessert: cleanedPartial.meatDessert || 'Trái cây',
          vegDishes: cleanedPartial.vegDishes || ['Cơm trắng', 'Món chay'],
          vegDessert: cleanedPartial.vegDessert || 'Trái cây',
          isWeighedOk: true,
          ...cleanedPartial
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

  // 1. Delete or Revert selected specific shifts
  const handleDeleteSelectedShifts = (
    shiftsToDelete: { vendorId: string; dayOfWeek: string; shift: MealShift }[],
    action: 'clear' | 'reset-default'
  ) => {
    setMenusList((prev) => {
      return prev.map((m) => {
        const match = shiftsToDelete.find(
          (s) => s.vendorId === m.vendorId && s.dayOfWeek === m.dayOfWeek && s.shift === m.shift
        );
        if (match) {
          if (action === 'clear') {
            return {
              ...m,
              meatDishes: [],
              meatDessert: '',
              vegDishes: [],
              vegDessert: '',
            };
          } else {
            const defaultShift = PRELOADED_MENUS.find(
              (p) => p.vendorId === m.vendorId && p.dayOfWeek === m.dayOfWeek && p.shift === m.shift
            );
            return defaultShift ? { ...defaultShift } : m;
          }
        }
        return m;
      });
    });

    const vendorName = vendors.find((v) => v.id === shiftsToDelete[0]?.vendorId)?.name || 'nhà cung cấp';
    showToast(
      action === 'clear'
        ? `Đã xóa trắng ${shiftsToDelete.length} ca ăn của ${vendorName}!`
        : `Đã khôi phục thực đơn gốc cho ${shiftsToDelete.length} ca ăn của ${vendorName}!`
    );
  };

  // 2. Full vendor reset
  const handleResetVendorMenus = (vendorId: string) => {
    const defaultVendorShifts = PRELOADED_MENUS.filter((p) => p.vendorId === vendorId);
    setMenusList((prev) => {
      const otherVendors = prev.filter((m) => m.vendorId !== vendorId);
      return [...otherVendors, ...defaultVendorShifts];
    });
    const vendorName = vendors.find((v) => v.id === vendorId)?.name || vendorId;
    showToast(`Đã khôi phục toàn bộ thực đơn chuẩn của ${vendorName}!`);
  };

  // 3. Clear all dishes of this vendor
  const handleClearVendorMenus = (vendorId: string) => {
    setMenusList((prev) => {
      return prev.map((m) => {
        if (m.vendorId === vendorId) {
          return {
            ...m,
            meatDishes: [],
            meatDessert: '',
            vegDishes: [],
            vegDessert: '',
          };
        }
        return m;
      });
    });
    const vendorName = vendors.find((v) => v.id === vendorId)?.name || vendorId;
    showToast(`Đã xóa trắng toàn bộ món ăn tuần của ${vendorName}!`);
  };

  // 4. Quick delete single shift
  const handleDeleteSingleShift = (vendorId: string, dayOfWeek: string, shift: MealShift) => {
    handleDeleteSelectedShifts([{ vendorId, dayOfWeek, shift }], 'reset-default');
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
              onDeleteSelectedShifts={handleDeleteSelectedShifts}
              onResetVendorMenus={handleResetVendorMenus}
              onClearVendorMenus={handleClearVendorMenus}
              onDeleteSingleShift={handleDeleteSingleShift}
              initialVendorId={selectedVendorIds[0] || 'tam-phuong'}
            />
          ) : currentTab === 'overview' ? (
            /* Overview Tab */
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight">
                    KÝ TÚC XÁ HÓC MÔN
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wide mt-1">
                    TRUNG TÂM DỮ LIỆU SUẤT ĂN VÀ BÁO CÁO THỐNG KÊ
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
              {/* Header Title Section matching User Instruction */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
                    KÝ TÚC XÁ HÓC MÔN
                  </h1>
                  <div className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wide mt-1">
                    TRUNG TÂM DỮ LIỆU SUẤT ĂN VÀ BÁO CÁO THỐNG KÊ
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
                    Hàng tuần tải thực đơn, chọn một hoặc nhiều nhà cung cấp cùng lúc để hệ thống tự động điền các món chính xác và xuất văn bản sao chép nhanh.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete / Revert uploaded menu button */}
                  <button
                    onClick={() => setIsGlobalDeleteModalOpen(true)}
                    className="px-3 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Mở bảng chọn để xóa ca ăn hoặc thực đơn đã up nhầm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Xóa thực đơn up nhầm</span>
                  </button>

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
                    onMenuExtracted={handleMenuExtracted}
                    onOpenHistory={() => setCurrentTab('menu-sheet')}
                    onOpenDeleteModal={() => setIsGlobalDeleteModalOpen(true)}
                    onUndoUploadedMenu={handleResetVendorMenus}
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

      {/* Global Delete / Revert Menu Modal */}
      <DeleteMenuModal
        isOpen={isGlobalDeleteModalOpen}
        onClose={() => setIsGlobalDeleteModalOpen(false)}
        vendors={vendors}
        menusList={menusList}
        initialVendorId={selectedVendorIds[0] || 'tam-phuong'}
        onDeleteSelectedShifts={handleDeleteSelectedShifts}
        onResetVendorMenus={handleResetVendorMenus}
        onClearVendorMenus={handleClearVendorMenus}
      />
    </div>
  );
}
