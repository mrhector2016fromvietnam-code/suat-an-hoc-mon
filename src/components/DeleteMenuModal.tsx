import React, { useState } from 'react';
import { Trash2, AlertTriangle, CheckSquare, Square, RefreshCcw, X, Building2, Check, ArrowRight } from 'lucide-react';
import { DayShiftMenu, MealShift, VendorPortionRow } from '../types/report';
import { DAYS_OF_WEEK } from '../data/vinhomesMenuData';

interface DeleteMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendors: { id: string; name: string; code: string }[];
  menusList: DayShiftMenu[];
  onDeleteSelectedShifts: (shiftsToDelete: { vendorId: string; dayOfWeek: string; shift: MealShift }[], action: 'clear' | 'reset-default') => void;
  onResetVendorMenus: (vendorId: string) => void;
  onClearVendorMenus: (vendorId: string) => void;
  initialVendorId?: string;
}

export const DeleteMenuModal: React.FC<DeleteMenuModalProps> = ({
  isOpen,
  onClose,
  vendors,
  menusList,
  onDeleteSelectedShifts,
  onResetVendorMenus,
  onClearVendorMenus,
  initialVendorId = 'tam-phuong',
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState<string>(initialVendorId);
  const [deleteMode, setDeleteMode] = useState<'shifts' | 'vendor-full'>('shifts');
  
  // Selection set of shifts to delete: format "dayOfWeek_shift"
  const [selectedShiftKeys, setSelectedShiftKeys] = useState<string[]>([]);
  const [deleteAction, setDeleteAction] = useState<'clear' | 'reset-default'>('reset-default');
  const [confirmStep, setConfirmStep] = useState(false);

  if (!isOpen) return null;

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const shifts: MealShift[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];

  // All 21 shift keys for current vendor
  const allCurrentShiftKeys = DAYS_OF_WEEK.flatMap((d) => 
    shifts.map((s) => `${d.day}_${s}`)
  );

  const isAllSelected = allCurrentShiftKeys.length > 0 && allCurrentShiftKeys.every((k) => selectedShiftKeys.includes(k));

  const handleToggleShiftKey = (key: string) => {
    if (selectedShiftKeys.includes(key)) {
      setSelectedShiftKeys(selectedShiftKeys.filter((k) => k !== key));
    } else {
      setSelectedShiftKeys([...selectedShiftKeys, key]);
    }
  };

  const handleSelectAllCurrentVendor = () => {
    if (isAllSelected) {
      setSelectedShiftKeys([]);
    } else {
      setSelectedShiftKeys([...allCurrentShiftKeys]);
    }
  };

  const handleSelectDayAllShifts = (day: string) => {
    const dayKeys = shifts.map((s) => `${day}_${s}`);
    const allPresent = dayKeys.every((k) => selectedShiftKeys.includes(k));
    if (allPresent) {
      setSelectedShiftKeys(selectedShiftKeys.filter((k) => !dayKeys.includes(k)));
    } else {
      const added = new Set([...selectedShiftKeys, ...dayKeys]);
      setSelectedShiftKeys(Array.from(added));
    }
  };

  // Execution
  const handleExecuteDeleteShifts = () => {
    if (selectedShiftKeys.length === 0) return;

    const formattedList = selectedShiftKeys.map((k) => {
      const [dayOfWeek, shift] = k.split('_');
      return {
        vendorId: selectedVendorId,
        dayOfWeek,
        shift: shift as MealShift,
      };
    });

    onDeleteSelectedShifts(formattedList, deleteAction);
    setSelectedShiftKeys([]);
    setConfirmStep(false);
    onClose();
  };

  const handleExecuteFullVendorReset = (action: 'clear' | 'reset') => {
    if (action === 'reset') {
      onResetVendorMenus(selectedVendorId);
    } else {
      onClearVendorMenus(selectedVendorId);
    }
    setConfirmStep(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-neutral-200 space-y-5 text-xs flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-neutral-900">
                Xóa hoặc Khôi phục thực đơn up nhầm
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Xử lý linh hoạt khi lỡ tải nhầm file ảnh, văn bản hoặc nhập sai các ca ăn trong tuần
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center font-bold cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Chọn Nhà Cung Cấp */}
        <div className="space-y-2">
          <label className="font-bold text-neutral-800 flex items-center gap-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Chọn nhà cung cấp muốn xử lý thực đơn:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
            {vendors.map((v) => {
              const isSelected = selectedVendorId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendorId(v.id);
                    setSelectedShiftKeys([]);
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-300 text-red-950 font-bold ring-1 ring-red-400'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[10px] text-neutral-500">{v.code}</span>
                    {isSelected && <Check className="w-3 h-3 text-red-600" />}
                  </div>
                  <div className="truncate text-xs mt-0.5 font-semibold">{v.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab chuyển đổi chế độ xóa: Chọn ca ăn VS Xóa toàn bộ tuần của NCC */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            type="button"
            onClick={() => setDeleteMode('shifts')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              deleteMode === 'shifts'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            1. Chọn từng ca ăn cụ thể để xóa ({selectedShiftKeys.length} ca đã chọn)
          </button>
          <button
            type="button"
            onClick={() => setDeleteMode('vendor-full')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              deleteMode === 'vendor-full'
                ? 'bg-red-700 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            2. Xóa / Khôi phục toàn bộ tuần của {currentVendor.name}
          </button>
        </div>

        {/* Nội dung CHẾ ĐỘ 1: Chọn từng ca ăn để xóa */}
        {deleteMode === 'shifts' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
              <span className="text-[11px] text-neutral-600">
                Tích chọn các ca ăn bị up nhầm của <strong>{currentVendor.name}</strong>:
              </span>
              <button
                type="button"
                onClick={handleSelectAllCurrentVendor}
                className="text-[11px] font-bold text-red-700 hover:text-red-900 flex items-center gap-1 cursor-pointer"
              >
                {isAllSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" /> Bỏ chọn tất cả (21 ca)
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" /> Chọn tất cả 21 ca ăn
                  </>
                )}
              </button>
            </div>

            {/* Danh sách 7 ngày trong tuần */}
            <div className="space-y-2 max-h-[35vh] overflow-y-auto divide-y divide-neutral-100 border border-neutral-200 rounded-xl p-2 bg-white">
              {DAYS_OF_WEEK.map(({ day, date }) => {
                const dayKeys = shifts.map((s) => `${day}_${s}`);
                const allDaySelected = dayKeys.every((k) => selectedShiftKeys.includes(k));

                return (
                  <div key={day} className="pt-2 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-xs">{day}</span>
                        <span className="text-neutral-400 font-mono text-[10px]">({date})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectDayAllShifts(day)}
                        className="text-[10px] text-teal-800 hover:underline font-medium"
                      >
                        {allDaySelected ? 'Bỏ chọn cả ngày' : 'Chọn cả 3 ca'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {shifts.map((shift) => {
                        const key = `${day}_${shift}`;
                        const isChecked = selectedShiftKeys.includes(key);
                        const existingMenu = menusList.find(
                          (m) => m.vendorId === selectedVendorId && m.dayOfWeek === day && m.shift === shift
                        );

                        const dishesSummary = existingMenu?.meatDishes?.length
                          ? existingMenu.meatDishes.slice(0, 2).join(', ')
                          : 'Trống';

                        return (
                          <div
                            key={shift}
                            onClick={() => handleToggleShiftKey(key)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                              isChecked
                                ? 'bg-red-50/80 border-red-300 text-red-900 ring-1 ring-red-400'
                                : 'bg-neutral-50/60 border-neutral-200 text-neutral-700 hover:bg-neutral-100/80'
                            }`}
                          >
                            <div className="pt-0.5">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-red-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-[11px] leading-tight">{shift}</div>
                              <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                                {dishesSummary}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tùy chọn xử lý khi xóa */}
            <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-xl space-y-2">
              <span className="font-bold text-amber-950 block text-[11px]">
                Chọn cách xử lý cho các ca ăn được chọn:
              </span>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800 text-[11px]">
                  <input
                    type="radio"
                    name="deleteAction"
                    value="reset-default"
                    checked={deleteAction === 'reset-default'}
                    onChange={() => setDeleteAction('reset-default')}
                    className="text-teal-700 focus:ring-teal-500"
                  />
                  <span>🔄 Khôi phục về thực đơn chuẩn chính thức (Khuyên dùng)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800 text-[11px]">
                  <input
                    type="radio"
                    name="deleteAction"
                    value="clear"
                    checked={deleteAction === 'clear'}
                    onChange={() => setDeleteAction('clear')}
                    className="text-red-700 focus:ring-red-500"
                  />
                  <span>🗑️ Xóa trắng ca ăn (để trống danh sách món)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Nội dung CHẾ ĐỘ 2: Xóa toàn bộ tuần của NCC (Khi up nhầm cả file) */}
        {deleteMode === 'vendor-full' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
              <div className="flex items-center gap-2 text-red-900 font-bold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Bạn muốn hủy bỏ toàn bộ thực đơn vừa tải lên của: {currentVendor.name}?</span>
              </div>
              <p className="text-[11px] text-red-700 leading-relaxed">
                Khi tải nhầm nguyên file thực đơn cho nhà cung cấp này, bạn có thể nhanh chóng xóa bỏ hoặc khôi phục lại bộ thực đơn chuẩn của hệ thống mà không ảnh hưởng đến các nhà cung cấp khác.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Revert to official menu */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-teal-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <RefreshCcw className="w-4 h-4 text-teal-600" />
                    <span>Khôi phục thực đơn gốc chuẩn</span>
                  </div>
                  <p className="text-[11px] text-teal-800 mt-1 leading-relaxed">
                    Hủy tệp vừa tải lên nhầm và đặt lại toàn bộ 21 ca ăn của <strong>{currentVendor.name}</strong> về danh sách món chuẩn 100% được quy định cho nhà cung cấp này.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteFullVendorReset('reset')}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục menu chuẩn của {currentVendor.name}</span>
                </button>
              </div>

              {/* Option B: Clear all to blank */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-red-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Xóa trắng thực đơn tuần</span>
                  </div>
                  <p className="text-[11px] text-red-800 mt-1 leading-relaxed">
                    Xóa sạch toàn bộ các món mặn, món chay và tráng miệng của cả tuần cho <strong>{currentVendor.name}</strong> để bạn tự tải lại hoặc nhập mới từ đầu.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExecuteFullVendorReset('clear')}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa trắng toàn bộ món ({currentVendor.name})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {deleteMode === 'shifts' && (
            <button
              type="button"
              disabled={selectedShiftKeys.length === 0}
              onClick={handleExecuteDeleteShifts}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                selectedShiftKeys.length > 0
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>
                {deleteAction === 'clear' ? 'Xóa trắng' : 'Khôi phục chuẩn'} {selectedShiftKeys.length} ca đã chọn
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
