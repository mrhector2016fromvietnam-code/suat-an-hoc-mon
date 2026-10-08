import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, FileSpreadsheet, Eye, X, 
  Building2, Layers, Check, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { MenuRecord } from './ExtractionPreviewModal';
import { formatWeekIsoToDisplay } from '../utils/excelMenuParser';

export interface BatchFileItem {
  id: string;
  file: File;
  fileName: string;
  vendorId: string;
  vendorName: string;
  weeksFound: string[];
  records: MenuRecord[];
  cellCount: number;
  dishCount: number;
  warnings: string[];
  status: 'ready' | 'wrong_week' | 'unreadable';
  statusReason?: string;
  selectedForSync: boolean;
  res: any;
}

const ALL_VENDORS = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP' },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD' },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML' },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS' },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN' },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH' },
  { id: 'vina-story', name: 'Vina Story', code: 'VS' },
];

interface MultiFilePreviewModalProps {
  isOpen: boolean;
  batchItems: BatchFileItem[];
  currentWeekStart: string;
  onUpdateBatchItemVendor: (itemId: string, newVendorId: string, newVendorName: string) => void;
  onToggleSelectItem: (itemId: string) => void;
  onInspectFileDetails: (item: BatchFileItem) => void;
  onConfirmSyncBatch: (selectedItems: BatchFileItem[]) => void;
  onClose: () => void;
}

export const MultiFilePreviewModal: React.FC<MultiFilePreviewModalProps> = ({
  isOpen,
  batchItems,
  currentWeekStart,
  onUpdateBatchItemVendor,
  onToggleSelectItem,
  onInspectFileDetails,
  onConfirmSyncBatch,
  onClose,
}) => {
  if (!isOpen) return null;

  const selectedCount = batchItems.filter((i) => i.selectedForSync && i.status === 'ready').length;
  const totalDishes = batchItems
    .filter((i) => i.selectedForSync && i.status === 'ready')
    .reduce((sum, i) => sum + i.dishCount, 0);

  // Check for duplicate vendors among selected ready items
  const selectedReadyVendorIds = batchItems
    .filter((i) => i.selectedForSync && i.status === 'ready')
    .map((i) => i.vendorId);
  const vendorCounts: Record<string, number> = {};
  selectedReadyVendorIds.forEach((vId) => {
    vendorCounts[vId] = (vendorCounts[vId] || 0) + 1;
  });
  const duplicateVendorIds = Object.keys(vendorCounts).filter((vId) => vendorCounts[vId] > 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-snug">Xem Trước &amp; Đồng Bộ Nhiều Tệp Thực Đơn</h2>
              <p className="text-xs text-teal-200/80">
                Đã quét {batchItems.length} tệp · {selectedCount} tệp sẵn sàng ({totalDishes} món)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Duplicate Vendor Warning */}
          {duplicateVendorIds.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">⚠️ Mâu thuẫn Nhà Cung Cấp trong cùng đợt tải:</strong>
                <p className="mt-0.5 text-amber-900">
                  Phát hiện nhiều tệp cùng gán cho nhà cung cấp:{' '}
                  <strong>
                    {duplicateVendorIds
                      .map((id) => ALL_VENDORS.find((v) => v.id === id)?.name || id)
                      .join(', ')}
                  </strong>
                  . Tệp chọn phía dưới sẽ ghi đè tệp trước đó.
                </p>
              </div>
            </div>
          )}

          {/* Files Summary Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">Chọn</th>
                  <th className="py-3 px-3">Tên tệp menu</th>
                  <th className="py-3 px-3">Nhà Cung Cấp nhận diện</th>
                  <th className="py-3 px-3">Tuần trong file</th>
                  <th className="py-3 px-3 text-center">Số ô</th>
                  <th className="py-3 px-3 text-center">Số món</th>
                  <th className="py-3 px-3 text-center">Trạng thái</th>
                  <th className="py-3 px-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {batchItems.map((item) => {
                  const isReady = item.status === 'ready';
                  const isWrongWeek = item.status === 'wrong_week';
                  const isUnreadable = item.status === 'unreadable';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !item.selectedForSync ? 'opacity-60 bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.selectedForSync}
                          disabled={isUnreadable}
                          onChange={() => onToggleSelectItem(item.id)}
                          className="rounded border-slate-300 text-teal-700 focus:ring-teal-500 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* File Name */}
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-teal-700 shrink-0" />
                          <span title={item.fileName}>{item.fileName}</span>
                        </div>
                      </td>

                      {/* Vendor Selector */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <select
                            value={item.vendorId}
                            onChange={(e) => {
                              const vId = e.target.value;
                              const vObj = ALL_VENDORS.find((v) => v.id === vId);
                              onUpdateBatchItemVendor(item.id, vId, vObj?.name || vId);
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 cursor-pointer"
                          >
                            {ALL_VENDORS.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.name} ({v.code})
                              </option>
                            ))}
                            {item.vendorId === 'unknown' && (
                              <option value="unknown">Chưa nhận diện được</option>
                            )}
                          </select>
                        </div>
                      </td>

                      {/* Week Display */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {item.weeksFound && item.weeksFound.length > 0
                          ? item.weeksFound.map((w) => formatWeekIsoToDisplay(w)).join(', ')
                          : '05/10 – 11/10/2026'}
                      </td>

                      {/* Cells */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {item.cellCount}
                      </td>

                      {/* Dishes */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-teal-800">
                        {item.dishCount}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {isReady && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Sẵn sàng
                          </span>
                        )}
                        {isWrongWeek && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200"
                            title={item.statusReason}
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Tuần khác
                          </span>
                        )}
                        {isUnreadable && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200"
                            title={item.statusReason}
                          >
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Không đọc được
                          </span>
                        )}
                        {item.statusReason && (
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                            {item.statusReason}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          disabled={isUnreadable || item.records.length === 0}
                          onClick={() => onInspectFileDetails(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Xem lưới</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
          >
            Đóng / Hủy
          </button>

          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => {
              const itemsToSync = batchItems.filter((i) => i.selectedForSync && i.status === 'ready');
              onConfirmSyncBatch(itemsToSync);
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác nhận đồng bộ {selectedCount} tệp thực đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
