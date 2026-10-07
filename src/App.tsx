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
import { DEFAULT_VENDORS, PRELOADED_MENUS, DAYS_OF_WEEK, getMenuForVendorAndShift, cleanDishName, cleanMenuObj } from './data/vinhomesMenuData';
import { DeleteMenuModal } from './components/DeleteMenuModal';
import { VendorPortionRow, MealShift, DayShiftMenu } from './types/report';
import { FileText, Sparkles, Check, RefreshCw, AlertCircle, Building2, Utensils, CheckCircle2, Trash2 } from 'lucide-react';

// Cache key v7 strictly separates all 7 vendors with distinct 21 shifts per vendor
const STORAGE_KEY_MENUS = 'vinhomes_weekly_menus_cache_v7_clean';
const STORAGE_KEY_VENDORS = 'vinhomes_vendors_headcount_cache_v7';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'report' | 'menu-sheet'>('report');
  const [isGlobalDeleteModalOpen, setIsGlobalDeleteModalOpen] = useState(false);
  const [isMenuUploadOpen, setIsMenuUploadOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(cleanMenuObj);
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
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Current primary active vendor
  const primarySelectedVendor = vendors.find((v) => v.id === selectedVendorIds[0]) || vendors[0];

  // Headcount cell updater
  const handleUpdateVendorPortion = (
    id: string,
    field: 'td8' | 'td11_1' | 'td11_3',
    value: number
  ) => {
    setVendors((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, [field]: value } : v));
      try {
        localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Batch headcount updater
  const handleBatchUpdatePortions = (
    updates: { id: string; td8?: number; td11_1?: number; td11_3?: number }[]
  ) => {
    setVendors((prev) => {
      const next = prev.map((v) => {
        const item = updates.find((u) => u.id === v.id);
        if (item) {
          return {
            ...v,
            td8: item.td8 !== undefined ? item.td8 : v.td8,
            td11_1: item.td11_1 !== undefined ? item.td11_1 : v.td11_1,
            td11_3: item.td11_3 !== undefined ? item.td11_3 : v.td11_3,
          };
        }
        return v;
      });
      try {
        localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Handler when a menu is extracted via OCR from uploaded file
  const handleMenuExtracted = (data: {
    vendorName?: string;
    vendorId?: string;
    projectName?: string;
    weekRange?: string;
    menus: DayShiftMenu[];
  }) => {
    if (!data.menus || data.menus.length === 0) return;

    // Detect all unique vendorIds present in incoming menus
    const incomingVendorIds = Array.from(
      new Set(data.menus.map((m) => m.vendorId).filter(Boolean))
    ) as string[];

    const defaultFallbackVendor = data.vendorId && data.vendorId !== 'all' ? data.vendorId : 'tam-phuong';

    const formattedIncoming: DayShiftMenu[] = data.menus.map((m) => ({
      ...m,
      vendorId: m.vendorId || defaultFallbackVendor,
      meatDishes: Array.isArray(m.meatDishes) ? m.meatDishes.map(cleanDishName).filter(Boolean) : [],
      vegDishes: Array.isArray(m.vegDishes) ? m.vegDishes.map(cleanDishName).filter(Boolean) : [],
      meatDessert: cleanDishName(m.meatDessert),
      vegDessert: cleanDishName(m.vegDessert),
      isWeighedOk: true
    }));

    setMenusList((prev) => {
      // Map incoming shifts by key
      const incomingKeyMap = new Map(
        formattedIncoming.map((m) => [`${m.vendorId}_${m.dayOfWeek}_${m.shift}`, m])
      );
      
      const updated = prev.map((m) => {
        const key = `${m.vendorId}_${m.dayOfWeek}_${m.shift}`;
        if (incomingKeyMap.has(key)) {
          const item = incomingKeyMap.get(key)!;
          incomingKeyMap.delete(key);
          return item;
        }
        return m;
      });

      const extras = Array.from(incomingKeyMap.values());
      const nextList = [...updated, ...extras];
      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(nextList));
      } catch (e) {}
      return nextList;
    });

    if (incomingVendorIds.length > 0) {
      setSelectedVendorIds(incomingVendorIds);
    } else if (data.vendorId && data.vendorId !== 'all') {
      setSelectedVendorIds([data.vendorId]);
    }

    const count = incomingVendorIds.length || 1;
    const vendorNamesStr = incomingVendorIds
      .map((id) => vendors.find((v) => v.id === id)?.name || id)
      .join(', ');

    setActiveMenuName(`Thực đơn đã nạp: ${vendorNamesStr || data.vendorName} (${formattedIncoming.length} ca ăn)`);
    showToast(`✓ Đã nạp và đồng bộ thực đơn của ${count} nhà cung cấp (${vendorNamesStr}) vào toàn bộ hệ thống!`);
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

  // Menu updater for a specific vendor - strictly independent per field
  const handleUpdateVendorMenu = (vendorId: string, partial: Partial<DayShiftMenu>) => {
    const cleanedPartial: Partial<DayShiftMenu> = {};
    if (partial.meatDishes !== undefined) {
      cleanedPartial.meatDishes = Array.isArray(partial.meatDishes)
        ? partial.meatDishes.map(cleanDishName).filter(Boolean)
        : [];
    }
    if (partial.vegDishes !== undefined) {
      cleanedPartial.vegDishes = Array.isArray(partial.vegDishes)
        ? partial.vegDishes.map(cleanDishName).filter(Boolean)
        : [];
    }
    if (partial.meatDessert !== undefined) {
      cleanedPartial.meatDessert = cleanDishName(partial.meatDessert || '');
    }
    if (partial.vegDessert !== undefined) {
      cleanedPartial.vegDessert = cleanDishName(partial.vegDessert || '');
    }
    if (partial.isWeighedOk !== undefined) {
      cleanedPartial.isWeighedOk = partial.isWeighedOk;
    }

    setMenusList((prev) => {
      let found = false;
      const next = prev.map((m) => {
        if (m.vendorId === vendorId && m.dayOfWeek === currentDayOfWeek && m.shift === currentShift) {
          found = true;
          return {
            ...m,
            ...cleanedPartial, // Strictly preserves untouched fields (meatDishes vs vegDishes)
          };
        }
        return m;
      });

      if (!found) {
        next.push({
          vendorId,
          dayOfWeek: currentDayOfWeek,
          dateStr: currentDateStr,
          shift: currentShift,
          meatDishes: cleanedPartial.meatDishes || ['Cơm trắng', 'Món mặn theo ca'],
          meatDessert: cleanedPartial.meatDessert || 'Trái cây theo mùa',
          vegDishes: cleanedPartial.vegDishes || ['Cơm trắng', 'Món chay theo ca'],
          vegDessert: cleanedPartial.vegDessert || 'Trái cây theo mùa',
          isWeighedOk: true,
          ...cleanedPartial
        });
      }

      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(next));
      } catch (e) {}
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
      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(next));
      } catch (e) {}
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
      const next = prev.map((m) => {
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

      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(next));
      } catch (e) {}
      return next;
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
      const next = [...otherVendors, ...defaultVendorShifts];
      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    const vendorName = vendors.find((v) => v.id === vendorId)?.name || vendorId;
    showToast(`Đã khôi phục toàn bộ thực đơn chuẩn của ${vendorName}!`);
  };

  // 3. Clear all dishes of this vendor
  const handleClearVendorMenus = (vendorId: string) => {
    setMenusList((prev) => {
      const next = prev.map((m) => {
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
      try {
        localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    const vendorName = vendors.find((v) => v.id === vendorId)?.name || vendorId;
    showToast(`Đã xóa trắng toàn bộ món ăn tuần của ${vendorName}!`);
  };

  // 4. Quick delete single shift
  const handleDeleteSingleShift = (vendorId: string, dayOfWeek: string, shift: MealShift) => {
    handleDeleteSelectedShifts([{ vendorId, dayOfWeek, shift }], 'reset-default');
  };

  // Force sync / refresh data from local storage without reverting user changes
  const handleSyncData = () => {
    setIsSyncing(true);
    try {
      const savedMenus = localStorage.getItem(STORAGE_KEY_MENUS);
      if (savedMenus) {
        const parsed = JSON.parse(savedMenus);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMenusList(parsed.map(cleanMenuObj));
        }
      }

      const savedVendors = localStorage.getItem(STORAGE_KEY_VENDORS);
      if (savedVendors) {
        const parsedVendors = JSON.parse(savedVendors);
        if (Array.isArray(parsedVendors) && parsedVendors.length > 0) {
          setVendors(parsedVendors);
        }
      }

      setTimeout(() => {
        setIsSyncing(false);
        showToast('✓ Đã đồng bộ & tải lại toàn bộ dữ liệu thực đơn và số lượng suất ăn mới nhất!');
      }, 300);
    } catch (e) {
      setIsSyncing(false);
      showToast('✓ Đã đồng bộ lại toàn bộ dữ liệu hệ thống!');
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
        <TopHeader onSync={handleSyncData} isSyncing={isSyncing} />

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
              {/* Header Title Section with Clear Actions */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600 animate-pulse" />
                    <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight uppercase">
                      HỆ THỐNG BÁO CÁO SUẤT ĂN · LÁN TRẠI HÓC MÔN
                    </h1>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
                    Dữ liệu thực đơn chuẩn 100% của 7 Nhà Cung Cấp. Nhập số lượng suất ăn &amp; sao chép văn bản báo cáo chuẩn hóa chỉ với 1 nhấp chuột.
                  </p>
                </div>

                {/* Quick Action Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncData}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Làm mới và đồng bộ lại toàn bộ dữ liệu thực đơn và số lượng mà không cần F5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-white ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Tải lại dữ liệu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentTab('menu-sheet')}
                    className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-teal-200"
                    title="Xem bảng thực đơn 21 ca của 7 nhà cung cấp"
                  >
                    <Utensils className="w-3.5 h-3.5 text-teal-700" />
                    <span>Ma trận tuần (21 ca)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefaultData}
                    className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
                    title="Khôi phục toàn bộ thực đơn chuẩn 100% của 7 nhà cung cấp"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
                    <span>Nạp lại menu chuẩn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGlobalDeleteModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Mở bảng chọn để xóa ca ăn hoặc thực đơn đã up nhầm"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Xóa / Làm mới</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMenuUploadOpen(!isMenuUploadOpen)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isMenuUploadOpen
                        ? 'bg-[#0b1e33] text-white shadow-xs'
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                    title="Mở bảng tải tệp ảnh thực đơn mới"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                    <span>{isMenuUploadOpen ? 'Đóng tải tệp' : 'Tải tệp menu mới'}</span>
                  </button>
                </div>
              </div>

              {/* Expandable Upload Dropzone Drawer */}
              {isMenuUploadOpen && (
                <div className="animate-fade-in">
                  <MenuUploadDropzone
                    currentMenuName={activeMenuName}
                    onMenuExtracted={(data) => {
                      handleMenuExtracted(data);
                      setIsMenuUploadOpen(false);
                    }}
                    onOpenHistory={() => setCurrentTab('menu-sheet')}
                    onOpenDeleteModal={() => setIsGlobalDeleteModalOpen(true)}
                    onUndoUploadedMenu={handleResetVendorMenus}
                  />
                </div>
              )}

              {/* Grid: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols): Portion Table, Report Text */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Block 1: Headcount Portions Input Table */}
                  <PortionInputTable
                    vendors={vendors}
                    onUpdateVendor={handleUpdateVendorPortion}
                    selectedVendorIds={selectedVendorIds}
                    onToggleVendor={handleToggleVendorId}
                    onSelectAll={() => setSelectedVendorIds(vendors.map((v) => v.id))}
                    onBatchUpdateVendors={handleBatchUpdatePortions}
                    onSelectVendors={(ids) => setSelectedVendorIds(ids)}
                  />

                  {/* Block 2: Report Text Box with Live Direct Editing & 1-Click Copy */}
                  <ReportTextOutput
                    shift={currentShift}
                    dateStr={currentDateStr}
                    dayOfWeek={currentDayOfWeek}
                    selectedVendorIds={selectedVendorIds}
                    setSelectedVendorIds={setSelectedVendorIds}
                    allVendors={vendors}
                    menusList={menusList}
                    onUpdateMenuDishes={handleUpdateVendorMenu}
                    onUpdateVendorPortion={handleUpdateVendorPortion}
                  />
                </div>

                {/* Right Column (4 cols): Shift Controller & Stats */}
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
