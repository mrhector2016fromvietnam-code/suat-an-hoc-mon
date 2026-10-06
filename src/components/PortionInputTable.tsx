import React from 'react';
import { VendorPortionRow } from '../types/report';
import { CheckSquare, Square, Check } from 'lucide-react';

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
  // Calculate Grand Total across all vendors
  const grandTotal = vendors.reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);

  // Selected vendors total
  const selectedTotal = vendors
    .filter((v) => selectedVendorIds.includes(v.id))
    .reduce((sum, v) => sum + v.td8 + v.td11_1 + v.td11_3, 0);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Table Header Note */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-xs text-neutral-600 font-medium">
          Nhập số thực tế theo từng nhà cung cấp; tích chọn để cùng đưa vào báo cáo tổng hợp.
        </div>
        <div className="text-xs text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
          Đang chọn: {selectedVendorIds.length}/{vendors.length} NCC ({selectedTotal.toLocaleString('vi-VN')} suất)
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[500px]">
          <thead>
            <tr className="text-neutral-600 font-semibold border-b border-neutral-200/90 text-xs">
              <th className="py-2.5 px-3 w-10 text-center">Chọn</th>
              <th className="py-2.5 px-3 w-44">Nhà cung cấp</th>
              <th className="py-2.5 px-3 text-center w-28">TĐ 8</th>
              <th className="py-2.5 px-3 text-center w-28">TĐ 11.1</th>
              <th className="py-2.5 px-3 text-center w-28">TĐ 11.3</th>
              <th className="py-2.5 px-3 text-right w-28">Tổng NCC</th>
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
                    isSelected ? 'bg-teal-50/50' : 'hover:bg-neutral-50/70'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVendor(vendor.id)}
                      className="cursor-pointer p-1 text-teal-700 hover:text-teal-900"
                      title={isSelected ? 'Bỏ chọn khỏi báo cáo' : 'Chọn đưa vào báo cáo'}
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
                    className="py-2.5 px-3 font-medium text-neutral-900 cursor-pointer select-none"
                  >
                    <span className={isSelected ? 'text-[#0f766e] font-bold' : ''}>
                      {vendor.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono ml-1.5 font-normal">
                      ({vendor.code})
                    </span>
                  </td>

                  {/* TĐ 8 Input */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      value={vendor.td8 || ''}
                      placeholder="0"
                      onChange={(e) =>
                        onUpdateVendor(vendor.id, 'td8', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full py-1.5 px-2 rounded-xl border border-neutral-200 bg-neutral-50/40 text-center font-mono font-medium text-neutral-800 text-xs sm:text-sm focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </td>

                  {/* TĐ 11.1 Input */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      value={vendor.td11_1 || ''}
                      placeholder="0"
                      onChange={(e) =>
                        onUpdateVendor(vendor.id, 'td11_1', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full py-1.5 px-2 rounded-xl border border-neutral-200 bg-neutral-50/40 text-center font-mono font-medium text-neutral-800 text-xs sm:text-sm focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </td>

                  {/* TĐ 11.3 Input */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      min="0"
                      value={vendor.td11_3 || ''}
                      placeholder="0"
                      onChange={(e) =>
                        onUpdateVendor(vendor.id, 'td11_3', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-full py-1.5 px-2 rounded-xl border border-neutral-200 bg-neutral-50/40 text-center font-mono font-medium text-neutral-800 text-xs sm:text-sm focus:bg-white focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </td>

                  {/* Row Total */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {rowTotal > 0 ? rowTotal.toLocaleString('vi-VN') : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Big Dark Blue Summary Bar */}
      <div className="rounded-2xl bg-[#0f2d4a] text-white p-4 sm:p-5 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-sm font-semibold text-neutral-200 block">
            Tổng cộng toàn bộ nhà cung cấp
          </span>
          <span className="text-[11px] text-teal-300">
            {selectedVendorIds.length === vendors.length
              ? 'Tất cả 7 nhà cung cấp đang được tính'
              : `${selectedVendorIds.length} NCC được chọn (${selectedTotal.toLocaleString('vi-VN')} suất)`}
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
          {grandTotal.toLocaleString('vi-VN')} suất
        </span>
      </div>
    </div>
  );
};
