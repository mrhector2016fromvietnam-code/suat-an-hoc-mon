import React, { useState, useRef } from 'react';
import { History, CheckCircle2, AlertCircle, Trash2, ChevronDown, ChevronUp, PlayCircle, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { parseMenuWorkbook, SUPPLIERS } from '../lib/parseMenuExcel.js';
import { formatWeekIsoToDisplay } from '../utils/excelMenuParser';

export interface ExtractionLogEntry {
  id: string;
  timestamp: string;
  fileName: string;
  vendorName: string;
  vendorCode: string;
  sourceType: 'Excel' | 'Image OCR' | 'Text Paste';
  status: 'success' | 'warning' | 'error';
  itemCount: number;
  durationMs: number;
  uploadLog?: string;
  parseLog?: string;
  modalLog?: string;
  warnings?: string[];
  rawSummary?: string;
}

interface ExtractionLogPanelProps {
  logs: ExtractionLogEntry[];
  onClearLogs?: () => void;
  onFileSelectForParser?: (file: File) => void;
}

export const ExtractionLogPanel: React.FC<ExtractionLogPanelProps> = ({ logs, onClearLogs, onFileSelectForParser }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [tamPhuongCheckResult, setTamPhuongCheckResult] = useState<string | null>(null);
  const fileTestInputRef = useRef<HTMLInputElement>(null);

  const handleVerifyTamPhuongStandard = () => {
    let currentMenusList: any[] = [];
    try {
      const saved = localStorage.getItem('vinhomes_weekly_menus_cache_v7_clean') || localStorage.getItem('vinhomes_menus_list_v2');
      if (saved) {
        currentMenusList = JSON.parse(saved);
      }
    } catch (e) {}

    const standards = [
      {
        cellLabel: '05/10 Sáng (Mặn)',
        dayOfWeek: 'Thứ 2',
        shift: 'Bữa sáng',
        type: 'man',
        standardStr: 'Bún thịt xào (Thịt heo 40–45g · Cà rốt,cải, giá 25–30g · Bún 210–230g)',
      },
      {
        cellLabel: '06/10 Sáng (Mặn)',
        dayOfWeek: 'Thứ 3',
        shift: 'Bữa sáng',
        type: 'man',
        standardStr: 'Bánh ướt chả (Chả lụa+nem 40–45g · Xà lách, rau thơm 25–30g · Bánh ướt 210–230g)',
      },
      {
        cellLabel: '06/10 Trưa (Mặn)',
        dayOfWeek: 'Thứ 3',
        shift: 'Bữa trưa',
        type: 'man',
        standardStr: 'Thịt heo kho su hào (Thịt 45–50g · Su hào 40g) | Chả trứng hấp ngũ sắc (70–80g) | Chả cá rim mặn (25–35g) | Bắp cải xào (70–80g) | Canh khoai mỡ (250ml) | Cơm trắng (280–300g) | Tráng miệng: Thạch rau câu (90–100g)',
      },
      {
        cellLabel: '11/10 Tối (Mặn)',
        dayOfWeek: 'Chủ nhật',
        shift: 'Bữa tối',
        type: 'man',
        standardStr: 'Thịt heo kho khổ qua (Thịt 45–50g · Khổ qua 40g) | Cá basa chiên rim mắm (70–75g) | Mắm thái (25–35g) | Bắp cải xào (70–80g) | Canh cải xanh (250ml) | Cơm trắng (280–300g) | Tráng miệng: Thạch rau câu (90–100g)',
      },
      {
        cellLabel: '05/10 Sáng (Chay)',
        dayOfWeek: 'Thứ 2',
        shift: 'Bữa sáng',
        type: 'chay',
        standardStr: 'Bún bì chay (Đậu hũ + bì chay 50–60g · Xà lách, rau thơm 25–30g · Bún 210–230g) | Tráng miệng: Sữa đậu nành',
      },
      {
        cellLabel: '06/10 Trưa (Chay)',
        dayOfWeek: 'Thứ 3',
        shift: 'Bữa trưa',
        type: 'chay',
        standardStr: 'Bò kho củ cải (100g) | Cà nướng mỡ hành (100g) | Đậu hủ trắng kho sả (30–40g) | Bắp cải xào (60–75g) | Canh khoai mỡ (250ml) | Cơm trắng (280–300g) | Tráng miệng: Thạch rau câu (90–100g)',
      },
    ];

    const normalize = (str: string) =>
      str
        .replace(/\s+/g, ' ')
        .replace(/-/g, '–')
        .replace(/\u2013/g, '–')
        .replace(/\u2014/g, '–')
        .replace(/,\s*/g, ', ')
        .replace(/\.\s*/g, '. ')
        .trim();

    const lines: string[] = [];
    lines.push('📊 KẾT QUẢ SO SÁNH THỰC TẾ LƯỚI / STORE VỚI CHUẨN TÁM PHƯƠNG TUẦN 05/10/2026:');
    lines.push('================================================================================');

    standards.forEach((std) => {
      const menu = currentMenusList.find(
        (m) =>
          m &&
          (m.vendorId === 'tam-phuong' || m.vendorId === 'TP') &&
          m.dayOfWeek === std.dayOfWeek &&
          m.shift === std.shift
      );

      let actual = '';
      if (menu) {
        if (std.type === 'man') {
          const dishes = Array.isArray(menu.meatDishes) ? menu.meatDishes : [];
          const dessert = menu.meatDessert ? `Tráng miệng: ${menu.meatDessert}` : '';
          actual = [...dishes, dessert].filter(Boolean).join(' | ');
        } else {
          const dishes = Array.isArray(menu.vegDishes) ? menu.vegDishes : [];
          const dessert = menu.vegDessert ? `Tráng miệng: ${menu.vegDessert}` : '';
          actual = [...dishes, dessert].filter(Boolean).join(' | ');
        }
      }

      if (!actual) {
        actual = '(Trống - chưa có dữ liệu Tám Phương trong store)';
      }

      const pass = normalize(actual) === normalize(std.standardStr);

      if (pass) {
        lines.push(`✅ [PASS] ${std.cellLabel}`);
        lines.push(`   app có: ${actual}`);
      } else {
        lines.push(`❌ [FAIL] ${std.cellLabel}`);
        lines.push(`   app có: ${actual}`);
        lines.push(`   chuẩn:  ${std.standardStr}`);
      }
      lines.push('');
    });

    setTamPhuongCheckResult(lines.join('\n'));
  };

  const handleTestFile = async (file: File) => {
    try {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      const uploadLog = `[UPLOAD] Tên file: ${file.name}, Đuôi: ${ext}, Kích thước: ${(file.size / 1024).toFixed(1)} KB, Tuần đang chọn: 2026-10-05 (05/10–11/10/2026)`;
      
      const buf = await file.arrayBuffer();
      const res = parseMenuWorkbook(buf, file.name, { weekStart: '2026-10-05' });
      
      const parseLog = `[PARSE] Bản ghi: ${res.records.length}, Món: ${res.stats?.dishes ?? 0} | Tuần tìm thấy: [${res.weeksFound.join(', ')}] | Sheet bỏ qua: ${res.skippedSheets?.length ?? 0} | Cảnh báo: ${res.warnings?.length ?? 0}`;
      
      let modalLog = '';
      if (res.records.length > 0) {
        modalLog = `[MODAL] Mở xem trước thành công: ${res.supplier?.name || 'Tám Phương'} (${res.records.length} bản ghi, ${res.stats.dishes} món)`;
      } else if (res.weeksFound.length > 0 && !res.weeksFound.includes('2026-10-05')) {
        modalLog = `[MODAL] Không mở modal: File là tuần ${res.weeksFound.map(w => formatWeekIsoToDisplay(w)).join(', ')}, không phải tuần đang chọn 05/10–11/10`;
      } else {
        modalLog = `[MODAL] Không mở modal: Không tìm thấy thực đơn hợp lệ trong file (${res.warnings.join('; ')})`;
      }

      setTestResult(`${uploadLog}\n${parseLog}\n${modalLog}`);
    } catch (err: any) {
      setTestResult(`[LỖI TEST] ${err?.message || 'Không thể đọc file'}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="w-full px-5 py-3.5 bg-neutral-50 flex items-center justify-between transition-colors text-xs font-bold text-neutral-800 border-b border-neutral-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 cursor-pointer text-left hover:text-teal-800"
        >
          <History className="w-4 h-4 text-teal-700" />
          <span>Nhật ký trích xuất &amp; Chẩn đoán Parser</span>
          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-mono">
            {logs.length} bản ghi
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Direct File Test Button */}
          <input
            ref={fileTestInputRef}
            type="file"
            accept=".xlsx,.xls,.ods,.csv,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const f = e.target.files[0];
                handleTestFile(f);
                if (onFileSelectForParser) onFileSelectForParser(f);
              }
            }}
          />
          <button
            type="button"
            onClick={handleVerifyTamPhuongStandard}
            className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kiểm tra chuẩn Tám Phương</span>
          </button>

          <button
            type="button"
            onClick={() => fileTestInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Chạy thử parser</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded text-neutral-500 hover:text-neutral-800 cursor-pointer"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable panel */}
      {isOpen && (
        <div className="p-4 space-y-3 animate-fade-in text-xs">
          {/* Tám Phương Standard Verification Result */}
          {tamPhuongCheckResult && (
            <div className="p-3.5 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] space-y-2 border border-neutral-700 shadow-inner">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>🛡️ BẢNG KIỂM TRA CHUẨN TÁM PHƯƠNG TỪ STORE THỰC TẾ:</span>
                <button
                  type="button"
                  onClick={() => setTamPhuongCheckResult(null)}
                  className="text-neutral-400 hover:text-white text-[10px] cursor-pointer"
                >
                  Đóng
                </button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-neutral-200 overflow-x-auto">
                {tamPhuongCheckResult}
              </pre>
            </div>
          )}

          {/* Quick diagnostic test output if run */}
          {testResult && (
            <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] space-y-1.5 border border-neutral-700 shadow-inner">
              <div className="font-bold text-teal-400 flex items-center justify-between">
                <span>⚡ KẾT QUẢ CHẨN ĐOÁN TEST TRỰC TIẾP:</span>
                <button
                  type="button"
                  onClick={() => setTestResult(null)}
                  className="text-neutral-400 hover:text-white text-[10px]"
                >
                  Đóng
                </button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-neutral-200">
                {testResult}
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-1 border-b border-neutral-100">
            <span>Lịch sử các lần tải tệp, bóc tách dữ liệu và mở xem trước:</span>
            {logs.length > 0 && onClearLogs && (
              <button
                type="button"
                onClick={onClearLogs}
                className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa nhật ký</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5">
            {logs.length === 0 ? (
              <div className="py-6 text-center text-neutral-400">
                Chưa có nhật ký trích xuất nào. Bạn có thể bấm nút &quot;Chạy thử parser&quot; phía trên hoặc kéo thả tệp thực đơn vào bảng để kiểm tra.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 text-xs ${
                    log.status === 'success'
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : log.status === 'warning'
                      ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                      : 'bg-rose-50/50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold flex items-center gap-2">
                      {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {log.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                      {log.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      <span className="font-mono text-neutral-900 font-bold">{log.fileName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white border font-mono text-[10px]">
                        {log.sourceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-500 font-mono">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        log.status === 'success' ? 'bg-emerald-200 text-emerald-900' : log.status === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* 3 Step Logs */}
                  <div className="bg-white/80 p-2.5 rounded-lg border border-neutral-200/80 font-mono text-[11px] space-y-1">
                    {log.uploadLog && (
                      <div className="text-teal-900">
                        <strong className="text-teal-700">[UPLOAD]</strong> {log.uploadLog}
                      </div>
                    )}
                    {log.parseLog && (
                      <div className="text-indigo-900">
                        <strong className="text-indigo-700">[PARSE]</strong> {log.parseLog}
                      </div>
                    )}
                    {log.modalLog && (
                      <div className="text-neutral-800">
                        <strong className="text-emerald-700">[MODAL]</strong> {log.modalLog}
                      </div>
                    )}
                  </div>

                  {log.warnings && log.warnings.length > 0 && (
                    <div className="text-[10px] text-amber-900 bg-amber-100/60 px-2 py-1 rounded">
                      ⚠️ <strong>Cảnh báo:</strong> {log.warnings.join('; ')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
