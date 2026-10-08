import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, Check, CheckSquare, Square, Edit3, Sparkles, Building2, 
  Utensils, RotateCcw, Plus, X, FileCheck, CheckCircle2, Hash,
  Trash2, AlertCircle, RefreshCw, Layers
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

// Preset common desserts for quick selection
const COMMON_DESSERTS = [
  'Dưa hấu', 'Chuối', 'Ổi', 'Táo xanh', 'Sữa chua', 'Sữa đậu nành', 
  'Thạch rau câu', 'Quýt', 'Thanh long', 'Cam sành', 'Nước sâm'
];

const stripQuantitySuffix = (name: string): string => {
  if (!name) return '';
  return name.replace(/\s*\([^)]*?(?:\d+|g|ml|gr|gram|kg|suất|hũ|trái|miếng|quả|con|chén|ly|hộp|gói)[^)]*?\)\s*$/gi, '').trim() || name;
};

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
  
  // KTX Selection: 'KTX1' | 'KTX2' (Default: 'KTX1')
  const [selectedKtx, setSelectedKtx] = useState<'KTX1' | 'KTX2'>('KTX1');

  // Active vendor tab when inspecting/editing dishes
  const [activeTabVendorId, setActiveTabVendorId] = useState<string>(
    selectedVendorIds[0] || 'tam-phuong'
  );

  // Dedicated isolated states for Meat (Mặn) and Veg (Chay) dishes
  const [manItems, setManItems] = useState<string[]>([]);
  const [chayItems, setChayItems] = useState<string[]>([]);
  const [manDessert, setManDessert] = useState<string>('');
  const [chayDessert, setChayDessert] = useState<string>('');

  // Custom quality/weighing status text
  const [customQualityNote, setCustomQualityNote] = useState<string>('Cân định lượng: Đạt');

  // New dish inputs
  const [newMeatDishInput, setNewMeatDishInput] = useState<string>('');
  const [newVegDishInput, setNewVegDishInput] = useState<string>('');

  // Editable dish index tracker for in-place renaming
  const [editingMeatIndex, setEditingMeatIndex] = useState<number | null>(null);
  const [editingMeatVal, setEditingMeatVal] = useState<string>('');
  const [editingVegIndex, setEditingVegIndex] = useState<number | null>(null);
  const [editingVegVal, setEditingVegVal] = useState<string>('');

  useEffect(() => {
    if (selectedVendorIds.length > 0 && !selectedVendorIds.includes(activeTabVendorId)) {
      setActiveTabVendorId(selectedVendorIds[0]);
    }
  }, [selectedVendorIds, activeTabVendorId]);

  // Synchronize isolated states when active vendor, day, shift or menusList changes
  useEffect(() => {
    const currentMenu = getMenuForVendorAndShift(menusList, activeTabVendorId, dayOfWeek, shift as MealShift);
    setManItems(Array.isArray(currentMenu.meatDishes) ? currentMenu.meatDishes.map(cleanDishName).filter(Boolean) : []);
    setChayItems(Array.isArray(currentMenu.vegDishes) ? currentMenu.vegDishes.map(cleanDishName).filter(Boolean) : []);
    setManDessert(cleanDishName(currentMenu.meatDessert || ''));
    setChayDessert(cleanDishName(currentMenu.vegDessert || ''));
  }, [activeTabVendorId, dayOfWeek, shift, menusList]);

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

  // Active vendor obj
  const activeTabVendorObj = allVendors.find((v) => v.id === activeTabVendorId) || activeVendors[0] || allVendors[0];

  /**
   * Helper: Determine pricing and shift naming strictly according to standard template:
   * - Bữa sáng: 20.000đ, Ca "suất ăn sáng"
   * - Bữa trưa: 40.000đ, Ca "suất ăn trưa"
   * - Bữa tối: 40.000đ, Ca "suất ăn tối"
   */
  const getShiftDetails = (shiftName: string) => {
    const s = shiftName.toLowerCase();
    if (s.includes('sáng')) {
      return { price: '20.000đ', label: 'suất ăn sáng', isMorning: true, isLunch: false, isDinner: false };
    }
    if (s.includes('trưa')) {
      return { price: '40.000đ', label: 'suất ăn trưa', isMorning: false, isLunch: true, isDinner: false };
    }
    return { price: '40.000đ', label: 'suất ăn tối', isMorning: false, isLunch: false, isDinner: true };
  };

  /**
   * Helper: Build single vendor report text strictly matching user real-world template
   */
  const buildVendorBlock = (
    vendor: VendorPortionRow, 
    ktxName: string = selectedKtx
  ) => {
    const shiftInfo = getShiftDetails(shift);
    const vendorTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;
    const td8Str = vendor.td8 > 0 ? `${vendor.td8} suất` : 'chưa nhập suất';
    const td11_1Str = vendor.td11_1 > 0 ? `${vendor.td11_1} suất` : 'chưa nhập suất';
    const td11_3Str = vendor.td11_3 > 0 ? `${vendor.td11_3} suất` : 'chưa nhập suất';

    const vendorMenu = getMenuForVendorAndShift(menusList, vendor.id, dayOfWeek, shift as MealShift);
    const meatDishesStr = vendorMenu.meatDishes.map((d) => stripQuantitySuffix(cleanDishName(d))).filter(Boolean).join(', ');
    const vegDishesStr = vendorMenu.vegDishes.map((d) => stripQuantitySuffix(cleanDishName(d))).filter(Boolean).join(', ');
    const meatDessertClean = stripQuantitySuffix(cleanDishName(vendorMenu.meatDessert));
    const vegDessertClean = stripQuantitySuffix(cleanDishName(vendorMenu.vegDessert));

    // Standard Vietnamese Real-World Format strictly matching Prompt
    if (shiftInfo.isMorning) {
      // 1. Bữa sáng (Không có tráng miệng, đơn giá 20.000đ)
      return `Báo cáo Anh/Chị: Lán trại Hóc Môn ${ktxName} phục vụ suất ăn sáng ngày ${dateStr}
• Tổng cộng: ${vendorTotal} suất
• Đơn giá: 20.000đ
NCC: ${vendor.name}
• Tổng suất ăn: ${vendorTotal} suất
TĐ 8: ${td8Str}
TĐ 11.1: ${td11_1Str}
TĐ 11.3: ${td11_3Str}
• Suất ăn mặn: ${meatDishesStr || 'Chưa cập nhật'}
• Suất ăn chay: ${vegDishesStr || 'Chưa cập nhật'}
${customQualityNote}`;
    }

    if (shiftInfo.isLunch) {
      // 2. Bữa trưa (Không có tráng miệng, đơn giá 40.000đ)
      return `Báo cáo Anh/Chị: Lán trại Hóc Môn ${ktxName} phục vụ suất ăn trưa ngày ${dateStr}
• Tổng cộng: ${vendorTotal} suất
• Đơn giá: 40.000đ
NCC: ${vendor.name}
• Tổng suất ăn: ${vendorTotal} suất
TĐ 8: ${td8Str}
TĐ 11.1: ${td11_1Str}
TĐ 11.3: ${td11_3Str}
• Suất ăn mặn: ${meatDishesStr || 'Chưa cập nhật'}
• Suất ăn chay: ${vegDishesStr || 'Chưa cập nhật'}
${customQualityNote}`;
    }

    // 3. Bữa tối (Có tráng miệng mặn & tráng miệng chay nếu có, đơn giá 40.000đ)
    const dessertLines: string[] = [];
    if (meatDessertClean) {
      dessertLines.push(`• Tráng miệng mặn: ${meatDessertClean}`);
    } else {
      dessertLines.push(`• Tráng miệng mặn: —`);
    }

    const vegDessertLine = vegDessertClean
      ? `• Tráng miệng chay: ${vegDessertClean}`
      : (meatDessertClean ? `• Tráng miệng chay: ${meatDessertClean}` : `• Tráng miệng chay: —`);

    return `Báo cáo Anh/Chị: Lán trại Hóc Môn ${ktxName} phục vụ suất ăn tối ngày ${dateStr}
• Tổng cộng: ${vendorTotal} suất
• Đơn giá: 40.000đ
NCC: ${vendor.name}
• Tổng suất ăn: ${vendorTotal} suất
TĐ 8: ${td8Str}
TĐ 11.1: ${td11_1Str}
TĐ 11.3: ${td11_3Str}
• Suất ăn mặn: ${meatDishesStr || 'Chưa cập nhật'}
${dessertLines.join('\n')}
• Suất ăn chay: ${vegDishesStr || 'Chưa cập nhật'}
${vegDessertLine}
${customQualityNote}`;
  };

  // Helper: Build combined report text across all active vendors
  const generatedFullReport = useMemo(() => {
    if (activeVendors.length === 0) {
      return 'Vui lòng chọn ít nhất 1 Nhà Cung Cấp để tạo báo cáo.';
    }

    if (activeVendors.length === 1) {
      return buildVendorBlock(activeVendors[0], selectedKtx);
    }

    const blocks = activeVendors.map((vendor) => buildVendorBlock(vendor, selectedKtx));
    return blocks.join('\n\n----------------------------------------\n\n');
  }, [activeVendors, shift, dateStr, dayOfWeek, menusList, customQualityNote, selectedKtx]);

  // Copy full text
  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedFullReport);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Copy single vendor text
  const handleCopySingle = (vendor: VendorPortionRow) => {
    const text = buildVendorBlock(vendor, selectedKtx);
    navigator.clipboard.writeText(text);
    setCopiedVendorId(vendor.id);
    setTimeout(() => setCopiedVendorId(null), 2500);
  };

  // 1. Independent Meat Dish Handlers (Tách biệt hoàn toàn cho Suất ăn mặn)
  const handleAddMeatDish = () => {
    if (!newMeatDishInput.trim()) return;
    const newItems = newMeatDishInput.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean);
    if (newItems.length === 0) return;

    setManItems((prev) => {
      const updated = [...prev, ...newItems];
      onUpdateMenuDishes(activeTabVendorId, { meatDishes: updated });
      return updated;
    });
    setNewMeatDishInput('');
  };

  const handleRemoveMeatDish = (index: number) => {
    setManItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      onUpdateMenuDishes(activeTabVendorId, { meatDishes: updated });
      return updated;
    });
  };

  const handleSaveEditMeat = (index: number) => {
    if (!editingMeatVal.trim()) {
      handleRemoveMeatDish(index);
      setEditingMeatIndex(null);
      return;
    }
    const cleaned = cleanDishName(editingMeatVal);
    setManItems((prev) => {
      const updated = [...prev];
      updated[index] = cleaned;
      onUpdateMenuDishes(activeTabVendorId, { meatDishes: updated });
      return updated;
    });
    setEditingMeatIndex(null);
  };

  const handleUpdateMeatDessert = (val: string) => {
    const cleaned = cleanDishName(val);
    setManDessert(cleaned);
    onUpdateMenuDishes(activeTabVendorId, { meatDessert: cleaned });
  };

  // 2. Independent Veg Dish Handlers (Tách biệt hoàn toàn cho Suất ăn chay)
  const handleAddVegDish = () => {
    if (!newVegDishInput.trim()) return;
    const newItems = newVegDishInput.split(',').map((s) => cleanDishName(s.trim())).filter(Boolean);
    if (newItems.length === 0) return;

    setChayItems((prev) => {
      const updated = [...prev, ...newItems];
      onUpdateMenuDishes(activeTabVendorId, { vegDishes: updated });
      return updated;
    });
    setNewVegDishInput('');
  };

  const handleRemoveVegDish = (index: number) => {
    setChayItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      onUpdateMenuDishes(activeTabVendorId, { vegDishes: updated });
      return updated;
    });
  };

  const handleSaveEditVeg = (index: number) => {
    if (!editingVegVal.trim()) {
      handleRemoveVegDish(index);
      setEditingVegIndex(null);
      return;
    }
    const cleaned = cleanDishName(editingVegVal);
    setChayItems((prev) => {
      const updated = [...prev];
      updated[index] = cleaned;
      onUpdateMenuDishes(activeTabVendorId, { vegDishes: updated });
      return updated;
    });
    setEditingVegIndex(null);
  };

  const handleUpdateVegDessert = (val: string) => {
    const cleaned = cleanDishName(val);
    setChayDessert(cleaned);
    onUpdateMenuDishes(activeTabVendorId, { vegDessert: cleaned });
  };

  // Reset current vendor menu to 100% authentic preloaded default
  const handleResetCurrentVendorMenu = () => {
    const defaultShift = PRELOADED_MENUS.find(
      (m) => m.vendorId === activeTabVendorId && m.dayOfWeek === dayOfWeek && m.shift === shift
    );
    if (defaultShift) {
      const cleanedMeat = defaultShift.meatDishes.map(cleanDishName);
      const cleanedVeg = defaultShift.vegDishes.map(cleanDishName);
      const cleanedMeatDessert = cleanDishName(defaultShift.meatDessert);
      const cleanedVegDessert = cleanDishName(defaultShift.vegDessert);

      setManItems(cleanedMeat);
      setChayItems(cleanedVeg);
      setManDessert(cleanedMeatDessert);
      setChayDessert(cleanedVegDessert);

      onUpdateMenuDishes(activeTabVendorId, {
        meatDishes: cleanedMeat,
        meatDessert: cleanedMeatDessert,
        vegDishes: cleanedVeg,
        vegDessert: cleanedVegDessert,
      });
    }
  };

  // Clear current vendor menu to empty
  const handleClearCurrentVendorMenu = () => {
    setManItems([]);
    setChayItems([]);
    setManDessert('');
    setChayDessert('');
    onUpdateMenuDishes(activeTabVendorId, {
      meatDishes: [],
      meatDessert: '',
      vegDishes: [],
      vegDessert: '',
    });
  };

  const shiftInfo = getShiftDetails(shift);

  return (
    <div className="space-y-6">
      {/* SECTION 1: VISUAL MENU INSPECTOR & DIRECT INLINE EDITOR */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden space-y-0">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0b1e33] to-[#123154] text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold">
              <Utensils className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Thực Đơn &amp; Chỉnh Sửa Trực Tiếp Món Ăn
                </h3>
                <span className="px-2 py-0.5 rounded bg-teal-400 text-neutral-950 font-bold text-[10px] font-mono">
                  {shift} · {dayOfWeek} ({dateStr})
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Xem chính xác món mặn &amp; món chay của từng nhà cung cấp. Nhấp vào tên món để sửa, bấm nút thêm/xóa trực tiếp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetCurrentVendorMenu}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              title="Khôi phục thực đơn gốc chính xác theo hợp đồng"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nạp lại menu gốc ({activeTabVendorObj.name})</span>
            </button>
            <button
              type="button"
              onClick={handleClearCurrentVendorMenu}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/30"
              title="Xóa trắng món của nhà cung cấp này trong ca hiện tại"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa món ca này</span>
            </button>
          </div>
        </div>

        {/* Vendor Switcher Tabs */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-700 mr-1">Chọn NCC để xem/sửa:</span>
            {allVendors.map((v) => {
              const isSelected = selectedVendorIds.includes(v.id);
              const isActive = activeTabVendorId === v.id;
              const total = v.td8 + v.td11_1 + v.td11_3;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveTabVendorId(v.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0b1e33] text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-teal-400 text-neutral-950' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {v.code}
                  </span>
                  <span>{v.name}</span>
                  {total > 0 && (
                    <span className={`text-[10px] font-mono ${isActive ? 'text-teal-300' : 'text-neutral-400'}`}>
                      ({total}s)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Đang xem: <strong className="text-teal-900 font-bold">{activeTabVendorObj.name}</strong> ({activeTabVendorObj.code})
          </div>
        </div>

        {/* Live Dishes Editing Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Column 1: Món Mặn */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
              <span className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Suất ăn mặn: {activeTabVendorObj.name}</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                {manItems.length} món
              </span>
            </div>

            {/* List of meat dishes */}
            <div className="space-y-1.5 min-h-[100px]">
              {manItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-emerald-200 text-center text-xs text-emerald-700">
                  Chưa có món mặn. Hãy gõ tên món bên dưới và bấm "Thêm món" hoặc "Nạp lại menu gốc".
                </div>
              ) : (
                manItems.map((dish, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200/80 text-xs group hover:border-emerald-400 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {editingMeatIndex === idx ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingMeatVal}
                          onChange={(e) => setEditingMeatVal(e.target.value)}
                          onBlur={() => handleSaveEditMeat(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditMeat(idx);
                            if (e.key === 'Escape') setEditingMeatIndex(null);
                          }}
                          className="flex-1 px-2 py-1 rounded border border-emerald-400 text-xs font-semibold focus:outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingMeatIndex(idx);
                            setEditingMeatVal(dish);
                          }}
                          className="font-semibold text-neutral-800 hover:text-emerald-900 cursor-pointer flex-1"
                          title="Nhấp để đổi tên món"
                        >
                          {dish}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMeatIndex(idx);
                          setEditingMeatVal(dish);
                        }}
                        className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                        title="Sửa tên món"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMeatDish(idx)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Xóa món này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Meat Dish Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
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
                placeholder="Nhập món mặn mới (hoặc gõ nhiều món cách nhau bởi dấu phẩy)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleAddMeatDish}
                disabled={!newMeatDishInput.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Meat Dessert (Bữa tối) */}
            {shiftInfo.isDinner && (
              <div className="pt-2 border-t border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-950">Tráng miệng mặn:</span>
                  <span className="text-[10px] text-neutral-400">Gõ hoặc chọn nhanh:</span>
                </div>
                <input
                  type="text"
                  value={manDessert}
                  onChange={(e) => handleUpdateMeatDessert(e.target.value)}
                  placeholder="VD: Dưa hấu, Chuối, Ổi..."
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                />
                <div className="flex flex-wrap items-center gap-1">
                  {COMMON_DESSERTS.slice(0, 6).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleUpdateMeatDessert(d)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100 text-emerald-900 transition-colors cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Món Chay (Hoàn toàn độc lập) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
              <span className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-600" />
                <span>Suất ăn chay: {activeTabVendorObj.name}</span>
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                {chayItems.length} món
              </span>
            </div>

            {/* List of veg dishes */}
            <div className="space-y-1.5 min-h-[100px]">
              {chayItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-amber-200 text-center text-xs text-amber-700">
                  Chưa có món chay. Hãy gõ tên món bên dưới và bấm "Thêm món" hoặc "Nạp lại menu gốc".
                </div>
              ) : (
                chayItems.map((dish, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200/80 text-xs group hover:border-amber-400 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {editingVegIndex === idx ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingVegVal}
                          onChange={(e) => setEditingVegVal(e.target.value)}
                          onBlur={() => handleSaveEditVeg(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditVeg(idx);
                            if (e.key === 'Escape') setEditingVegIndex(null);
                          }}
                          className="flex-1 px-2 py-1 rounded border border-amber-400 text-xs font-semibold focus:outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingVegIndex(idx);
                            setEditingVegVal(dish);
                          }}
                          className="font-semibold text-neutral-800 hover:text-amber-900 cursor-pointer flex-1"
                          title="Nhấp để đổi tên món"
                        >
                          {dish}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVegIndex(idx);
                          setEditingVegVal(dish);
                        }}
                        className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                        title="Sửa tên món"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVegDish(idx)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Xóa món này"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Veg Dish Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
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
                placeholder="Nhập món chay mới (hoặc nhiều món cách nhau bởi dấu phẩy)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleAddVegDish}
                disabled={!newVegDishInput.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            {/* Veg Dessert (Bữa tối) */}
            {shiftInfo.isDinner && (
              <div className="pt-2 border-t border-amber-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-950">Tráng miệng chay:</span>
                  <span className="text-[10px] text-neutral-400">Gõ hoặc chọn nhanh:</span>
                </div>
                <input
                  type="text"
                  value={chayDessert}
                  onChange={(e) => handleUpdateVegDessert(e.target.value)}
                  placeholder="VD: Sữa đậu nành, Ổi, Sữa chua..."
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none bg-white"
                />
                <div className="flex flex-wrap items-center gap-1">
                  {COMMON_DESSERTS.slice(4, 10).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleUpdateVegDessert(d)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-amber-900 transition-colors cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: STANDARDIZED REPORT PREVIEW & MASTER 1-CLICK COPY */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <h3 className="text-base font-bold text-neutral-900">
                Văn Bản Báo Cáo Chuẩn Hóa · Lán Trại Hóc Môn
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tự động khớp 100% định dạng mẫu báo cáo thực tế cho <strong>{selectedKtx}</strong> ({shift} · {dateStr})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* KTX1 / KTX2 Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedKtx('KTX1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedKtx === 'KTX1'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                KTX 1
              </button>
              <button
                type="button"
                onClick={() => setSelectedKtx('KTX2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedKtx === 'KTX2'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                KTX 2
              </button>
            </div>

            {/* Master Copy Button */}
            <button
              type="button"
              onClick={handleCopyAll}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                copiedAll
                  ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                  : 'bg-teal-700 hover:bg-teal-600 text-white'
              }`}
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Đã sao chép ({selectedKtx})!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-teal-200" />
                  <span>Sao chép báo cáo {selectedKtx}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vendors Checkbox Selector for Report inclusion */}
        <div className="p-3.5 rounded-xl bg-neutral-50/90 border border-neutral-200 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-800">
              Nhà cung cấp đưa vào báo cáo ({selectedVendorIds.length}/{allVendors.length} NCC):
            </span>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
            >
              {selectedVendorIds.length === allVendors.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả (7 NCC)'}
            </button>
          </div>

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
                      : 'bg-white/60 border-neutral-200 opacity-60'
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

        {/* Formatted Output Previews */}
        <div className="space-y-4">
          {activeVendors.map((vendor, index) => {
            const vendorText = buildVendorBlock(vendor, selectedKtx);

            return (
              <div
                key={vendor.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#fafbfc] border border-neutral-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {vendor.name} ({vendor.code}) - {selectedKtx}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTabVendorId(vendor.id);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-teal-700" />
                      <span>Sửa món</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(vendor)}
                      className="px-3 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedVendorId === vendor.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Đã chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-700" />
                          <span>Sao chép riêng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <pre className="font-sans whitespace-pre-wrap text-neutral-900 text-xs sm:text-sm leading-relaxed font-medium bg-white p-4 rounded-xl border border-neutral-200 select-text shadow-2xs">
                  {vendorText}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
