import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, FileSpreadsheet, Eye, Sparkles, 
  Layers, ArrowRight, ShieldCheck, CheckSquare, Square, RefreshCw, AlertTriangle
} from 'lucide-react';
import { DayShiftMenu } from '../types/report';
import { MenuRecord } from './ExtractionPreviewModal';
import { VENDOR_CODE_TO_ID, formatWeekIsoToDisplay } from '../utils/excelMenuParser';

export interface BatchParsedFileItem {
  id: string;
  file: File;
  fileName: string;
  fileExt: string;
  fileSizeKb: number;
  detectedVendorCode: string;
  detectedVendorName: string;
  detectedVendorId: string;
  weeksFound: string[];
  records: MenuRecord[];
  dishesCount: number;
  warnings: string[];
  skippedSheetsCount: number;
  status: 'ready' | 'different_week' | 'unknown_vendor' | 'error';
  statusReason?: string;
  isDuplicateVendor?: boolean;
  duplicateConflictWith?: string;
  selectedForSync: boolean;
  overwriteDuplicate?: boolean;
}

interface BatchUploadSummaryModalProps {
  isOpen: boolean;
  batchItems: BatchParsedFileItem[];
  onClose: () => void;
  onConfirmBatchSync: (selectedItems: BatchParsedFileItem[]) => void;
  onViewSingleDetail: (item: BatchParsedFileItem) => void;
  onUpdateVendorForItem: (itemId: string, vendorId: string, vendorName: string, vendorCode: string) => void;
}

const ALL_STANDARD_VENDORS = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP' },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD' },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML' },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS' },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN' },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH' },
  { id: 'vina-story', name: 'Vina Story', code: 'VS' },
];

export const BatchUploadSummaryModal: React.FC<BatchUploadSummaryModalProps> = ({
  isOpen,
  batchItems: initialBatchItems,
  onClose,
  onConfirmBatchSync,
  onViewSingleDetail,
  onUpdateVendorForItem,
}) => {
  const [items, setItems] = useState<BatchParsedFileItem[]>(initialBatchItems);

  // Sync state when props change
  React.useEffect(() => {
    setItems(initialBatchItems);
  }, [initialBatchItems]);

  if (!isOpen) return null;

  const toggleSelectItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selectedForSync: !it.selectedForSync } : it))
    );
  };

  const toggleSelectAll = () => {
    const allReadySelected = items.filter((it) => it.status === 'ready').every((it) => it.selectedForSync);
    setItems((prev) =>
      prev.map((it) =>
        it.status === 'ready' ? { ...it, selectedForSync: !allReadySelected } : it
      )
    );
  };

  const handleVendorChange = (itemId: string, vendorId: string) => {
    const vObj = ALL_STANDARD_VENDORS.find((v) => v.id === vendorId);
    if (!vObj) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const newStatus = it.records.length > 0 && (!it.weeksFound.length || it.weeksFound.includes('2026-10-05')) ? 'ready' : it.status;
          return {
            ...it,
            detectedVendorId: vObj.id,
            detectedVendorName: vObj.name,
            detectedVendorCode: vObj.code,
            status: newStatus,
            selectedForSync: newStatus === 'ready',
          };
        }
        return it;
      })
    );
    if (onUpdateVendorForItem) {
      onUpdateVendorForItem(itemId, vObj.id, vObj.name, vObj.code);
    }
  };

  const selectedCount = items.filter((it) => it.selectedForSync && it.status === 'ready').length;
  const totalDishes = items
    .filter((it) => it.selectedForSync && it.status === 'ready')
    .reduce((sum, it) => sum + it.dishesCount, 0);
  const totalRecords = items
    .filter((it) => it.selectedForSync && it.status === 'ready')
    .reduce((sum, it) => sum + it.records.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0f2d4a] text-white flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>XÁC NHẬN ĐỒNG BỘ THỰC ĐƠN ĐA TỆP (NHIỀU FILE)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-mono text-xs">
                  {items.length} tệp
                </span>
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Hệ thống tự động nhận diện Nhà Cung Cấp &amp; bóc tách ma trận 7 ngày × 3 ca ăn cho từng file riêng biệt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Banner */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
              ✓ {selectedCount}/{items.length} tệp sẵn sàng
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-950 border border-teal-300 font-bold font-mono">
              ✓ {totalRecords} ca ăn
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-950 border border-indigo-300 font-bold font-mono">
              ✓ {totalDishes} món ăn
            </span>
          </div>

          <div className="text-neutral-500 text-[11px] italic">
            * Mỗi file sẽ được tự động đồng bộ đúng vào thẻ Nhà Cung Cấp tương ứng, không phụ thuộc vào thẻ đang mở.
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 text-neutral-800 font-bold border-b border-neutral-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-neutral-600 hover:text-teal-700 cursor-pointer"
                      title="Chọn tất cả tệp sẵn sàng"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="py-3 px-3">Tên Tệp</th>
                  <th className="py-3 px-3">NCC Nhận Dạng</th>
                  <th className="py-3 px-3">Tuần Trong File</th>
                  <th className="py-3 px-3 text-center">Số Ô (Ca)</th>
                  <th className="py-3 px-3 text-center">Số Món</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3 text-center w-28">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {items.map((it) => {
                  const isReady = it.status === 'ready';
                  const isDiffWeek = it.status === 'different_week';
                  const isUnknownVendor = it.status === 'unknown_vendor';
                  const isErr = it.status === 'error';

                  return (
                    <tr
                      key={it.id}
                      className={`hover:bg-neutral-50/80 transition-colors ${
                        !it.selectedForSync ? 'opacity-60 bg-neutral-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={it.selectedForSync}
                          disabled={!isReady && !isUnknownVendor}
                          onChange={() => toggleSelectItem(it.id)}
                          className="w-4 h-4 text-teal-700 rounded border-neutral-300 focus:ring-teal-500 cursor-pointer disabled:opacity-30"
                        />
                      </td>

                      {/* File Name */}
                      <td className="py-3 px-3 align-middle font-semibold text-neutral-900">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-teal-700 shrink-0" />
                          <div>
                            <div className="font-bold text-neutral-900 truncate max-w-xs" title={it.fileName}>
                              {it.fileName}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              {it.fileExt.toUpperCase()} · {(it.fileSizeKb).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Detected Vendor */}
                      <td className="py-3 px-3 align-middle">
                        {isUnknownVendor ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px] block w-max">
                              ⚠️ Chưa nhận ra NCC
                            </span>
                            <select
                              value={it.detectedVendorId || 'tam-phuong'}
                              onChange={(e) => handleVendorChange(it.id, e.target.value)}
                              className="px-2 py-1 rounded border border-rose-300 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                            >
                              <option value="">-- Chọn NCC cho tệp này --</option>
                              {ALL_STANDARD_VENDORS.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name} ({v.code})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-teal-800 text-white font-mono font-bold text-xs">
                              {it.detectedVendorCode}
                            </span>
                            <span className="font-bold text-neutral-900 text-xs">
                              {it.detectedVendorName}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Week in File */}
                      <td className="py-3 px-3 align-middle font-mono text-xs">
                        {it.weeksFound && it.weeksFound.length > 0 ? (
                          <div className="space-y-0.5">
                            {it.weeksFound.map((wIso) => {
                              const disp = formatWeekIsoToDisplay(wIso);
                              const isMatch = wIso === '2026-10-05';
                              return (
                                <span
                                  key={wIso}
                                  className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                                    isMatch
                                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                                  }`}
                                >
                                  {disp}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Không tìm thấy</span>
                        )}
                      </td>

                      {/* Shifts Count */}
                      <td className="py-3 px-3 align-middle text-center font-mono font-bold text-neutral-800">
                        {it.records.length > 0 ? `${it.records.length} ô` : '0'}
                      </td>

                      {/* Dishes Count */}
                      <td className="py-3 px-3 align-middle text-center font-mono font-bold text-teal-900">
                        {it.dishesCount > 0 ? `${it.dishesCount} món` : '0'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 align-middle">
                        {isReady && (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px]">
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>Sẵn sàng</span>
                            </span>
                            {it.isDuplicateVendor && (
                              <div className="text-[10px] text-amber-800 font-bold mt-0.5">
                                ⚠️ Cùng NCC với tệp khác ({it.duplicateConflictWith || 'Ghi đè'})
                              </div>
                            )}
                          </div>
                        )}

                        {isDiffWeek && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[11px]">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>Tuần khác (Không ghi vào 05/10)</span>
                            </span>
                            <div className="text-[10px] text-amber-900 leading-tight">
                              Tệp chứa thực đơn tuần {it.weeksFound.map(w => formatWeekIsoToDisplay(w)).join(', ')}. Không đồng bộ vào tuần đang xem 05/10–11/10/2026.
                            </div>
                          </div>
                        )}

                        {isErr && (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300 font-bold text-[11px]">
                              <AlertCircle className="w-3 h-3 text-rose-700" />
                              <span>Không đọc được</span>
                            </span>
                            <div className="text-[10px] text-rose-800 leading-tight max-w-xs">
                              {it.statusReason || it.warnings.join('; ')}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 align-middle text-center">
                        {it.records.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onViewSingleDetail(it)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-[11px] flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem chi tiết</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-700 font-bold">
            Đã chọn <strong className="text-teal-900">{selectedCount}</strong> tệp hợp lệ để đồng bộ vào toàn bộ hệ thống
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs cursor-pointer transition-colors"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => onConfirmBatchSync(items.filter((it) => it.selectedForSync && it.status === 'ready'))}
              className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Xác nhận đồng bộ tất cả ({selectedCount} tệp)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
