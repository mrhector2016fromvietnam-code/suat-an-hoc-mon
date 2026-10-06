import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, Check, CheckSquare, Square, Edit3, Sparkles, Building2, 
  Utensils, RotateCcw, Save, Type, Eye, Plus, X, SlidersHorizontal, 
  FileCheck, ShieldCheck, Printer, CheckCircle2, ChevronRight, Hash
} from 'lucide-react';
import { VendorPortionRow, DayShiftMenu, MealShift } from '../types/report';
import { getMenuForVendorAndShift, cleanDishName, PRELOADED_MENUS } from '../data/vinhomesMenuData';

export { cleanDishName };

interface ReportTextOutputProps {
  shift: string;
  dateStr: string;
  dayOfWeek: string;
  selectedVendorIds: string[];
  setSelectedVendorIds: (ids: string[]) => void;
  allVendors: VendorPortionRow[];
  menusList: DayShiftMenu[];
  onUpdateMenuDishes: (vendorId: string, updatedMenu: Partial<DayShiftMenu>) => void;
  onUpdateVendorPortion?: (id: string, field: 'td8' | 'td11_1' | 'td11_3', value: number) => void;
}

// Preset common desserts for 1-click quick selection
const COMMON_DESSERTS = [
  'Dưa hấu', 'Chuối', 'Ổi', 'Táo xanh', 'Sữa chua', 'Sữa đậu nành', 
  'Thạch rau câu', 'Quýt', 'Thanh long', 'Cam sành', 'Nước sâm'
];

export const ReportTextOutput: React.FC<ReportTextOutputProps> = ({
  shift,
  dateStr,
  dayOfWeek,
  selectedVendorIds,
  setSelectedVendorIds,
  allVendors,
  menusList,
  onUpdateMenuDishes,
  onUpdateVendorPortion,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedVendorId, setCopiedVendorId] = useState<string | null>(null);
  
  // Editor view mode: 'preview' (standard view), 'interactive' (in-place field editor), 'raw' (free textarea)
  const [editorMode, setEditorMode] = useState<'preview' | 'interactive' | 'raw'>('preview');
  
  // Report format template: 'standard' | 'compact' | 'table'
  const [reportFormat, setReportFormat] = useState<'standard' | 'compact' | 'table'>('standard');

  // Active vendor tab when editing
  const [activeTabVendorId, setActiveTabVendorId] = useState<string>(
    selectedVendorIds[0] || 'tam-phuong'
  );

  // Custom quality/weighing status text
  const [customQualityNote, setCustomQualityNote] = useState<string>('Cân định lượng: Đạt');

  // Custom raw text override if user is in 'raw' mode
  const [customRawText, setCustomRawText] = useState<string>('');
  const [isRawOverridden, setIsRawOverridden] = useState<boolean>(false);

  // New dish input state
  const [newMeatDishInput, setNewMeatDishInput] = useState<string>('');
  const [newVegDishInput, setNewVegDishInput] = useState<string>('');

  useEffect(() => {
    if (selectedVendorIds.length > 0 && !selectedVendorIds.includes(activeTabVendorId)) {
      setActiveTabVendorId(selectedVendorIds[0]);
    }
  }, [selectedVendorIds, activeTabVendorId]);

  // Active vendors list
  const activeVendors = useMemo(() => {
    return allVendors.filter((v) => selectedVendorIds.includes(v.id));
  }, [allVendors, selectedVendorIds]);

  // Toggle single vendor selection
  const handleToggleVendor = (id: string) => {
    if (selectedVendorIds.includes(id)) {
      if (selectedVendorIds.length > 1) {
        setSelectedVendorIds(selectedVendorIds.filter((vId) => vId !== id));
      }
    } else {
      setSelectedVendorIds([...selectedVendorIds, id]);
    }
  };

  // Toggle select all vendors
  const handleToggleSelectAll = () => {
    if (selectedVendorIds.length === allVendors.length) {
      setSelectedVendorIds([allVendors[0].id]);
    } else {
      setSelectedVendorIds(allVendors.map((v) => v.id));
    }
  };

  // Get active menu for the currently focused vendor tab
  const activeTabMenu = useMemo(() => {
    return getMenuForVendorAndShift(menusList, activeTabVendorId, dayOfWeek, shift as MealShift);
  }, [menusList, activeTabVendorId, dayOfWeek, shift]);

  // Active vendor obj
  const activeTabVendorObj = allVendors.find((v) => v.id === activeTabVendorId) || activeVendors[0] || allVendors[0];

  // Helper: Build single vendor report text
  const buildVendorBlock = (vendor: VendorPortionRow, format: 'standard' | 'compact' | 'table' = 'standard') => {
    const shiftLower = shift.toLowerCase();
    const vendorTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;
    const td8Str = vendor.td8 > 0 ? `${vendor.td8} suất` : 'chưa nhập suất';
    const td11_1Str = vendor.td11_1 > 0 ? `${vendor.td11_1} suất` : 'chưa nhập suất';
    const td11_3Str = vendor.td11_3 > 0 ? `${vendor.td11_3} suất` : 'chưa nhập suất';

    const vendorMenu = getMenuForVendorAndShift(menusList, vendor.id, dayOfWeek, shift as MealShift);
    const meatDishesStr = vendorMenu.meatDishes.map(cleanDishName).filter(Boolean).join(', ');
    const vegDishesStr = vendorMenu.vegDishes.map(cleanDishName).filter(Boolean).join(', ');
    const meatDessertClean = cleanDishName(vendorMenu.meatDessert);
    const vegDessertClean = cleanDishName(vendorMenu.vegDessert);

    if (format === 'compact') {
      return `[${vendor.name.toUpperCase()} - ${shift.toUpperCase()} ${dateStr}]
• Tổng: ${vendorTotal} suất (TĐ8: ${vendor.td8}, TĐ11.1: ${vendor.td11_1}, TĐ11.3: ${vendor.td11_3})
• Mặn: ${meatDishesStr || 'Chưa cập nhật'}${meatDessertClean ? ` | TM: ${meatDessertClean}` : ''}
• Chay: ${vegDishesStr || 'Chưa cập nhật'}${vegDessertClean ? ` | TM: ${vegDessertClean}` : ''}
• ${customQualityNote}`;
    }

    if (format === 'table') {
      return `========================================
NHÀ CUNG CẤP: ${vendor.name.toUpperCase()} (${vendor.code})
----------------------------------------
Thời gian: ${shift} · ${dayOfWeek} (${dateStr})
Tổng số suất: ${vendorTotal} suất
Chi tiết phân bổ:
  + TĐ 8:    ${td8Str}
  + TĐ 11.1: ${td11_1Str}
  + TĐ 11.3: ${td11_3Str}
----------------------------------------
THỰC ĐƠN CHI TIẾT:
  [Món mặn]:      ${meatDishesStr || 'Chưa có'}
  [Tráng miệng]:  ${meatDessertClean || 'Không'}
  [Món chay]:     ${vegDishesStr || 'Chưa có'}
  [TM Chay]:      ${vegDessertClean || 'Không'}
----------------------------------------
Kiểm tra: ${customQualityNote}
========================================`;
    }

    // Standard Vietnamese Group Chat format (Zalo / Viber standard)
    return `Báo cáo Anh/Chị: Khu bếp / nhà ăn phục vụ suất ăn ${shiftLower} ngày ${dateStr}
• Tổng cộng: ${vendorTotal} suất
NCC: ${vendor.name}
• Tổng suất ăn: ${vendorTotal} suất
TĐ 8: ${td8Str}
TĐ 11.1: ${td11_1Str}
TĐ 11.3: ${td11_3Str}
• Suất ăn mặn: ${meatDishesStr}
• Tráng miệng mặn: ${meatDessertClean}
• Suất ăn chay: ${vegDishesStr}
• Tráng miệng chay: ${vegDessertClean}
${customQualityNote}`;
  };

  // Helper: Build combined report text
  const generatedFullReport = useMemo(() => {
    const grandTotal = activeVendors.reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);

    if (activeVendors.length === 1) {
      return buildVendorBlock(activeVendors[0], reportFormat);
    }

    const blocks = activeVendors.map((vendor) => buildVendorBlock(vendor, reportFormat));

    if (reportFormat === 'compact') {
      return `=== BÁO CÁO TỔNG HỢP (${shift.toUpperCase()} · ${dateStr}) ===
TỔNG CỘNG: ${grandTotal} suất (${activeVendors.length} NCC)

${blocks.join('\n\n')}`;
    }

    if (reportFormat === 'table') {
      return `########################################
BÁO CÁO TỔNG HỢP SUẤT ĂN - ${shift.toUpperCase()} (${dateStr})
TỔNG CỘNG TOÀN KHU: ${grandTotal} SUẤT (${activeVendors.length} NHÀ CUNG CẤP)
########################################

${blocks.join('\n\n')}`;
    }

    return `BÁO CÁO TỔNG HỢP CÁC NHÀ CUNG CẤP - ${shift.toUpperCase()} NGÀY ${dateStr}
• TỔNG CỘNG TOÀN BỘ (${activeVendors.length} NCC): ${grandTotal} suất

${blocks.join('\n\n----------------------------------------\n\n')}`;
  }, [activeVendors, shift, dateStr, dayOfWeek, menusList, customQualityNote, reportFormat]);

  // Sync custom raw text if not manually overridden
  useEffect(() => {
    if (!isRawOverridden) {
      setCustomRawText(generatedFullReport);
    }
  }, [generatedFullReport, isRawOverridden]);

  const displayedReportText = isRawOverridden ? customRawText : generatedFullReport;

  // Copy full text
  const handleCopyAll = () => {
    navigator.clipboard.writeText(displayedReportText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy single vendor text
  const handleCopySingle = (vendor: VendorPortionRow) => {
    const text = buildVendorBlock(vendor, reportFormat);
    navigator.clipboard.writeText(text);
    setCopiedVendorId(vendor.id);
    setTimeout(() => setCopiedVendorId(null), 2500);
  };

  // Add meat dish
  const handleAddMeatDish = () => {
    if (!newMeatDishInput.trim()) return;
    const currentDishes = activeTabMenu.meatDishes.map(cleanDishName);
    const newItems = newMeatDishInput.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean);
    onUpdateMenuDishes(activeTabVendorId, {
      meatDishes: [...currentDishes, ...newItems]
    });
    setNewMeatDishInput('');
  };

  // Remove meat dish
  const handleRemoveMeatDish = (index: number) => {
    const nextDishes = activeTabMenu.meatDishes.filter((_, idx) => idx !== index);
    onUpdateMenuDishes(activeTabVendorId, { meatDishes: nextDishes });
  };

  // Add veg dish
  const handleAddVegDish = () => {
    if (!newVegDishInput.trim()) return;
    const currentDishes = activeTabMenu.vegDishes.map(cleanDishName);
    const newItems = newVegDishInput.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean);
    onUpdateMenuDishes(activeTabVendorId, {
      vegDishes: [...currentDishes, ...newItems]
    });
    setNewVegDishInput('');
  };

  // Remove veg dish
  const handleRemoveVegDish = (index: number) => {
    const nextDishes = activeTabMenu.vegDishes.filter((_, idx) => idx !== index);
    onUpdateMenuDishes(activeTabVendorId, { vegDishes: nextDishes });
  };

  // Reset current vendor menu to preloaded default
  const handleResetCurrentVendorMenu = () => {
    const defaultShift = PRELOADED_MENUS.find(
      (m) => m.vendorId === activeTabVendorId && m.dayOfWeek === dayOfWeek && m.shift === shift
    );
    if (defaultShift) {
      onUpdateMenuDishes(activeTabVendorId, {
        meatDishes: defaultShift.meatDishes,
        meatDessert: defaultShift.meatDessert,
        vegDishes: defaultShift.vegDishes,
        vegDessert: defaultShift.vegDessert,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
      {/* Header bar with visual prestige */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0b1e33] to-[#123154] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[11px] font-bold uppercase tracking-wider border border-teal-500/30">
              {shift} · {dayOfWeek} ({dateStr})
            </span>
            <span className="text-neutral-400 text-xs font-mono">
              {activeVendors.length} Nhà Cung Cấp
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
            Trung Tâm Xuất Báo Cáo Suất Ăn
          </h2>
          <p className="text-xs text-neutral-300 mt-0.5">
            Tự động điền dữ liệu chuẩn, hỗ trợ chỉnh sửa trực tiếp và sao chép 1-chạm gửi Zalo/Viber
          </p>
        </div>

        {/* Top Control Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Editor Mode Segmented Controls */}
          <div className="flex items-center p-1 rounded-xl bg-black/25 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                editorMode === 'preview'
                  ? 'bg-teal-500 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem &amp; Sao chép</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('interactive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                editorMode === 'interactive'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Chỉnh sửa trực tiếp từng món ăn, số lượng và tráng miệng"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa trực tiếp</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('raw')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                editorMode === 'raw'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
              title="Gõ hoặc dán văn bản tùy chỉnh tự do"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Sửa tự do</span>
            </button>
          </div>

          {/* Master Copy Button */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              copiedAll
                ? 'bg-emerald-500 text-white'
                : 'bg-teal-600 hover:bg-teal-500 text-white'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép ({activeVendors.length} NCC)!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-teal-200" />
                <span>Sao chép toàn bộ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Vendor Selection Bar with Quick Toggle Pills */}
        <div className="p-4 rounded-xl bg-neutral-50/90 border border-neutral-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs font-bold text-neutral-800">
                Nhà cung cấp hiển thị trong báo cáo ({selectedVendorIds.length}/{allVendors.length}):
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Template selector */}
              <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setReportFormat('standard')}
                  className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                    reportFormat === 'standard' ? 'bg-[#0b1e33] text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Chuẩn Zalo
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat('compact')}
                  className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                    reportFormat === 'compact' ? 'bg-[#0b1e33] text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Rút gọn
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat('table')}
                  className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                    reportFormat === 'table' ? 'bg-[#0b1e33] text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Dạng Bảng
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
              >
                {selectedVendorIds.length === allVendors.length ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-teal-700" />
                    <span>Bỏ chọn tất cả</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Chọn tất cả (7 NCC)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Vendors Checkbox Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {allVendors.map((vendor) => {
              const isChecked = selectedVendorIds.includes(vendor.id);
              const total = vendor.td8 + vendor.td11_1 + vendor.td11_3;

              return (
                <button
                  type="button"
                  key={vendor.id}
                  onClick={() => {
                    handleToggleVendor(vendor.id);
                    setActiveTabVendorId(vendor.id);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isChecked
                      ? 'bg-white border-teal-600 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white/60 border-neutral-200 hover:border-neutral-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isChecked ? 'bg-teal-100 text-teal-800' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {vendor.code}
                    </span>
                    {isChecked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" />
                    )}
                  </div>
                  <div className="mt-1.5 truncate text-xs font-bold text-neutral-900">
                    {vendor.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    {total > 0 ? `${total} suất` : '0 suất'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODE 1: INTERACTIVE IN-PLACE REPORT EDITOR */}
        {editorMode === 'interactive' && (
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-5 animate-fade-in">
            {/* Header of in-place editor */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Chỉnh Sửa Trực Tiếp Dữ Liệu Báo Cáo
                  </h3>
                  <p className="text-xs text-neutral-600">
                    Mọi thay đổi tại đây sẽ cập nhật trực tiếp vào văn bản báo cáo và hệ thống dữ liệu
                  </p>
                </div>
              </div>

              {/* Vendor Tab Switcher inside editor */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-neutral-500 font-medium">Đang sửa:</span>
                {activeVendors.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveTabVendorId(v.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTabVendorId === v.id
                        ? 'bg-[#0b1e33] text-white shadow-xs'
                        : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* In-place Editable Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column (Portion counts & Notes) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Headcount direct editor */}
                <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3 shadow-2xs">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                    <Hash className="w-3.5 h-3.5 text-amber-600" />
                    <span>Số suất ăn {activeTabVendorObj.name}:</span>
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">TĐ 8</label>
                      <input
                        type="number"
                        min="0"
                        value={activeTabVendorObj.td8 || ''}
                        onChange={(e) =>
                          onUpdateVendorPortion &&
                          onUpdateVendorPortion(activeTabVendorId, 'td8', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full py-1.5 px-2 rounded-lg border border-neutral-300 text-center font-mono font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">TĐ 11.1</label>
                      <input
                        type="number"
                        min="0"
                        value={activeTabVendorObj.td11_1 || ''}
                        onChange={(e) =>
                          onUpdateVendorPortion &&
                          onUpdateVendorPortion(activeTabVendorId, 'td11_1', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full py-1.5 px-2 rounded-lg border border-neutral-300 text-center font-mono font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">TĐ 11.3</label>
                      <input
                        type="number"
                        min="0"
                        value={activeTabVendorObj.td11_3 || ''}
                        onChange={(e) =>
                          onUpdateVendorPortion &&
                          onUpdateVendorPortion(activeTabVendorId, 'td11_3', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-full py-1.5 px-2 rounded-lg border border-neutral-300 text-center font-mono font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-500 font-medium">Tổng suất {activeTabVendorObj.name}:</span>
                    <strong className="text-teal-900 font-mono font-bold text-sm">
                      {(activeTabVendorObj.td8 + activeTabVendorObj.td11_1 + activeTabVendorObj.td11_3).toLocaleString('vi-VN')} suất
                    </strong>
                  </div>
                </div>

                {/* Quality & Weighing Note Editor */}
                <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dòng ghi chú / Cân định lượng:</span>
                  </span>
                  <input
                    type="text"
                    value={customQualityNote}
                    onChange={(e) => setCustomQualityNote(e.target.value)}
                    placeholder="VD: Cân định lượng: Đạt"
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[
                      'Cân định lượng: Đạt',
                      'Cân định lượng: Đạt 100%',
                      'Cân định lượng: Đạt chuẩn - Đã lưu mẫu',
                      'Nhiệt độ giao đạt >68°C - Định lượng chuẩn'
                    ].map((note, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomQualityNote(note)}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-950 transition-colors cursor-pointer"
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Revert to original button */}
                <button
                  type="button"
                  onClick={handleResetCurrentVendorMenu}
                  className="w-full py-2 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Khôi phục thực đơn gốc của nhà cung cấp này"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Khôi phục menu gốc ({activeTabVendorObj.name})</span>
                </button>
              </div>

              {/* Right Column (Dishes & Desserts Editor) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Meat Dishes Card */}
                <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Suất ăn mặn: {activeTabVendorObj.name} ({activeTabMenu.meatDishes.length} món)</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">{shift}</span>
                  </div>

                  {/* Meat Dishes Tag list with delete buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeTabMenu.meatDishes.map((dish, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium"
                      >
                        <span className="text-[10px] font-mono text-emerald-700 opacity-70">{idx + 1}.</span>
                        <span>{cleanDishName(dish)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMeatDish(idx)}
                          className="hover:text-red-600 hover:bg-emerald-100 rounded p-0.5 cursor-pointer ml-1"
                          title="Xóa món này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Meat Dish input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newMeatDishInput}
                      onChange={(e) => setNewMeatDishInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMeatDish();
                        }
                      }}
                      placeholder="Nhập tên món mặn (hoặc gõ nhiều món cách nhau bởi dấu phẩy)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddMeatDish}
                      disabled={!newMeatDishInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  </div>

                  {/* Meat Dessert Editor */}
                  <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-900 shrink-0">
                      Tráng miệng mặn:
                    </span>
                    <input
                      type="text"
                      value={activeTabMenu.meatDessert || ''}
                      onChange={(e) =>
                        onUpdateMenuDishes(activeTabVendorId, { meatDessert: cleanDishName(e.target.value) })
                      }
                      placeholder="VD: Dưa hấu, Chuối, Ổi..."
                      className="flex-1 px-2.5 py-1 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Quick Dessert suggestions */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-neutral-400">Chọn nhanh:</span>
                    {COMMON_DESSERTS.slice(0, 7).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => onUpdateMenuDishes(activeTabVendorId, { meatDessert: d })}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-emerald-100 text-neutral-600 hover:text-emerald-900 transition-colors cursor-pointer"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vegetarian Dishes Card */}
                <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Suất ăn chay: {activeTabVendorObj.name} ({activeTabMenu.vegDishes.length} món)</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">{shift}</span>
                  </div>

                  {/* Veg Dishes Tag list */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeTabMenu.vegDishes.map((dish, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 border border-amber-200 text-xs font-medium"
                      >
                        <span className="text-[10px] font-mono text-amber-700 opacity-70">{idx + 1}.</span>
                        <span>{cleanDishName(dish)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVegDish(idx)}
                          className="hover:text-red-600 hover:bg-amber-100 rounded p-0.5 cursor-pointer ml-1"
                          title="Xóa món này"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Veg Dish input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newVegDishInput}
                      onChange={(e) => setNewVegDishInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVegDish();
                        }
                      }}
                      placeholder="Nhập món chay mới..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddVegDish}
                      disabled={!newVegDishInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm</span>
                    </button>
                  </div>

                  {/* Veg Dessert Editor */}
                  <div className="pt-2 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-950 shrink-0">
                      Tráng miệng chay:
                    </span>
                    <input
                      type="text"
                      value={activeTabMenu.vegDessert || ''}
                      onChange={(e) =>
                        onUpdateMenuDishes(activeTabVendorId, { vegDessert: cleanDishName(e.target.value) })
                      }
                      placeholder="VD: Sữa đậu nành, Ổi..."
                      className="flex-1 px-2.5 py-1 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions of in-place editor */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-200">
              <span className="text-xs text-amber-900 font-medium">
                ✓ Các thay đổi đã được tự động lưu và đồng bộ trực tiếp vào báo cáo.
              </span>
              <button
                type="button"
                onClick={() => setEditorMode('preview')}
                className="px-4 py-2 rounded-xl bg-[#0b1e33] hover:bg-[#123154] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4 text-teal-300" />
                <span>Hoàn tất &amp; Xem báo cáo</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: RAW TEXTAREA FREEDOM EDITOR */}
        {editorMode === 'raw' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Type className="w-4 h-4 text-slate-700" />
                <span>Trình Soạn Thảo Văn Bản Tự Do (Chỉnh sửa tùy ý trước khi sao chép):</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRawOverridden(false);
                  setCustomRawText(generatedFullReport);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục theo mẫu tự động</span>
              </button>
            </div>

            <textarea
              rows={14}
              value={customRawText}
              onChange={(e) => {
                setCustomRawText(e.target.value);
                setIsRawOverridden(true);
              }}
              className="w-full p-4 rounded-xl border border-slate-300 bg-white font-mono text-xs sm:text-sm text-neutral-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 select-text"
              placeholder="Nhập hoặc dán nội dung báo cáo tại đây..."
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Số ký tự: {customRawText.length} · Số dòng: {customRawText.split('\n').length}</span>
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Đã sao chép!' : 'Sao chép văn bản này'}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: PREVIEW & EASY ONE-CLICK COPY CARDS */}
        {editorMode === 'preview' && (
          <div className="space-y-4">
            {/* Quick Action Bar above output */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">
                Nội dung văn bản chuẩn bị sẵn (Nhấp "Sao chép" để dán ngay vào Zalo/Viber nhóm):
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorMode('interactive')}
                  className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-amber-700" />
                  <span>Chỉnh sửa trực tiếp món/suất</span>
                </button>
              </div>
            </div>

            {/* Main Combined Report Container */}
            <div className="relative rounded-2xl border border-neutral-200 bg-[#f8fafc] p-5 sm:p-6 font-sans text-xs sm:text-sm text-neutral-900 leading-relaxed select-text space-y-4 shadow-2xs">
              {activeVendors.length === 1 ? (
                /* Single Vendor Display */
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <span className="font-bold text-teal-950 text-xs sm:text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-700" />
                      <span>{activeVendors[0].name} ({shift} · {dateStr})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAll ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
                    </button>
                  </div>
                  <pre className="font-sans whitespace-pre-wrap leading-relaxed text-neutral-900 text-xs sm:text-sm font-medium bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs">
                    {displayedReportText}
                  </pre>
                </div>
              ) : (
                /* Multiple Vendors Display */
                <div className="space-y-4">
                  <div className="font-bold text-teal-950 border-b border-neutral-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Báo cáo tổng hợp: {activeVendors.length} nhà cung cấp ({shift} · {dateStr})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAll ? 'Đã sao chép tất cả!' : 'Sao chép toàn bộ báo cáo'}</span>
                    </button>
                  </div>

                  {/* Individual Vendor Blocks */}
                  {activeVendors.map((vendor, index) => (
                    <div
                      key={vendor.id}
                      className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 transition-all hover:border-teal-300"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center font-mono">
                            {index + 1}
                          </span>
                          <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                            {vendor.name} ({vendor.code})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTabVendorId(vendor.id);
                              setEditorMode('interactive');
                            }}
                            className="px-2 py-1 rounded-lg text-amber-700 hover:bg-amber-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-amber-200"
                            title="Sửa trực tiếp cho NCC này"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa NCC này</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopySingle(vendor)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedVendorId === vendor.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Đã chép!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-teal-600" />
                                <span>Sao chép riêng</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <pre className="font-sans whitespace-pre-wrap text-neutral-900 text-xs sm:text-sm leading-relaxed font-medium bg-[#fafbfc] p-3.5 rounded-lg border border-neutral-100">
                        {buildVendorBlock(vendor, reportFormat)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Dish Breakdown Table */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-2">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5 text-xs sm:text-sm">
              <Utensils className="w-4 h-4 text-teal-700" />
              <span>Bảng kê chi tiết món ăn ca {shift} ({dayOfWeek} - {dateStr})</span>
            </span>

            {activeVendors.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 font-medium">Xem bảng kê của:</span>
                <select
                  value={activeTabVendorId}
                  onChange={(e) => setActiveTabVendorId(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-neutral-300 bg-white font-bold text-teal-950 cursor-pointer text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  {activeVendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.code})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Suất ăn mặn */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-white space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between text-neutral-900 font-bold border-b border-emerald-100 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Suất ăn mặn: {activeTabVendorObj.name}</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">{shift}</span>
              </div>

              <div className="space-y-1.5 text-neutral-800">
                {activeTabMenu.meatDishes.map((dish, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{cleanDishName(dish)}</span>
                  </div>
                ))}
                {activeTabMenu.meatDessert && (
                  <div className="flex items-center gap-2 pt-1 text-emerald-900 font-semibold border-t border-emerald-50 mt-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      TM
                    </span>
                    <span>Tráng miệng: <strong>{cleanDishName(activeTabMenu.meatDessert)}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Suất ăn chay */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-white space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between text-neutral-900 font-bold border-b border-amber-100 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Suất ăn chay: {activeTabVendorObj.name}</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">{shift}</span>
              </div>

              <div className="space-y-1.5 text-neutral-800">
                {activeTabMenu.vegDishes.map((dish, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{cleanDishName(dish)}</span>
                  </div>
                ))}
                {activeTabMenu.vegDessert && (
                  <div className="flex items-center gap-2 pt-1 text-amber-950 font-semibold border-t border-amber-50 mt-1">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      TM
                    </span>
                    <span>Tráng miệng chay: <strong className="text-emerald-700">{cleanDishName(activeTabMenu.vegDessert)}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
