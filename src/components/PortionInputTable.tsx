import React, { useState } from 'react';
import { VendorPortionRow } from '../types/report';
import { CheckSquare, Square, Check, Calculator, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

interface PortionInputTableProps {
  vendors: VendorPortionRow[];
  onUpdateVendor: (id: string, field: 'td8' | 'td11_1' | 'td11_3', value: number) => void;
  selectedVendorIds: string[];
  onToggleVendor: (id: string) => void;
  onSelectAll?: () => void;
}

export const PortionInputTable: React.FC<PortionInputTableProps> = ({
  vendors,
  onUpdateVendor,
  selectedVendorIds,
  onToggleVendor,
  onSelectAll
}) => {
  const [batchField, setBatchField] = useState<'td8' | 'td11_1' | 'td11_3' | 'all'>('td8');

  // Calculate totals
  const grandTotal = vendors.reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);
  const totalTd8 = vendors.reduce((sum, v) => sum + v.td8, 0);
  const totalTd11_1 = vendors.reduce((sum, v) => sum + v.td11_1, 0);
  const totalTd11_3 = vendors.reduce((sum, v) => sum + v.td11_3, 0);

  // Selected vendors total
  const selectedTotal = vendors
    .filter((v) => selectedVendorIds.includes(v.id))
    .reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);

  // Quick adjust helper (+ / -)
  const handleQuickAdjust = (id: string, field: 'td8' | 'td11_1' | 'td11_3', delta: number) => {
    const vendor = vendors.find((v) => v.id === id);
    if (!vendor) return;
    const currentVal = vendor[field] || 0;
    const nextVal = Math.max(0, currentVal + delta);
    onUpdateVendor(id, field, nextVal);
  };

  // Batch fill to selected vendors
  const handleBatchFill = (amount: number) => {
    vendors.forEach((v) => {
      if (selectedVendorIds.includes(v.id)) {
        if (batchField === 'all') {
          onUpdateVendor(v.id, 'td8', amount);
          onUpdateVendor(v.id, 'td11_1', amount);
          onUpdateVendor(v.id, 'td11_3', amount);
        } else {
          onUpdateVendor(v.id, batchField, amount);
        }
      }
    });
  };

  // Quick clear selected
  const handleClearSelected = () => {
    vendors.forEach((v) => {
      if (selectedVendorIds.includes(v.id)) {
        onUpdateVendor(v.id, 'td8', 0);
        onUpdateVendor(v.id, 'td11_1', 0);
        onUpdateVendor(v.id, 'td11_3', 0);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-5 sm:p-6 space-y-4">
      {/* Top Title & Header note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h3 className="text-base font-bold text-neutral-900">
              Bảng Nhập &amp; Phân Bổ Số Lượng Suất Ăn
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Nhập số lượng thực tế theo từng nhà cung cấp; hệ thống tự động cộng dồn và điền vào báo cáo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-bold text-teal-950 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
            Đang chọn: <strong className="text-teal-700">{selectedVendorIds.length}/{vendors.length} NCC</strong> ({selectedTotal.toLocaleString('vi-VN')} suất)
          </div>
        </div>
      </div>

      {/* Quick Batch Controls Toolbar */}
      <div className="p-3 rounded-xl bg-neutral-50/90 border border-neutral-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-neutral-700 flex items-center gap-1">
            <Calculator className="w-3.5 h-3.5 text-teal-600" />
            <span>Điền nhanh cho {selectedVendorIds.length} NCC đang chọn:</span>
          </span>
          <select
            value={batchField}
            onChange={(e) => setBatchField(e.target.value as any)}
            className="px-2 py-1 rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-800 focus:outline-none"
          >
            <option value="td8">Cột TĐ 8</option>
            <option value="td11_1">Cột TĐ 11.1</option>
            <option value="td11_3">Cột TĐ 11.3</option>
            <option value="all">Tất cả cột</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          {[50, 100, 150, 200].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleBatchFill(num)}
              className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:bg-teal-50 hover:border-teal-300 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
            >
              ={num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClearSelected}
            className="px-2.5 py-1 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-700 font-bold text-xs transition-colors cursor-pointer ml-1"
            title="Đặt số suất của các NCC đang chọn về 0"
          >
            Đặt 0
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[550px]">
          <thead>
            <tr className="bg-neutral-50/90 text-neutral-700 font-bold border-b border-neutral-200 text-xs uppercase tracking-wider">
              <th className="py-3 px-3.5 w-12 text-center">
                {onSelectAll && (
                  <button
                    type="button"
                    onClick={onSelectAll}
                    className="cursor-pointer p-0.5 text-teal-700 hover:text-teal-900"
                    title="Chọn tất cả NCC"
                  >
                    {selectedVendorIds.length === vendors.length ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                )}
              </th>
              <th className="py-3 px-3">Nhà Cung Cấp</th>
              <th className="py-3 px-3 text-center w-36">TĐ 8</th>
              <th className="py-3 px-3 text-center w-36">TĐ 11.1</th>
              <th className="py-3 px-3 text-center w-36">TĐ 11.3</th>
              <th className="py-3 px-4 text-right w-32">Tổng NCC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {vendors.map((vendor) => {
              const rowTotal = vendor.td8 + vendor.td11_1 + vendor.td11_3;
              const isSelected = selectedVendorIds.includes(vendor.id);

              return (
                <tr
                  key={vendor.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-teal-50/40 hover:bg-teal-50/70' : 'hover:bg-neutral-50/60'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="py-2.5 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVendor(vendor.id)}
                      className="cursor-pointer p-1 text-teal-700 hover:text-teal-900"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-teal-700" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-300 hover:text-neutral-500" />
                      )}
                    </button>
                  </td>

                  {/* Vendor Name */}
                  <td 
                    onClick={() => onToggleVendor(vendor.id)}
                    className="py-2.5 px-3 font-semibold text-neutral-900 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-teal-100 text-teal-800' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {vendor.code}
                      </span>
                      <span className={isSelected ? 'text-teal-950 font-bold' : 'text-neutral-800'}>
                        {vendor.name}
                      </span>
                    </div>
                  </td>

                  {/* TĐ 8 Input with quick +/- */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td8', -10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Giảm 10 suất"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={vendor.td8 || ''}
                        placeholder="0"
                        onChange={(e) =>
                          onUpdateVendor(vendor.id, 'td8', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-16 py-1.5 px-1 rounded-lg border border-neutral-300 bg-white text-center font-mono font-bold text-neutral-900 text-xs sm:text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td8', 10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tăng 10 suất"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* TĐ 11.1 Input with quick +/- */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td11_1', -10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Giảm 10 suất"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={vendor.td11_1 || ''}
                        placeholder="0"
                        onChange={(e) =>
                          onUpdateVendor(vendor.id, 'td11_1', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-16 py-1.5 px-1 rounded-lg border border-neutral-300 bg-white text-center font-mono font-bold text-neutral-900 text-xs sm:text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td11_1', 10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tăng 10 suất"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* TĐ 11.3 Input with quick +/- */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td11_3', -10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Giảm 10 suất"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={vendor.td11_3 || ''}
                        placeholder="0"
                        onChange={(e) =>
                          onUpdateVendor(vendor.id, 'td11_3', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-16 py-1.5 px-1 rounded-lg border border-neutral-300 bg-white text-center font-mono font-bold text-neutral-900 text-xs sm:text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickAdjust(vendor.id, 'td11_3', 10)}
                        className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tăng 10 suất"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  {/* Row Total */}
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {rowTotal > 0 ? (
                      <span className="text-teal-900 font-extrabold">{rowTotal.toLocaleString('vi-VN')}</span>
                    ) : (
                      <span className="text-neutral-300">0</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Column Sums Row */}
            <tr className="bg-neutral-50/90 font-bold border-t border-neutral-200 text-xs">
              <td colSpan={2} className="py-2.5 px-3.5 text-neutral-700">
                Tổng cộng theo cột:
              </td>
              <td className="py-2.5 px-3 text-center font-mono text-neutral-900">
                {totalTd8.toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-3 text-center font-mono text-neutral-900">
                {totalTd11_1.toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-3 text-center font-mono text-neutral-900">
                {totalTd11_3.toLocaleString('vi-VN')}
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-extrabold text-teal-900">
                {grandTotal.toLocaleString('vi-VN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Big Summary Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0b1e33] to-[#143a63] text-white p-4 sm:p-5 flex items-center justify-between shadow-sm">
        <div>
          <span className="text-xs text-neutral-300 uppercase tracking-wider font-semibold block">
            Tổng cộng toàn bộ nhà cung cấp
          </span>
          <span className="text-xs text-teal-300 font-medium">
            {selectedVendorIds.length === vendors.length
              ? 'Đang tính cho toàn bộ 7 nhà cung cấp'
              : `${selectedVendorIds.length} NCC đang chọn (${selectedTotal.toLocaleString('vi-VN')} suất)`}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-black font-mono tabular-nums text-white">
            {grandTotal.toLocaleString('vi-VN')} <span className="text-sm font-normal text-neutral-300">suất</span>
          </span>
        </div>
      </div>
    </div>
  );
};
