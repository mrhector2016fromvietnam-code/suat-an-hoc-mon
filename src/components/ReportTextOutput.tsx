import React, { useState, useEffect } from 'react';
import { Copy, Check, CheckSquare, Square, Edit3, ChevronDown, Sparkles, Building2, Utensils } from 'lucide-react';
import { VendorPortionRow, DayShiftMenu, MealShift } from '../types/report';
import { getMenuForVendorAndShift } from '../data/vinhomesMenuData';

interface ReportTextOutputProps {
  shift: string;
  dateStr: string;
  dayOfWeek: string;
  selectedVendorIds: string[];
  setSelectedVendorIds: (ids: string[]) => void;
  allVendors: VendorPortionRow[];
  menusList: DayShiftMenu[];
  onUpdateMenuDishes: (vendorId: string, updatedMenu: Partial<DayShiftMenu>) => void;
}

export const ReportTextOutput: React.FC<ReportTextOutputProps> = ({
  shift,
  dateStr,
  dayOfWeek,
  selectedVendorIds,
  setSelectedVendorIds,
  allVendors,
  menusList,
  onUpdateMenuDishes,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedVendorId, setCopiedVendorId] = useState<string | null>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);

  // Active vendor for editing or tab view in dish breakdown
  const [activeEditingVendorId, setActiveEditingVendorId] = useState<string>(
    selectedVendorIds[0] || 'tam-phuong'
  );

  useEffect(() => {
    if (selectedVendorIds.length > 0 && !selectedVendorIds.includes(activeEditingVendorId)) {
      setActiveEditingVendorId(selectedVendorIds[0]);
    }
  }, [selectedVendorIds, activeEditingVendorId]);

  // Retrieve current active menu for editing
  const activeEditingMenu = getMenuForVendorAndShift(
    menusList,
    activeEditingVendorId,
    dayOfWeek,
    shift as MealShift
  );

  // Local editable fields
  const [meatText, setMeatText] = useState(activeEditingMenu.meatDishes.join(', '));
  const [meatDessertText, setMeatDessertText] = useState(activeEditingMenu.meatDessert);
  const [vegText, setVegText] = useState(activeEditingMenu.vegDishes.join(', '));
  const [vegDessertText, setVegDessertText] = useState(activeEditingMenu.vegDessert);

  // Sync editable fields when active vendor or shift changes
  useEffect(() => {
    setMeatText(activeEditingMenu.meatDishes.join(', '));
    setMeatDessertText(activeEditingMenu.meatDessert);
    setVegText(activeEditingMenu.vegDishes.join(', '));
    setVegDessertText(activeEditingMenu.vegDessert);
  }, [activeEditingVendorId, dayOfWeek, shift, menusList]);

  // Handle saving edits for the specific vendor
  const handleSaveMenuEdits = () => {
    onUpdateMenuDishes(activeEditingVendorId, {
      meatDishes: meatText.split(',').map((s) => s.trim()).filter(Boolean),
      meatDessert: meatDessertText.trim(),
      vegDishes: vegText.split(',').map((s) => s.trim()).filter(Boolean),
      vegDessert: vegDessertText.trim(),
    });
    setIsEditingMenu(false);
  };

  // Toggle single vendor
  const handleToggleVendor = (id: string) => {
    if (selectedVendorIds.includes(id)) {
      if (selectedVendorIds.length > 1) {
        setSelectedVendorIds(selectedVendorIds.filter((vId) => vId !== id));
      }
    } else {
      setSelectedVendorIds([...selectedVendorIds, id]);
    }
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedVendorIds.length === allVendors.length) {
      setSelectedVendorIds([allVendors[0].id]);
    } else {
      setSelectedVendorIds(allVendors.map((v) => v.id));
    }
  };

  // Vendors currently selected
  const activeVendors = allVendors.filter((v) => selectedVendorIds.includes(v.id));

  // Build single vendor report text reading strictly that vendor's menu
  const buildVendorBlock = (vendor: VendorPortionRow) => {
    const shiftLower = shift.toLowerCase();
    const vendorTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;
    const td8Str = vendor.td8 > 0 ? `${vendor.td8} suất` : 'chưa nhập suất';
    const td11_1Str = vendor.td11_1 > 0 ? `${vendor.td11_1} suất` : 'chưa nhập suất';
    const td11_3Str = vendor.td11_3 > 0 ? `${vendor.td11_3} suất` : 'chưa nhập suất';

    // READ THE ACCURATE MENU OF THIS SPECIFIC VENDOR
    const vendorMenu = getMenuForVendorAndShift(
      menusList,
      vendor.id,
      dayOfWeek,
      shift as MealShift
    );

    const meatDishesStr = vendorMenu.meatDishes.join(', ');
    const vegDishesStr = vendorMenu.vegDishes.join(', ');

    return `Báo cáo Anh/Chị: Khu bếp / nhà ăn phục vụ suất ăn ${shiftLower} ngày ${dateStr}
• Tổng cộng: ${vendorTotal} suất
NCC: ${vendor.name}
• Tổng suất ăn: ${vendorTotal} suất
TĐ 8: ${td8Str}
TĐ 11.1: ${td11_1Str}
TĐ 11.3: ${td11_3Str}
• Suất ăn mặn: ${meatDishesStr}
• Tráng miệng mặn: ${vendorMenu.meatDessert}
• Suất ăn chay: ${vegDishesStr}
• Tráng miệng chay: ${vendorMenu.vegDessert}
Cân định lượng: Đạt`;
  };

  // Build full combined text report
  const generateFullReportText = () => {
    const grandTotal = activeVendors.reduce(
      (sum, v) => sum + v.td8 + v.td11_1 + v.td11_3,
      0
    );

    if (activeVendors.length === 1) {
      return buildVendorBlock(activeVendors[0]);
    }

    // Multiple vendors report: each block strictly reads its own vendor's menu
    const blocks = activeVendors.map((vendor) => buildVendorBlock(vendor));
    return `BÁO CÁO TỔNG HỢP CÁC NHÀ CUNG CẤP - ${shift.toUpperCase()} NGÀY ${dateStr}
• TỔNG CỘNG TOÀN BỘ (${activeVendors.length} NCC): ${grandTotal} suất

${blocks.join('\n\n----------------------------------------\n\n')}`;
  };

  const fullReportText = generateFullReportText();

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullReportText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleCopySingle = (vendor: VendorPortionRow) => {
    const text = buildVendorBlock(vendor);
    navigator.clipboard.writeText(text);
    setCopiedVendorId(vendor.id);
    setTimeout(() => setCopiedVendorId(null), 2500);
  };

  const currentDisplayVendorMenu = getMenuForVendorAndShift(
    menusList,
    activeEditingVendorId,
    dayOfWeek,
    shift as MealShift
  );
  const currentDisplayVendor = allVendors.find((v) => v.id === activeEditingVendorId) || activeVendors[0];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Title & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900">
            5. Suất báo cáo bằng chữ
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Dữ liệu tự động đọc chính xác theo từng nhà cung cấp, ngày và ca ăn tương ứng
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Edit Dishes Button */}
          <button
            type="button"
            onClick={() => setIsEditingMenu(!isEditingMenu)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEditingMenu
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>{isEditingMenu ? 'Đóng chỉnh sửa' : 'Chỉnh sửa món'}</span>
          </button>

          {/* Master Copy Button */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              copiedAll
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0f2d4a] hover:bg-[#153e66] text-white'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép ({activeVendors.length} NCC)!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-teal-300" />
                <span>
                  Sao chép báo cáo {activeVendors.length > 1 ? `(${activeVendors.length} NCC)` : ''}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Multi-Vendor Selection Strip */}
      <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-800">
            Chọn các nhà cung cấp cùng hiện trong báo cáo ({selectedVendorIds.length}/{allVendors.length}):
          </span>
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            {selectedVendorIds.length === allVendors.length ? (
              <>
                <CheckSquare className="w-3.5 h-3.5" /> Bỏ chọn tất cả
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5" /> Chọn tất cả (7)
              </>
            )}
          </button>
        </div>

        {/* Vendors Checkbox Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {allVendors.map((vendor) => {
            const isChecked = selectedVendorIds.includes(vendor.id);
            const total = vendor.td8 + vendor.td11_1 + vendor.td11_3;

            return (
              <button
                type="button"
                key={vendor.id}
                onClick={() => handleToggleVendor(vendor.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-teal-700 text-white shadow-2xs font-bold ring-2 ring-teal-500/20'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <span>{vendor.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isChecked ? 'bg-white/20 text-white' : 'text-neutral-500 bg-neutral-100'
                }`}>
                  {total > 0 ? `${total}s` : '0s'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline Menu Editor Panel (if toggled) */}
      {isEditingMenu && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3 animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-amber-200 pb-2">
            <span className="font-bold text-amber-950">
              Chỉnh Sửa Thực Đơn cho NCC:
            </span>
            {/* Vendor Switcher for Editing */}
            <div className="flex flex-wrap items-center gap-1">
              {activeVendors.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveEditingVendorId(v.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    activeEditingVendorId === v.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border border-amber-300 text-amber-900'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Suất mặn */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-amber-200">
              <label className="block font-bold text-neutral-800">
                Các món mặn của {currentDisplayVendor.name} (ngăn cách bằng dấu phẩy):
              </label>
              <textarea
                rows={2}
                value={meatText}
                onChange={(e) => setMeatText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold text-neutral-700 shrink-0">Tráng miệng mặn:</span>
                <input
                  type="text"
                  value={meatDessertText}
                  onChange={(e) => setMeatDessertText(e.target.value)}
                  className="flex-1 px-2 py-1 rounded-md border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Suất chay */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-amber-200">
              <label className="block font-bold text-neutral-800">
                Các món chay của {currentDisplayVendor.name} (ngăn cách bằng dấu phẩy):
              </label>
              <textarea
                rows={2}
                value={vegText}
                onChange={(e) => setVegText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="font-semibold text-neutral-700 shrink-0">Tráng miệng chay:</span>
                <input
                  type="text"
                  value={vegDessertText}
                  onChange={(e) => setVegDessertText(e.target.value)}
                  placeholder="VD: Sữa đậu nành, Ổi..."
                  className="flex-1 px-2 py-1 rounded-md border border-neutral-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingMenu(false)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveMenuEdits}
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
            >
              Lưu &amp; Cập Nhật Báo Cáo ({currentDisplayVendor.name})
            </button>
          </div>
        </div>
      )}

      {/* Main Text Box (Pre-wrapped text for easy copy) */}
      <div className="relative rounded-2xl border border-neutral-200 bg-[#f8fafc] p-5 font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed select-text space-y-4">
        {activeVendors.length === 1 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="font-bold text-teal-900 text-xs">
                NCC: {activeVendors[0].name} ({shift} · {dateStr})
              </span>
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-2.5 py-1 rounded-lg bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
              </button>
            </div>
            <pre className="font-sans whitespace-pre-wrap leading-relaxed text-neutral-900 text-xs sm:text-sm font-medium">
              {fullReportText}
            </pre>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="font-bold text-teal-900 border-b border-neutral-200 pb-2.5 flex items-center justify-between">
              <span>Báo cáo tổng hợp: {activeVendors.length} nhà cung cấp ({shift} · {dateStr})</span>
              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3 py-1 rounded-lg bg-teal-700 text-white hover:bg-teal-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Đã chép tất cả!' : 'Sao chép toàn bộ báo cáo'}</span>
              </button>
            </div>

            {activeVendors.map((vendor, index) => (
              <div
                key={vendor.id}
                className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                      NCC: {vendor.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopySingle(vendor)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedVendorId === vendor.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-teal-600" />
                        <span>Sao chép riêng NCC này</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="font-sans whitespace-pre-wrap text-neutral-800 text-xs leading-relaxed font-medium bg-[#fafbfc] p-3 rounded-lg border border-neutral-100">
                  {buildVendorBlock(vendor)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Columns Dish Breakdown with Vendor Switcher */}
      <div className="space-y-3 pt-2 border-t border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-teal-700" />
            <span>Chi tiết các món ăn ca {shift} ({dayOfWeek} - {dateStr})</span>
          </div>

          {/* Switch which vendor dishes to preview */}
          {activeVendors.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium">Xem món của:</span>
              <select
                value={activeEditingVendorId}
                onChange={(e) => setActiveEditingVendorId(e.target.value)}
                className="px-2 py-1 rounded-lg border border-neutral-300 bg-white font-bold text-teal-900 cursor-pointer text-xs"
              >
                {activeVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Suất ăn mặn */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-neutral-900 font-bold border-b border-neutral-200/80 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Suất ăn mặn: {currentDisplayVendor.name}</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-normal">{shift}</span>
            </div>

            <div className="space-y-1.5 text-neutral-800">
              {currentDisplayVendorMenu.meatDishes.map((dish, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-200/80 text-neutral-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{dish}</span>
                </div>
              ))}
              {currentDisplayVendorMenu.meatDessert && (
                <div className="flex items-center gap-2 pt-1 text-emerald-800 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    TM
                  </span>
                  <span>Tráng miệng mặn: <strong>{currentDisplayVendorMenu.meatDessert}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Suất ăn chay */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-neutral-900 font-bold border-b border-neutral-200/80 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Suất ăn chay: {currentDisplayVendor.name}</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-normal">{shift}</span>
            </div>

            <div className="space-y-1.5 text-neutral-800">
              {currentDisplayVendorMenu.vegDishes.map((dish, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-200/80 text-neutral-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{dish}</span>
                </div>
              ))}
              {currentDisplayVendorMenu.vegDessert && (
                <div className="flex items-center gap-2 pt-1 text-amber-900 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    TM
                  </span>
                  <span>Tráng miệng chay: <strong className="text-emerald-700">{currentDisplayVendorMenu.vegDessert}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
