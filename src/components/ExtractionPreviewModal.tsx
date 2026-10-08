import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, X, AlertTriangle, Sparkles, Building2, 
  Plus, Trash2, Edit3, Layers, FileText, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { formatPortions, parseQuantity, toGrid } from '../lib/parseMenuExcel.js';
import { VENDOR_REGISTRY } from '../utils/matchSupplier';

export interface MenuRecordItem {
  category: string;
  name: string;
  note: string;
  portions: Array<{
    label: string;
    min: number | null;
    max: number | null;
    unit: string | null;
  }>;
  rawName: string;
  rawWeight: string;
  unparsed?: boolean;
}

export interface MenuRecord {
  weekStart: string;
  date: string;
  weekday: string;
  weekdayIndex: number;
  shift: 'sang' | 'trua' | 'toi';
  menuType: 'man' | 'chay';
  sheet: string;
  items: MenuRecordItem[];
  key?: string;
}

interface ExtractionPreviewModalProps {
  isOpen: boolean;
  records: MenuRecord[];
  stats: { records: number; dishes: number };
  warnings?: string[];
  vendorId: string;
  vendorName: string;
  rawTextSummary?: string;
  onConfirmSync: (finalRecords: MenuRecord[], mode: 'overwrite' | 'merge') => void;
  onClose: () => void;
}

export const ExtractionPreviewModal: React.FC<ExtractionPreviewModalProps> = ({
  isOpen,
  records,
  stats,
  warnings = [],
  vendorId,
  vendorName,
  rawTextSummary = '',
  onConfirmSync,
  onClose,
}) => {
  const [syncMode, setSyncMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [editableRecords, setEditableRecords] = useState<MenuRecord[]>(records);
  const [activeTab, setActiveTab] = useState<'grid' | 'raw'>('grid');
  const [showWarningsList, setShowWarningsList] = useState(true);

  // Sync internal state when props change
  useEffect(() => {
    setEditableRecords(records || []);
  }, [records]);

  const vendorObj = VENDOR_REGISTRY.find((v) => v.id === vendorId || v.code === vendorId) || { name: vendorName, code: 'NCC' };

  // Step 5: Group records into grid strictly by date + shift + menuType
  const { grid, validDates, invalidRecords } = useMemo(() => {
    const valid: MenuRecord[] = [];
    const invalid: MenuRecord[] = [];

    (editableRecords || []).forEach((r) => {
      if (r.date && r.shift && ['sang', 'trua', 'toi'].includes(r.shift)) {
        valid.push(r);
      } else {
        invalid.push(r);
      }
    });

    const g: Record<string, Record<string, { man: MenuRecordItem[]; chay: MenuRecordItem[]; trangMieng: MenuRecordItem[] }>> = toGrid(valid);
    const dates = Object.keys(g).sort();
    return { grid: g, validDates: dates, invalidRecords: invalid };
  }, [editableRecords]);

  const dishCategoryBreakdown = useMemo(() => {
    const counts = { sang: 0, main: 0, canh: 0, com: 0, trang_mieng: 0 };
    (editableRecords || []).forEach((r) => {
      (r.items || []).forEach((i) => {
        if (i.category === 'sang') counts.sang++;
        else if (i.category === 'canh') counts.canh++;
        else if (i.category === 'com') counts.com++;
        else if (i.category === 'trang_mieng') counts.trang_mieng++;
        else counts.main++;
      });
    });
    return counts;
  }, [editableRecords]);

  if (!isOpen) return null;

  // Handlers for editing items
  const handleUpdateDishName = (
    date: string,
    shift: 'sang' | 'trua' | 'toi',
    menuType: 'man' | 'chay',
    itemIdx: number,
    newName: string
  ) => {
    setEditableRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as MenuRecord[];
      const targetRecord = next.find(
        (r) => r.date === date && r.shift === shift && r.menuType === menuType
      );
      if (targetRecord && targetRecord.items[itemIdx]) {
        targetRecord.items[itemIdx].name = newName;
        targetRecord.items[itemIdx].rawName = newName;
      }
      return next;
    });
  };

  const handleUpdateDishWeightText = (
    date: string,
    shift: 'sang' | 'trua' | 'toi',
    menuType: 'man' | 'chay',
    itemIdx: number,
    newWeightText: string
  ) => {
    setEditableRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as MenuRecord[];
      const targetRecord = next.find(
        (r) => r.date === date && r.shift === shift && r.menuType === menuType
      );
      if (targetRecord && targetRecord.items[itemIdx]) {
        const item = targetRecord.items[itemIdx];
        item.rawWeight = newWeightText;
        const q = parseQuantity(newWeightText);
        item.portions = q.portions;
        if (q.note) item.note = q.note;
        item.unparsed = !q.parsed && Boolean(newWeightText.trim());
      }
      return next;
    });
  };

  const handleAddDish = (
    date: string,
    shift: 'sang' | 'trua' | 'toi',
    menuType: 'man' | 'chay'
  ) => {
    setEditableRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as MenuRecord[];
      let targetRecord = next.find(
        (r) => r.date === date && r.shift === shift && r.menuType === menuType
      );
      if (!targetRecord) {
        targetRecord = {
          weekStart: '2026-10-05',
          date,
          weekday: 'Thứ',
          weekdayIndex: 0,
          shift,
          menuType,
          sheet: 'Thực đơn',
          items: [],
        };
        next.push(targetRecord);
      }
      targetRecord.items.push({
        category: shift === 'sang' ? 'sang' : 'main',
        name: 'Món ăn mới',
        note: '',
        portions: [{ label: 'Khẩu phần', min: 100, max: 100, unit: 'g' }],
        rawName: 'Món ăn mới',
        rawWeight: '100g',
      });
      return next;
    });
  };

  const handleDeleteDish = (
    date: string,
    shift: 'sang' | 'trua' | 'toi',
    menuType: 'man' | 'chay',
    itemIdx: number
  ) => {
    setEditableRecords((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as MenuRecord[];
      const targetRecord = next.find(
        (r) => r.date === date && r.shift === shift && r.menuType === menuType
      );
      if (targetRecord && targetRecord.items[itemIdx]) {
        targetRecord.items.splice(itemIdx, 1);
      }
      return next;
    });
  };

  const weekdayDisplayNames: Record<string, string> = {
    '2026-10-05': 'Thứ 2 (05/10/2026)',
    '2026-10-06': 'Thứ 3 (06/10/2026)',
    '2026-10-07': 'Thứ 4 (07/10/2026)',
    '2026-10-08': 'Thứ 5 (08/10/2026)',
    '2026-10-09': 'Thứ 6 (09/10/2026)',
    '2026-10-10': 'Thứ 7 (10/10/2026)',
    '2026-10-11': 'Chủ nhật (11/10/2026)',
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0f2d4a] text-white flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>XEM TRƯỚC & XÁC NHẬN ĐỒNG BỘ THỰC ĐƠN</span>
                <span className="px-2 py-0.5 rounded bg-teal-600 text-white font-mono text-xs">
                  {vendorObj.name} ({vendorObj.code})
                </span>
              </h3>
              <p className="text-xs text-neutral-300 mt-0.5">
                Được bóc tách từ parser xác định (parseMenuWorkbook) · Lưới chuẩn 7 ngày × 3 ca ăn
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

        {/* Step 3: Status Strip directly from res.stats */}
        <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 font-semibold text-neutral-700">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold">
              ✓ {validDates.length} Ngày
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-950 border border-teal-300 font-bold font-mono">
              ✓ {stats?.records ?? editableRecords.length} bản ghi
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-950 border border-indigo-300 font-bold font-mono">
              ✓ {stats?.dishes ?? editableRecords.reduce((acc, r) => acc + (r.items?.length || 0), 0)} món ({dishCategoryBreakdown.sang} sáng, {dishCategoryBreakdown.main} mặn/rau, {dishCategoryBreakdown.canh} canh, {dishCategoryBreakdown.com} cơm, {dishCategoryBreakdown.trang_mieng} tráng miệng)
            </span>
            {warnings.length > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                ⚠️ {warnings.length} Cảnh báo chất lượng
              </span>
            )}
          </div>

          {/* Sync Mode Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700 text-[11px]">Chế độ đồng bộ:</span>
            <div className="inline-flex rounded-lg bg-neutral-200 p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setSyncMode('overwrite')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  syncMode === 'overwrite'
                    ? 'bg-teal-900 text-white shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                Ghi đè tuần này
              </button>
              <button
                type="button"
                onClick={() => setSyncMode('merge')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  syncMode === 'merge'
                    ? 'bg-teal-900 text-white shadow-2xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                Gộp (chỉ điền ô trống)
              </button>
            </div>
          </div>
        </div>

        {/* Warnings Collapsible Strip */}
        {(warnings.length > 0 || invalidRecords.length > 0) && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs">
            <button
              type="button"
              onClick={() => setShowWarningsList(!showWarningsList)}
              className="w-full flex items-center justify-between text-amber-900 font-bold cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Cảnh báo bóc tách ({warnings.length + invalidRecords.length} mục):</span>
              </span>
              {showWarningsList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showWarningsList && (
              <div className="mt-1 max-h-24 overflow-y-auto space-y-0.5 text-[11px] text-amber-950">
                {warnings.map((w, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-amber-600">•</span>
                    <span>{w}</span>
                  </div>
                ))}
                {invalidRecords.map((inv, idx) => (
                  <div key={`inv-${idx}`} className="text-rose-700 font-medium">
                    • Bản ghi thiếu ngày hoặc ca ăn hợp lệ (Sheet: {inv.sheet})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Grid Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {validDates.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
              <div className="font-bold text-neutral-700">Chưa tìm thấy ca ăn hợp lệ trong tệp.</div>
              <p className="text-xs">Vui lòng kiểm tra lại cấu trúc hàng ngày/ca ăn của file Excel.</p>
            </div>
          ) : (
            validDates.map((dateStr) => {
              const dayGrid = grid[dateStr] || { sang: {}, trua: {}, toi: {} };
              const displayTitle = weekdayDisplayNames[dateStr] || dateStr;

              return (
                <div key={dateStr} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="font-black text-neutral-900 text-sm flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                      <span>{displayTitle}</span>
                      <span className="text-neutral-400 font-mono text-xs font-normal">({dateStr})</span>
                    </span>
                  </div>

                  {/* 3 Shifts: Sáng, Trưa, Tối */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {(['sang', 'trua', 'toi'] as const).map((shiftKey) => {
                      const shiftCell = dayGrid[shiftKey] || { man: [], chay: [], trangMieng: [] };
                      const shiftTitle = shiftKey === 'sang' ? 'Bữa Sáng (20K)' : shiftKey === 'trua' ? 'Bữa Trưa (40K)' : 'Bữa Tối (40K)';

                      return (
                        <div
                          key={shiftKey}
                          className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs space-y-2.5"
                        >
                          <div className="flex items-center justify-between font-bold text-neutral-800 text-[11px] border-b border-neutral-200/80 pb-1">
                            <span className="text-teal-950 font-bold">{shiftTitle}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAddDish(dateStr, shiftKey, 'man')}
                                className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-[10px] font-semibold cursor-pointer"
                                title="Thêm món mặn"
                              >
                                + Mặn
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddDish(dateStr, shiftKey, 'chay')}
                                className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 text-[10px] font-semibold cursor-pointer"
                                title="Thêm món chay"
                              >
                                + Chay
                              </button>
                            </div>
                          </div>

                          {/* SUẤT ĂN MẶN */}
                          <div className="space-y-1">
                            <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
                              Món mặn ({shiftCell.man.length} món):
                            </div>
                            {shiftCell.man.length === 0 ? (
                              <div className="text-[11px] text-neutral-400 italic">Trống (Chưa có món mặn)</div>
                            ) : (
                              shiftCell.man.map((item: MenuRecordItem, itemIdx: number) => {
                                const portionsText = formatPortions(item) || item.rawWeight || '';

                                return (
                                  <div
                                    key={itemIdx}
                                    className="p-2 rounded-lg border bg-white border-neutral-200 space-y-1 shadow-3xs"
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) =>
                                          handleUpdateDishName(dateStr, shiftKey, 'man', itemIdx, e.target.value)
                                        }
                                        placeholder="Tên món..."
                                        className="flex-1 font-bold text-neutral-900 bg-transparent focus:outline-none focus:bg-neutral-50 rounded px-1 text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDish(dateStr, shiftKey, 'man', itemIdx)}
                                        className="text-neutral-400 hover:text-red-600 p-0.5 cursor-pointer shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Step 4: Text input for portions/weights */}
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                      <span className="text-[10px] text-neutral-400 font-semibold shrink-0">ĐL:</span>
                                      <input
                                        type="text"
                                        value={portionsText}
                                        onChange={(e) =>
                                          handleUpdateDishWeightText(
                                            dateStr,
                                            shiftKey,
                                            'man',
                                            itemIdx,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Ví dụ: Thịt heo 40-45g · Bún 210-230g..."
                                        className="w-full text-[11px] font-mono text-teal-900 bg-teal-50/50 border border-teal-200/80 rounded px-1.5 py-0.5 focus:outline-none focus:bg-white"
                                      />
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* SUẤT ĂN CHAY */}
                          <div className="space-y-1 pt-1.5 border-t border-neutral-200/80">
                            <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                              Món chay ({shiftCell.chay.length} món):
                            </div>
                            {shiftCell.chay.length === 0 ? (
                              <div className="text-[11px] text-neutral-400 italic">Trống (Chưa có món chay)</div>
                            ) : (
                              shiftCell.chay.map((item: MenuRecordItem, itemIdx: number) => {
                                const portionsText = formatPortions(item) || item.rawWeight || '';

                                return (
                                  <div
                                    key={itemIdx}
                                    className="p-2 rounded-lg border bg-white border-neutral-200 space-y-1 shadow-3xs"
                                  >
                                    <div className="flex items-center justify-between gap-1">
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) =>
                                          handleUpdateDishName(dateStr, shiftKey, 'chay', itemIdx, e.target.value)
                                        }
                                        placeholder="Tên món chay..."
                                        className="flex-1 font-bold text-amber-950 bg-transparent focus:outline-none focus:bg-amber-50 rounded px-1 text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDish(dateStr, shiftKey, 'chay', itemIdx)}
                                        className="text-neutral-400 hover:text-red-600 p-0.5 cursor-pointer shrink-0"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Text input for vegetarian weights */}
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                      <span className="text-[10px] text-neutral-400 font-semibold shrink-0">ĐL:</span>
                                      <input
                                        type="text"
                                        value={portionsText}
                                        onChange={(e) =>
                                          handleUpdateDishWeightText(
                                            dateStr,
                                            shiftKey,
                                            'chay',
                                            itemIdx,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Ví dụ: Đậu hũ 60g..."
                                        className="w-full text-[11px] font-mono text-amber-900 bg-amber-50/50 border border-amber-200/80 rounded px-1.5 py-0.5 focus:outline-none focus:bg-white"
                                      />
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* TRÁNG MIỆNG */}
                          {shiftCell.trangMieng && shiftCell.trangMieng.length > 0 && (
                            <div className="pt-1 border-t border-neutral-200/80 text-[11px] flex items-center gap-1.5">
                              <span className="font-extrabold text-emerald-800 text-[10px] uppercase">
                                Tráng miệng:
                              </span>
                              <span className="font-semibold text-emerald-950">
                                {shiftCell.trangMieng.map((it: MenuRecordItem) => it.name).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-neutral-100 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-600 font-medium">
            Nhà Cung Cấp: <strong className="text-neutral-900">{vendorObj.name} ({vendorObj.code})</strong> · Tuần: <strong>05/10/2026 – 11/10/2026</strong>
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
              onClick={() => onConfirmSync(editableRecords, syncMode)}
              className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận đồng bộ vào hệ thống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
