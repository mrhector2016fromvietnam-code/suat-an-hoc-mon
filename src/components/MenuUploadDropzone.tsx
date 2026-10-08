import React, { useRef, useState } from 'react';
import { 
  CheckCircle2, Upload, History, FileImage, Sparkles, Check, 
  AlertCircle, RefreshCw, FileText, Table, Eye, X, ArrowRight, 
  ShieldCheck, Trash2, Building2, ChevronRight, Layers, HelpCircle
} from 'lucide-react';
import { DayShiftMenu } from '../types/report';
import { PRELOADED_MENUS, cleanDishName } from '../data/vinhomesMenuData';
import { parseExcelMenuFile, recordsToDayShiftMenus, formatWeekIsoToDisplay } from '../utils/excelMenuParser';
import { compressAndResizeImage } from '../utils/imageCompressor';
import { resolveSupplierMatch, SupplierMatchResult, VendorInfo } from '../utils/matchSupplier';
import { normalizeMenuData, NormalizedMenuSchema } from '../utils/normalizeMenu';
import { VendorConflictModal } from './VendorConflictModal';
import { ExtractionPreviewModal, MenuRecord, MenuRecordItem } from './ExtractionPreviewModal';
import { MultiFilePreviewModal, BatchFileItem } from './MultiFilePreviewModal';
import { ExtractionLogPanel, ExtractionLogEntry } from './ExtractionLogPanel';
import { 
  parseMenuWorkbook, 
  toGrid, 
  formatPortions, 
  matchSupplier, 
  SUPPLIERS as PARSER_SUPPLIERS,
  itemsFromRows 
} from '../lib/parseMenuExcel';

const VENDOR_ID_TO_CODE: Record<string, string> = {
  'tam-phuong': 'TP',
  'lim-duong': 'LD',
  'minh-long-food': 'ML',
  'nguyen-sai-gon': 'NS',
  'huong-ngoc-phat': 'HN',
  'thien-hong-phuc': 'TH',
  'vina-story': 'VS',
};

const VENDOR_CODE_TO_ID: Record<string, string> = {
  TP: 'tam-phuong',
  LD: 'lim-duong',
  ML: 'minh-long-food',
  NS: 'nguyen-sai-gon',
  HN: 'huong-ngoc-phat',
  TH: 'thien-hong-phuc',
  VS: 'vina-story',
};

interface MenuUploadDropzoneProps {
  currentMenuName: string;
  onMenuExtracted?: (data: {
    vendorName: string;
    vendorId: string;
    projectName?: string;
    weekRange?: string;
    menus: DayShiftMenu[];
  }) => void;
  onOpenHistory?: () => void;
  onOpenDeleteModal?: () => void;
  onUndoUploadedMenu?: (vendorId: string) => void;
}

const STANDARD_VENDORS = [
  { id: 'auto', name: 'Tự động nhận diện tất cả Nhà Cung Cấp trong ảnh/file', code: 'AUTO', badge: 'bg-teal-700 text-white' },
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', badge: 'bg-emerald-600 text-white' },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD', badge: 'bg-blue-600 text-white' },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', badge: 'bg-amber-600 text-white' },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', badge: 'bg-purple-600 text-white' },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', badge: 'bg-rose-600 text-white' },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', badge: 'bg-teal-600 text-white' },
  { id: 'vina-story', name: 'Vina Story', code: 'VS', badge: 'bg-indigo-600 text-white' },
  { id: 'all', name: 'Toàn bộ 7 Nhà Cung Cấp (Bảng tổng hợp tuần)', code: 'ALL', badge: 'bg-[#0f2d4a] text-white' },
];

export const MenuUploadDropzone: React.FC<MenuUploadDropzoneProps> = ({
  currentMenuName,
  onMenuExtracted,
  onOpenHistory,
  onOpenDeleteModal,
  onUndoUploadedMenu,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [uploadNotice, setUploadNotice] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);
  const [extractedResult, setExtractedResult] = useState<any | null>(null);
  const [previewVendorId, setPreviewVendorId] = useState<string>('tam-phuong');
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste' | 'preset'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [selectedTargetVendor, setSelectedTargetVendor] = useState<string>('auto');
  const [showDiagnosticOverlay, setShowDiagnosticOverlay] = useState<boolean>(false);
  const [diagnosticPairs, setDiagnosticPairs] = useState<Record<string, string> | null>(null);

  // New pipeline states
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showMultiFileModal, setShowMultiFileModal] = useState<boolean>(false);
  const [batchFileItems, setBatchFileItems] = useState<BatchFileItem[]>([]);
  const [previewRecords, setPreviewRecords] = useState<MenuRecord[]>([]);
  const [previewStats, setPreviewStats] = useState<{ records: number; dishes: number }>({ records: 0, dishes: 0 });
  const [previewWarnings, setPreviewWarnings] = useState<string[]>([]);
  const [pendingVendor, setPendingVendor] = useState<{ id: string; name: string }>({ id: 'tam-phuong', name: 'Tám Phương' });
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [conflictMatchInfo, setConflictMatchInfo] = useState<SupplierMatchResult | null>(null);
  const [extractionLogs, setExtractionLogs] = useState<ExtractionLogEntry[]>([]);
  const [pendingRawData, setPendingRawData] = useState<any | null>(null);

  const logExtractionEvent = (
    fileName: string,
    vendorName: string,
    vendorCode: string,
    sourceType: 'Excel' | 'Image OCR' | 'Text Paste',
    status: 'success' | 'warning' | 'error',
    itemCount: number,
    durationMs: number,
    warnings: string[] = [],
    uploadLog?: string,
    parseLog?: string,
    modalLog?: string
  ) => {
    const newEntry: ExtractionLogEntry = {
      id: String(Date.now()),
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      fileName,
      vendorName,
      vendorCode,
      sourceType,
      status,
      itemCount,
      durationMs,
      warnings,
      uploadLog,
      parseLog,
      modalLog,
    };
    setExtractionLogs((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  // Helper to identify vendor from text
  const detectVendorFromText = (text: string): { id: string; name: string } => {
    if (selectedTargetVendor !== 'auto') {
      const found = STANDARD_VENDORS.find((v) => v.id === selectedTargetVendor);
      if (found) return found;
    }
    const s = (text || '').toLowerCase();
    if (s.includes('lim') || s.includes('ld')) return { id: 'lim-duong', name: 'Lim Dương' };
    if (s.includes('minh long') || s.includes('ml')) return { id: 'minh-long-food', name: 'Minh Long Food' };
    if (s.includes('nguyên sài') || s.includes('nguyen sai') || s.includes('ns')) return { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn' };
    if (s.includes('hương ngọc') || s.includes('huong ngoc') || s.includes('hn')) return { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát' };
    if (s.includes('thiên hồng') || s.includes('thien hong') || s.includes('th')) return { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc' };
    if (s.includes('vina') || s.includes('vs')) return { id: 'vina-story', name: 'Vina Story' };
    if (s.includes('tám') || s.includes('tam') || s.includes('tp')) return { id: 'tam-phuong', name: 'Tám Phương' };
    return { id: 'all', name: 'Tổng hợp 7 Nhà Cung Cấp' };
  };

  // Instant 1-click Preset Loader (Bulletproof, 0 latency)
  const handleQuickLoadAllVendors = () => {
    try {
      const allMenus = PRELOADED_MENUS.map((m) => ({
        ...m,
        meatDishes: m.meatDishes.map(cleanDishName).filter(Boolean),
        vegDishes: m.vegDishes.map(cleanDishName).filter(Boolean),
        meatDessert: cleanDishName(m.meatDessert),
        vegDessert: cleanDishName(m.vegDessert),
      }));

      const data = {
        vendorName: 'Tổng Hợp 7 Nhà Cung Cấp',
        vendorId: 'all',
        projectName: 'Ký Túc Xá Hóc Môn',
        weekRange: '05/10/2026 - 11/10/2026',
        menus: allMenus,
      };
      setExtractedResult(data);
      setPreviewVendorId('tam-phuong');
      if (onMenuExtracted) {
        onMenuExtracted(data);
      }
      setUploadNotice({
        type: 'success',
        text: `✓ Đã nạp chính xác 100% thực đơn của cả 7 Nhà Cung Cấp (${allMenus.length} ca ăn)!`
      });
      setTimeout(() => setUploadNotice(null), 5000);
    } catch (err) {
      console.warn('Quick load all error:', err);
    }
  };

  const handleQuickLoadVendor = (vendorId: string, vendorName: string) => {
    if (vendorId === 'all') {
      handleQuickLoadAllVendors();
      return;
    }
    try {
      const vendorMenus = PRELOADED_MENUS.filter((m) => m.vendorId === vendorId).map((m) => ({
        ...m,
        meatDishes: m.meatDishes.map(cleanDishName).filter(Boolean),
        vegDishes: m.vegDishes.map(cleanDishName).filter(Boolean),
        meatDessert: cleanDishName(m.meatDessert),
        vegDessert: cleanDishName(m.vegDessert),
      }));

      const data = {
        vendorName,
        vendorId,
        projectName: 'Ký Túc Xá Hóc Môn',
        weekRange: '05/10/2026 - 11/10/2026',
        menus: vendorMenus,
      };
      setExtractedResult(data);
      setPreviewVendorId(vendorId);
      if (onMenuExtracted) {
        onMenuExtracted(data);
      }
      setUploadNotice({
        type: 'success',
        text: `✓ Đã nạp chính xác 100% thực đơn chuẩn của ${vendorName} (${vendorMenus.length} ca ăn)!`
      });
      setTimeout(() => setUploadNotice(null), 5000);
    } catch (err) {
      console.warn('Quick load error:', err);
    }
  };

  // Safe Image Downscaler to optimize base64 payloads
  const compressImageIfNeeded = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || '';
      };
      img.onload = () => {
        try {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.90));
            return;
          }
        } catch (e) {
          // Canvas fallback
        }
        resolve(img.src);
      };
      img.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  // Confirm sync from Preview Modal (Step E -> Step F)
  const handleConfirmPreviewSync = (finalRecords: MenuRecord[], mode: 'overwrite' | 'merge') => {
    const targetVendorId = pendingVendor.id;
    const targetVendorName = pendingVendor.name;

    // Convert MenuRecord[] to DayShiftMenu[] strictly according to recordsToDayShiftMenus
    const incomingMenus = recordsToDayShiftMenus(finalRecords, targetVendorId);

    const payload = {
      vendorName: targetVendorName,
      vendorId: targetVendorId,
      projectName: 'Ký Túc Xá Hóc Môn',
      weekRange: '05/10/2026 - 11/10/2026',
      menus: incomingMenus,
      syncMode: mode,
    };

    setExtractedResult(payload);
    setPreviewVendorId(targetVendorId);

    if (onMenuExtracted) {
      onMenuExtracted(payload);
    }

    setShowPreviewModal(false);
    setUploadNotice({
      type: 'success',
      text: `✓ Đã xác nhận & đồng bộ chính xác ${incomingMenus.length} ca ăn của ${targetVendorName} vào toàn bộ hệ thống (${mode === 'overwrite' ? 'Ghi đè' : 'Gộp ô trống'})!`,
    });
    setTimeout(() => setUploadNotice(null), 6000);
  };

  // Confirm vendor choice when conflict occurs (Step D)
  const handleConfirmConflictChoice = (chosenVendorId: string) => {
    const chosenVendorObj = STANDARD_VENDORS.find((v) => v.id === chosenVendorId) || { id: chosenVendorId, name: chosenVendorId };
    setShowConflictModal(false);
    setPendingVendor({ id: chosenVendorObj.id, name: chosenVendorObj.name });
    setShowPreviewModal(true);
  };

  // Helper to convert OCR JSON data to MenuRecord[]
  const convertOcrDataToMenuRecords = (ocrData: any): { records: MenuRecord[]; stats: { records: number; dishes: number } } => {
    const records: MenuRecord[] = [];
    const weekStart = ocrData.week_start || '2026-10-05';
    
    (ocrData.days || []).forEach((d: any, dayIdx: number) => {
      (d.shifts || []).forEach((sh: any) => {
        const shiftType: 'sang' | 'trua' | 'toi' = 
          sh.shift === 'sang' || sh.shift === 'Bữa sáng' ? 'sang' :
          sh.shift === 'trua' || sh.shift === 'Bữa trưa' ? 'trua' : 'toi';
        
        const manItems: MenuRecordItem[] = [];
        const chayItems: MenuRecordItem[] = [];

        (sh.items || []).forEach((it: any) => {
          const itemObj: MenuRecordItem = {
            category: it.category || 'man',
            name: it.name,
            note: it.note || '',
            portions: it.qty ? [{ label: it.name, min: it.qty, max: it.qty, unit: it.unit || 'g' }] : [],
            rawName: it.name,
            rawWeight: it.qty ? `${it.qty}${it.unit || 'g'}` : '',
          };
          if (it.category === 'chay') {
            chayItems.push(itemObj);
          } else {
            manItems.push(itemObj);
          }
        });

        if (manItems.length > 0) {
          records.push({
            weekStart,
            date: d.date || `2026-10-${String(5 + dayIdx).padStart(2, '0')}`,
            weekday: d.weekday || 'Thứ',
            weekdayIndex: dayIdx,
            shift: shiftType,
            menuType: 'man',
            sheet: 'Ảnh thực đơn Mặn',
            items: manItems,
          });
        }

        if (chayItems.length > 0) {
          records.push({
            weekStart,
            date: d.date || `2026-10-${String(5 + dayIdx).padStart(2, '0')}`,
            weekday: d.weekday || 'Thứ',
            weekdayIndex: dayIdx,
            shift: shiftType,
            menuType: 'chay',
            sheet: 'Ảnh thực đơn Chay',
            items: chayItems,
          });
        }
      });
    });

    return {
      records,
      stats: {
        records: records.length,
        dishes: records.reduce((sum, r) => sum + r.items.length, 0),
      }
    };
  };

  // Process file upload with Real Multi-Vendor OCR & parseMenuWorkbook (Step 2 & 3)
  const handleProcessFile = async (file: File) => {
    setIsProcessing(true);
    setUploadNotice(null);
    const startTime = Date.now();
    setProgressMsg(`Đang đọc tệp "${file.name}"...`);

    const lowerName = file.name.toLowerCase();
    const ext = '.' + (lowerName.split('.').pop() || '');
    const isExcelFile = Boolean(lowerName.match(/\.(xlsx|xls|ods|csv)$/));
    const isImageFile = Boolean(lowerName.match(/\.(png|jpg|jpeg|webp)$/));

    const vendorTargetLabel = selectedTargetVendor !== 'auto' && selectedTargetVendor !== 'all'
      ? (STANDARD_VENDORS.find((v) => v.id === selectedTargetVendor)?.name || selectedTargetVendor)
      : 'Tự động nhận diện';

    const uploadLogStr = `Tên: ${file.name}, Đuôi: ${ext}, Kích thước: ${(file.size / 1024).toFixed(1)} KB, NCC chỉ định: ${vendorTargetLabel}, Tuần: 2026-10-05 (05/10–11/10/2026)`;

    if (!isExcelFile && !isImageFile) {
      const errMsg = `Định dạng tệp "${ext}" không được hỗ trợ. Vui lòng tải lên file Excel (.xlsx, .xls, .ods, .csv) hoặc ảnh thực đơn (.png, .jpg, .jpeg, .webp).`;
      setUploadNotice({ type: 'error', text: `❌ ${errMsg}` });
      logExtractionEvent(
        file.name,
        'Không xác định',
        'ERR',
        'Excel',
        'error',
        0,
        Date.now() - startTime,
        [errMsg],
        uploadLogStr,
        `[PARSE] Bị hủy: Đuôi file "${ext}" không hợp lệ`,
        `[MODAL] Không mở modal do định dạng file không hỗ trợ`
      );
      setIsProcessing(false);
      setProgressMsg('');
      return;
    }

    try {
      if (isExcelFile) {
        setProgressMsg(`Đang bóc tách dữ liệu ma trận 7 ngày × 3 ca bằng parseMenuWorkbook trong "${file.name}"...`);
        const parsedRes = await parseExcelMenuFile(file, selectedTargetVendor, '2026-10-05');

        const parseLogStr = `Bản ghi: ${parsedRes.records.length}, Món: ${parsedRes.stats?.dishes ?? 0} | Tuần tìm thấy: [${parsedRes.weeksFound.join(', ')}] | Sheet bỏ qua: ${parsedRes.skippedSheets?.length ?? 0} | Cảnh báo: ${parsedRes.warnings?.length ?? 0}`;

        // Check supplier match & conflict
        if (parsedRes.supplierConflict && parsedRes.detectedSupplier) {
          const chosenCode = VENDOR_ID_TO_CODE[selectedTargetVendor] || 'TP';
          const chosenSupplier = PARSER_SUPPLIERS.find((s) => s.id === chosenCode) || { id: chosenCode, name: selectedTargetVendor };
          const userSelInfo = { id: VENDOR_CODE_TO_ID[chosenSupplier.id] || chosenSupplier.id, name: chosenSupplier.name, code: chosenSupplier.id, aliases: [] };
          const fileDetInfo = { id: VENDOR_CODE_TO_ID[parsedRes.detectedSupplier.id] || parsedRes.detectedSupplier.id, name: parsedRes.detectedSupplier.name, code: parsedRes.detectedSupplier.id, aliases: [] };
          const conflictRes: SupplierMatchResult = {
            isConflict: true,
            source: 'user_selected',
            supplier: userSelInfo,
            conflictDetails: {
              userSelected: userSelInfo,
              fileDetected: fileDetInfo,
              message: `File có vẻ của "${parsedRes.detectedSupplier.name}" nhưng đang chọn "${chosenSupplier.name}".`,
            },
          };
          setConflictMatchInfo(conflictRes);
          setPendingVendor({
            id: parsedRes.supplier?.id ? (VENDOR_CODE_TO_ID[parsedRes.supplier.id] || 'tam-phuong') : 'tam-phuong',
            name: parsedRes.supplier?.name || 'Tám Phương',
          });
          setPreviewRecords(parsedRes.records);
          setPreviewStats(parsedRes.stats);
          setPreviewWarnings(parsedRes.warnings);
          setShowConflictModal(true);
          setIsProcessing(false);
          setProgressMsg('');

          logExtractionEvent(
            file.name,
            parsedRes.detectedSupplier.name,
            parsedRes.detectedSupplier.id,
            'Excel',
            'warning',
            parsedRes.stats.dishes,
            Date.now() - startTime,
            parsedRes.warnings,
            uploadLogStr,
            parseLogStr,
            `[MODAL] Mở hộp thoại xử lý mâu thuẫn NCC: File nhận diện là "${parsedRes.detectedSupplier.name}", đang chọn "${chosenSupplier.name}"`
          );
          return;
        }

        const rawSupplierId = parsedRes.supplier?.id;
        const finalVendorId = rawSupplierId ? (VENDOR_CODE_TO_ID[rawSupplierId] || rawSupplierId) : (selectedTargetVendor !== 'auto' && selectedTargetVendor !== 'all' ? selectedTargetVendor : 'tam-phuong');
        const finalVendorName = parsedRes.supplier?.name || (STANDARD_VENDORS.find((v) => v.id === finalVendorId)?.name || 'Tám Phương');

        setPendingVendor({ id: finalVendorId, name: finalVendorName });
        setPreviewRecords(parsedRes.records);
        setPreviewStats(parsedRes.stats);
        setPreviewWarnings(parsedRes.warnings);

        // Step 2 & 3: File .xlsx/.xls/.ods CHỈ được đi qua parseMenuWorkbook.
        if (parsedRes.records.length > 0) {
          setShowPreviewModal(true);
          setIsProcessing(false);
          setProgressMsg('');

          if (parsedRes.skippedSheets && parsedRes.skippedSheets.length > 0) {
            setUploadNotice({
              type: 'info',
              text: `✓ Đã tự động chọn đúng thực đơn tuần 05/10–11/10/2026 (Bỏ qua ${parsedRes.skippedSheets.length} sheet của các tuần khác trong file).`,
            });
          }

          logExtractionEvent(
            file.name,
            finalVendorName,
            parsedRes.supplier?.id || 'TP',
            'Excel',
            'success',
            parsedRes.stats.dishes,
            Date.now() - startTime,
            parsedRes.warnings,
            uploadLogStr,
            parseLogStr,
            `[MODAL] Mở Modal Xem trước & Xác nhận thành công (${parsedRes.records.length} bản ghi, ${parsedRes.stats.dishes} món)`
          );
          return;
        }

        // Case: Week mismatch (e.g. file is for week 12/10-18/10 but app is viewing 05/10-11/10)
        if (parsedRes.weeksFound && parsedRes.weeksFound.length > 0 && !parsedRes.weeksFound.includes('2026-10-05')) {
          const fileWeekStr = parsedRes.weeksFound.map(w => formatWeekIsoToDisplay(w)).join(', ');
          const weekMismatchMsg = `File "${file.name}" chứa thực đơn tuần ${fileWeekStr}, không khớp với tuần đang chọn (05/10–11/10/2026).`;
          
          setUploadNotice({
            type: 'warning',
            text: `⚠️ ${weekMismatchMsg} Vui lòng chuyển sang tuần ${fileWeekStr} hoặc chọn file của tuần 05/10–11/10/2026.`,
          });
          setIsProcessing(false);
          setProgressMsg('');

          logExtractionEvent(
            file.name,
            finalVendorName,
            parsedRes.supplier?.id || 'TP',
            'Excel',
            'warning',
            0,
            Date.now() - startTime,
            parsedRes.warnings,
            uploadLogStr,
            parseLogStr,
            `[MODAL] Không mở modal: ${weekMismatchMsg}`
          );
          return;
        }

        // Other Excel Parsing Warning/Failure
        const parseFailMsg = parsedRes.warnings?.length > 0
          ? parsedRes.warnings.join('; ')
          : 'Không tìm thấy bảng thực đơn theo định dạng hỗ trợ.';

        setUploadNotice({
          type: 'error',
          text: `❌ Không trích xuất được thực đơn từ "${file.name}": ${parseFailMsg}`,
        });
        setIsProcessing(false);
        setProgressMsg('');

        logExtractionEvent(
          file.name,
          finalVendorName,
          parsedRes.supplier?.id || 'ERR',
          'Excel',
          'error',
          0,
          Date.now() - startTime,
          parsedRes.warnings,
          uploadLogStr,
          parseLogStr,
          `[MODAL] Không mở modal: ${parseFailMsg}`
        );
        return;
      } else {
        // Image Branch
        setProgressMsg(`Đang tối ưu & nén ảnh "${file.name}"...`);
        const { base64, mimeType } = await compressAndResizeImage(file);

        const targetLabel = selectedTargetVendor !== 'auto' && selectedTargetVendor !== 'all'
          ? STANDARD_VENDORS.find((v) => v.id === selectedTargetVendor)?.name
          : 'Tự động nhận diện Nhà Cung Cấp';

        setProgressMsg(`Đang phân tích cấu trúc thực đơn qua AI OCR cho [${targetLabel}]...`);

        const response = await fetch('/api/gemini/extract-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType,
            fileName: file.name,
            targetVendorId: selectedTargetVendor,
          }),
        });

        const json = await response.json();
        if (json && json.success && json.data) {
          if (json.data?.diagnosticMetadata?.rawKeyValuePairs) {
            setDiagnosticPairs(json.data.diagnosticMetadata.rawKeyValuePairs);
          }

          const matchResult = resolveSupplierMatch(
            selectedTargetVendor,
            `${file.name} ${json.data.supplier_detected || ''}`
          );

          const ocrRecords = convertOcrDataToMenuRecords(json.data);
          const finalVendor = matchResult.supplier;
          setPendingVendor({ id: finalVendor.id, name: finalVendor.name });
          setPreviewRecords(ocrRecords.records);
          setPreviewStats(ocrRecords.stats);
          setPreviewWarnings([]);

          if (matchResult.isConflict && matchResult.conflictDetails) {
            setConflictMatchInfo(matchResult);
            setShowConflictModal(true);
            setIsProcessing(false);
            setProgressMsg('');
            return;
          }

          setShowPreviewModal(true);

          logExtractionEvent(
            file.name,
            finalVendor.name,
            finalVendor.code,
            'Image OCR',
            'success',
            ocrRecords.stats.dishes,
            Date.now() - startTime,
            [],
            uploadLogStr,
            `[PARSE] Trích xuất thành công ${ocrRecords.records.length} bản ghi (${ocrRecords.stats.dishes} món) qua OCR`,
            `[MODAL] Mở Modal Xem trước & Xác nhận thành công`
          );
          return;
        } else {
          throw new Error(json?.error || 'Không nhận diện được nội dung từ ảnh thực đơn.');
        }
      }
    } catch (err: any) {
      logExtractionEvent(
        file.name,
        'Không xác định',
        'ERR',
        isExcelFile ? 'Excel' : 'Image OCR',
        'error',
        0,
        Date.now() - startTime,
        [err?.message || 'Lỗi bóc tách'],
        uploadLogStr,
        `[PARSE] Thất bại: ${err?.message || 'Lỗi đọc tệp'}`,
        `[MODAL] Không mở modal do lỗi hệ thống`
      );
      setUploadNotice({
        type: 'error',
        text: `❌ Lỗi trích xuất: ${err?.message || 'Không thể trích xuất thực đơn từ tệp này. Vui lòng kiểm tra lại cấu trúc tệp/ảnh.'}`,
      });
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  // Process pasted text with Real Multi-Vendor OCR (Step B)
  const handleProcessPastedText = async () => {
    if (!pastedText.trim()) {
      setUploadNotice({ type: 'info', text: 'Vui lòng dán nội dung văn bản hoặc bảng thực đơn.' });
      return;
    }

    setIsProcessing(true);
    setUploadNotice(null);
    const startTime = Date.now();
    setProgressMsg('Đang bóc tách món ăn và phân tích các Nhà Cung Cấp...');

    try {
      const matchResult = resolveSupplierMatch(selectedTargetVendor, pastedText);

      const response = await fetch('/api/gemini/extract-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: pastedText.trim(),
          vendorHint: matchResult.supplier.id,
          targetVendorId: selectedTargetVendor,
        }),
      });

      const json = await response.json();

      if (json && json.success && json.data) {
        if (json.data?.diagnosticMetadata?.rawKeyValuePairs) {
          setDiagnosticPairs(json.data.diagnosticMetadata.rawKeyValuePairs);
        }

        const ocrRecords = convertOcrDataToMenuRecords(json.data);
        const finalVendor = matchResult.supplier;
        setPendingVendor({ id: finalVendor.id, name: finalVendor.name });
        setPreviewRecords(ocrRecords.records);
        setPreviewStats(ocrRecords.stats);
        setPreviewWarnings([]);

        if (matchResult.isConflict && matchResult.conflictDetails) {
          setConflictMatchInfo(matchResult);
          setShowConflictModal(true);
          setIsProcessing(false);
          setProgressMsg('');
          return;
        }

        setShowPreviewModal(true);

        logExtractionEvent(
          'Văn bản dán trực tiếp',
          finalVendor.name,
          finalVendor.code,
          'Text Paste',
          'success',
          ocrRecords.stats.dishes,
          Date.now() - startTime
        );
      } else {
        throw new Error(json?.error || 'Không trích xuất được món ăn từ văn bản.');
      }
    } catch (err: any) {
      logExtractionEvent(
        'Văn bản dán',
        'Không xác định',
        'ERR',
        'Text Paste',
        'error',
        0,
        Date.now() - startTime,
        [err?.message || 'Lỗi xử lý văn bản']
      );
      setUploadNotice({
        type: 'error',
        text: `❌ Lỗi trích xuất: ${err?.message || 'Không thể đọc nội dung văn bản.'}`,
      });
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = Array.from(e.dataTransfer.files);
      if (fileList.length === 1) {
        handleProcessFile(fileList[0]);
      } else {
        handleProcessMultipleFiles(fileList);
      }
    }
  };

  const handleProcessMultipleFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    if (files.length === 1) {
      handleProcessFile(files[0]);
      return;
    }

    setIsProcessing(true);
    setProgressMsg(`Đang đọc & phân tích ${files.length} tệp thực đơn...`);
    setUploadNotice(null);

    const items: BatchFileItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const lowerName = file.name.toLowerCase();
      const ext = '.' + (lowerName.split('.').pop() || '');
      const isExcelFile = Boolean(lowerName.match(/\.(xlsx|xls|ods|csv)$/));

      if (!isExcelFile) {
        items.push({
          id: `${file.name}_${Date.now()}_${i}`,
          file,
          fileName: file.name,
          vendorId: 'unknown',
          vendorName: 'Chưa xác định',
          weeksFound: [],
          records: [],
          cellCount: 0,
          dishCount: 0,
          warnings: [`File "${file.name}" không hợp lệ: Chỉ hỗ trợ định dạng Excel/CSV (.xlsx, .xls, .ods, .csv)`],
          status: 'unreadable',
          statusReason: `Không hỗ trợ định dạng ${ext}`,
          selectedForSync: false,
          res: null,
        });
        continue;
      }

      try {
        const buf = await file.arrayBuffer();
        const res = parseMenuWorkbook(buf, file.name, { weekStart: '2026-10-05' });

        const rawSupplierId = res.detectedSupplier?.id;
        const mappedVendorId = rawSupplierId && rawSupplierId !== 'unknown'
          ? (VENDOR_CODE_TO_ID[rawSupplierId] || rawSupplierId)
          : 'unknown';
        const vendorName = res.detectedSupplier?.name ||
          (STANDARD_VENDORS.find((v) => v.id === mappedVendorId)?.name || 'Chưa nhận diện được');

        let status: 'ready' | 'wrong_week' | 'unreadable' = 'ready';
        let statusReason = '';

        if (!res.records || res.records.length === 0) {
          status = 'unreadable';
          statusReason = 'Không đọc được thực đơn hoặc file rỗng';
        } else if (res.weeksFound && res.weeksFound.length > 0 && !res.weeksFound.includes('2026-10-05')) {
          status = 'wrong_week';
          const wStr = res.weeksFound.map((w) => formatWeekIsoToDisplay(w)).join(', ');
          statusReason = `File thuộc tuần ${wStr}, khác tuần đang chọn (05/10–11/10/2026)`;
        }

        items.push({
          id: `${file.name}_${Date.now()}_${i}`,
          file,
          fileName: file.name,
          vendorId: mappedVendorId,
          vendorName,
          weeksFound: res.weeksFound || [],
          records: res.records || [],
          cellCount: res.stats?.records || res.records?.length || 0,
          dishCount: res.stats?.dishes || 0,
          warnings: res.warnings || [],
          status,
          statusReason,
          selectedForSync: status === 'ready',
          res,
        });
      } catch (err: any) {
        items.push({
          id: `${file.name}_${Date.now()}_${i}`,
          file,
          fileName: file.name,
          vendorId: 'unknown',
          vendorName: 'Lỗi đọc tệp',
          weeksFound: [],
          records: [],
          cellCount: 0,
          dishCount: 0,
          warnings: [err?.message || 'Không thể đọc tệp'],
          status: 'unreadable',
          statusReason: `Lỗi đọc tệp: ${err?.message || 'Không mở được tệp'}`,
          selectedForSync: false,
          res: null,
        });
      }
    }

    setIsProcessing(false);
    setProgressMsg('');
    setBatchFileItems(items);
    setShowMultiFileModal(true);
  };

  const handleUpdateBatchItemVendor = (itemId: string, newVendorId: string, newVendorName: string) => {
    setBatchFileItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              vendorId: newVendorId,
              vendorName: newVendorName,
              status: item.records.length > 0 && item.status !== 'wrong_week' ? 'ready' : item.status,
              selectedForSync: item.records.length > 0 && item.status !== 'wrong_week',
            }
          : item
      )
    );
  };

  const handleToggleSelectItem = (itemId: string) => {
    setBatchFileItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selectedForSync: !item.selectedForSync } : item
      )
    );
  };

  const handleInspectBatchFileItem = (item: BatchFileItem) => {
    setPendingVendor({ id: item.vendorId, name: item.vendorName });
    setPreviewRecords(item.records);
    setPreviewStats({ records: item.cellCount, dishes: item.dishCount });
    setPreviewWarnings(item.warnings);
    setShowPreviewModal(true);
  };

  const handleConfirmBatchSync = (selectedItems: BatchFileItem[]) => {
    if (!selectedItems || selectedItems.length === 0) return;

    const allIncomingMenus: DayShiftMenu[] = [];
    const processedVendorNames: string[] = [];

    selectedItems.forEach((item) => {
      const dayShiftMenus = recordsToDayShiftMenus(item.records, item.vendorId);
      allIncomingMenus.push(...dayShiftMenus);
      processedVendorNames.push(item.vendorName);

      logExtractionEvent(
        item.fileName,
        item.vendorName,
        item.vendorId,
        'Excel',
        'success',
        item.dishCount,
        100,
        item.warnings,
        `Tên: ${item.fileName}, NCC: ${item.vendorName}, Tuần: 2026-10-05`,
        `Bản ghi: ${item.records.length}, Món: ${item.dishCount}`,
        `[MODAL] Đồng bộ thành công ${dayShiftMenus.length} ca ăn vào thẻ NCC ${item.vendorName}`
      );
    });

    const payload = {
      vendorName: Array.from(new Set(processedVendorNames)).join(', '),
      vendorId: selectedItems[0]?.vendorId || 'tam-phuong',
      projectName: 'Ký Túc Xá Hóc Môn',
      weekRange: '05/10/2026 - 11/10/2026',
      menus: allIncomingMenus,
      syncMode: 'overwrite' as const,
    };

    if (onMenuExtracted) {
      onMenuExtracted(payload);
    }

    setShowMultiFileModal(false);
    setUploadNotice({
      type: 'success',
      text: `✓ Đã đồng bộ thành công ${selectedItems.length} tệp thực đơn (${allIncomingMenus.length} ca ăn) vào hệ thống!`,
    });
    setTimeout(() => setUploadNotice(null), 6000);
  };

  // Group extracted menus by vendor for preview
  const extractedVendorsList: string[] = extractedResult?.menus
    ? Array.from(new Set(extractedResult.menus.map((m: any) => String(m.vendorId))))
    : [];

  const previewMenus = extractedResult?.menus
    ? extractedResult.menus.filter((m: any) => m.vendorId === previewVendorId)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>1. Tải lên & Cập nhật Thực đơn (Đồng bộ cho cả 7 Nhà Cung Cấp)</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Hỗ trợ ảnh chụp, file scan PDF, bảng Excel, hoặc văn bản từ Zalo. Trích xuất chính xác 100% món mặn, món chay và tráng miệng theo tuần.
          </p>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeInputMode === 'upload'
                ? 'bg-white text-teal-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Tải tệp ảnh/PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('paste')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeInputMode === 'paste'
                ? 'bg-white text-teal-900 shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Dán văn bản/Zalo
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('preset')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeInputMode === 'preset'
                ? 'bg-teal-800 text-white shadow-2xs'
                : 'text-neutral-500 hover:text-teal-800'
            }`}
          >
            Bộ thực đơn chuẩn 7 NCC
          </button>
        </div>
      </div>

      {/* Target Vendor Picker (Chỉ định rõ ràng áp dụng cho ai) */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Chỉ định Nhà Cung Cấp áp dụng cho tệp này:</span>
          </label>
          <span className="text-[11px] text-neutral-500">
            {selectedTargetVendor === 'auto'
              ? '⚡ Tự động phân tích tên NCC trong tiêu đề ảnh'
              : '🔒 Đã khóa cứng thực đơn vào NCC được chọn'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 pt-1">
          {STANDARD_VENDORS.map((v) => {
            const isSelected = selectedTargetVendor === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedTargetVendor(v.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer ${
                  isSelected
                    ? 'bg-teal-900 text-white border-teal-950 shadow-xs ring-2 ring-teal-600/30'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <span className="truncate">{v.name.split(' (')[0]}</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ml-1 ${isSelected ? 'bg-teal-800 text-teal-200' : 'bg-neutral-100 text-neutral-600'}`}>
                  {v.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode 1: Drag & Drop File */}
      {activeInputMode === 'upload' && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-teal-500 bg-teal-50/60'
                : 'border-teal-300/90 bg-neutral-50/40 hover:bg-neutral-50/90 hover:border-teal-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.ods,.csv,.png,.jpg,.jpeg,.webp,image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const fileList = Array.from(e.target.files);
                  if (fileList.length === 1) {
                    handleProcessFile(fileList[0]);
                  } else {
                    handleProcessMultipleFiles(fileList);
                  }
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-2xs border border-teal-200/80">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div className="text-sm font-black text-neutral-900">
              {isProcessing ? 'Đang trích xuất dữ liệu...' : 'Kéo & Thả ảnh chụp bảng thực đơn, hoặc Bấm vào đây để chọn tệp'}
            </div>
            <div className="text-xs text-neutral-500 mt-1 max-w-lg mx-auto">
              Hỗ trợ đầy đủ định dạng ảnh menu Tám Phương, Lim Dương, Minh Long, Thiên Hồng Phúc, Hương Ngọc Phát, Nguyên Sài Gòn, Vina Story...
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-900 text-xs font-semibold border border-teal-200">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Hỗ trợ OCR thông minh nhận diện đa nhà cung cấp và phân tách Món mặn / Món chay độc lập</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Paste Raw Text */}
      {activeInputMode === 'paste' && (
        <div className="space-y-3">
          <textarea
            rows={5}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Dán nội dung thực đơn từ Zalo, Excel hoặc Word tại đây (Ví dụ: Thứ 2 Sáng: Phở bò, Trưa: Cơm sườn ram + canh bí đao, Chay: Đậu hũ sốt cà...)"
            className="w-full p-3.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Tự động nhận diện các buổi ăn Thứ 2 đến Chủ Nhật.
            </span>
            <button
              type="button"
              disabled={isProcessing || !pastedText.trim()}
              onClick={handleProcessPastedText}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang bóc tách...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Trích xuất & Cập nhật vào thực đơn</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Preset Fast Loader */}
      {activeInputMode === 'preset' && (
        <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-950 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Nạp nhanh thực đơn chuẩn 100% của 7 Nhà Cung Cấp (Chuẩn hóa không có số gam dư thừa):</span>
            </span>
            <span className="text-[10px] text-teal-800 font-mono">21 ca/NCC</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleQuickLoadAllVendors}
              className="px-3.5 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-950 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Nạp TOÀN BỘ 7 NCC (147 Ca ăn)</span>
            </button>

            {STANDARD_VENDORS.filter((v) => v.id !== 'all' && v.id !== 'auto').map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleQuickLoadVendor(v.id, v.name)}
                className="px-3 py-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-700 hover:text-white text-teal-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs group"
              >
                <span>{v.name}</span>
                <span className="text-[10px] font-mono opacity-60 group-hover:opacity-100 ml-1">({v.code})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Processing Status Banner */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-3 animate-pulse shadow-2xs">
          <RefreshCw className="w-5 h-5 animate-spin text-teal-700 shrink-0" />
          <div>
            <div className="font-bold text-sm">Hệ thống đang tiến hành bóc tách OCR...</div>
            <div className="font-medium text-teal-700 mt-0.5">{progressMsg}</div>
          </div>
        </div>
      )}

      {/* Notice Banner */}
      {uploadNotice && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-fade-in shadow-2xs ${
          uploadNotice.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : uploadNotice.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : uploadNotice.type === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-teal-50 border-teal-200 text-teal-950'
        }`}>
          <div className="flex items-center gap-2">
            {uploadNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {uploadNotice.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {uploadNotice.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            {uploadNotice.type === 'info' && <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />}
            <span className="font-semibold">{uploadNotice.text}</span>
          </div>
          <button
            onClick={() => setUploadNotice(null)}
            className="text-neutral-500 hover:text-neutral-900 font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Extracted Data Inspection Box with Vendor Tabs & Instant Apply */}
      {extractedResult && (
        <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-emerald-300 text-xs space-y-3 animate-fade-in shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <div>
              <div className="font-black text-emerald-950 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kết quả bóc tách: {extractedResult.vendorName}</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-0.5">
                Đã trích xuất tổng cộng <strong>{extractedResult.menus?.length || 0} ca ăn</strong> ({extractedVendorsList.length} Nhà Cung Cấp)
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDiagnosticOverlay(true)}
                className="px-3 py-1.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                title="Mở bảng chẩn đoán chi tiết các cặp Key-Value bóc tách từ tiêu đề Excel & Header"
              >
                <Eye className="w-3.5 h-3.5 text-teal-700" />
                <span>🔍 Chẩn đoán Key-Value tệp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onMenuExtracted) onMenuExtracted(extractedResult);
                  setUploadNotice({ type: 'success', text: '✓ Đã đồng bộ toàn bộ thực đơn vừa trích xuất vào hệ thống!' });
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Áp dụng vào hệ thống</span>
              </button>

              {onUndoUploadedMenu && (
                <button
                  type="button"
                  onClick={() => {
                    onUndoUploadedMenu(previewVendorId);
                    setExtractedResult(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-red-300 text-red-700 bg-white hover:bg-red-50 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Hủy</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-tabs for multiple detected vendors */}
          {extractedVendorsList.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-emerald-950 mr-1">Xem chi tiết NCC:</span>
              {extractedVendorsList.map((vId: string) => {
                const isCurrent = previewVendorId === vId;
                const vName = STANDARD_VENDORS.find((v) => v.id === vId)?.name || vId;
                return (
                  <button
                    key={vId}
                    type="button"
                    onClick={() => setPreviewVendorId(vId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {vName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Menu Items Table Preview */}
          <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100 bg-white rounded-xl border border-emerald-200 p-2.5 space-y-1">
            {previewMenus.length > 0 ? (
              previewMenus.map((m: any, idx: number) => (
                <div key={idx} className="py-1.5 text-xs text-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-bold text-neutral-900 min-w-[120px]">
                    {m.dayOfWeek} ({m.shift}):
                  </div>
                  <div className="flex-1 text-neutral-700 text-[11px]">
                    <span className="font-semibold text-neutral-900">Mặn:</span> {m.meatDishes?.join(', ') || 'Chưa có'} 
                    {m.meatDessert ? ` (TM: ${m.meatDessert})` : ''}
                    <span className="mx-1.5 text-neutral-300">|</span>
                    <span className="font-semibold text-emerald-700">Chay:</span> {m.vegDishes?.join(', ') || 'Chưa có'}
                    {m.vegDessert ? ` (TM: ${m.vegDessert})` : ''}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-neutral-400">
                Chưa có ca ăn nào cho Nhà Cung Cấp này trong tệp tải lên.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Footer: Status & Quick Action Buttons */}
      <div className="px-4 py-3 rounded-xl bg-[#f8fafc] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-700">
        <div className="flex items-center gap-2 truncate">
          <span className="text-teal-700 font-bold shrink-0">✓ Thực đơn đang hoạt động:</span>
          <span className="font-semibold text-neutral-900 truncate">
            {currentMenuName || 'Thực đơn 7 Nhà Cung Cấp'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <Table className="w-3.5 h-3.5 text-teal-700" />
              <span>Xem Ma trận tuần</span>
            </button>
          )}

          {onOpenDeleteModal && (
            <button
              type="button"
              onClick={onOpenDeleteModal}
              className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Mở bảng chọn để xóa các ca ăn hoặc thực đơn đã tải lên nhầm"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Xóa thực đơn up nhầm</span>
            </button>
          )}
        </div>
      </div>

      {/* Diagnostic Overlay Modal Dialog */}
      {showDiagnosticOverlay && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#0f2d4a] text-white flex items-center justify-between border-b border-neutral-700">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    BẢNG CHẨN ĐOÁN DỮ LIỆU TỆP (RAW KEY-VALUE OVERLAY)
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Kiểm tra trực tiếp các cặp Key-Value và tiêu đề bóc tách từ tệp Excel trước khi ánh xạ vào Nhà Cung Cấp.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnosticOverlay(false)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Vendor Matching Diagnostic Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">
                      Nhà Cung Cấp Đã Khớp: {extractedResult?.vendorName || 'Đang cập nhật'}
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      {selectedTargetVendor !== 'auto'
                        ? `🔒 Khóa cứng thủ công bởi người dùng (${selectedTargetVendor})`
                        : `⚡ Tự động quét từ tiêu đề/cột/trang tính Excel`}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-800 text-white font-mono text-[11px] font-bold">
                    {extractedVendorsList.join(', ')}
                  </span>
                </div>
              </div>

              {/* Key-Value Pairs Table */}
              <div>
                <div className="font-bold text-neutral-900 mb-2 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-neutral-700">
                    Các cặp Key-Value nhận diện từ tệp (Identified Raw Pairs):
                  </span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {diagnosticPairs ? Object.keys(diagnosticPairs).length : 0} cặp thông số
                  </span>
                </div>

                <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-100 text-neutral-800 border-b border-neutral-200 text-[11px] font-bold">
                        <th className="py-2.5 px-3.5 w-1/3">Trường / Khóa (Key)</th>
                        <th className="py-2.5 px-3.5 w-1/2">Giá trị bóc tách gốc (Raw Value)</th>
                        <th className="py-2.5 px-3.5 text-right">Khớp NCC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                      {diagnosticPairs && Object.keys(diagnosticPairs).length > 0 ? (
                        Object.entries(diagnosticPairs).map(([key, value], idx) => {
                          const isVendorKey = key.includes('Nhà cung cấp') || key.includes('Header') || key.includes('Trang tính') || key.includes('NCC');
                          return (
                            <tr key={idx} className={isVendorKey ? 'bg-amber-50/70 font-semibold' : 'hover:bg-neutral-50'}>
                              <td className="py-2 px-3.5 text-neutral-900 font-medium font-sans">
                                {key}
                              </td>
                              <td className="py-2 px-3.5 text-neutral-700 break-all">
                                {value}
                              </td>
                              <td className="py-2 px-3.5 text-right font-sans">
                                {isVendorKey ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                    ✓ Khớp NCC
                                  </span>
                                ) : (
                                  <span className="text-neutral-400 text-[10px]">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-neutral-400 font-sans">
                            Chưa có dữ liệu chẩn đoán Key-Value cho tệp này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manual Vendor Override within Overlay */}
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="font-bold text-neutral-900 text-xs">
                  Nếu tiêu đề Excel bị sai tên NCC, bạn có thể chọn lại trực tiếp tại đây:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_VENDORS.filter((v) => v.id !== 'all' && v.id !== 'auto').map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedTargetVendor(v.id);
                        if (extractedResult && extractedResult.menus) {
                          const updatedMenus = extractedResult.menus.map((m: any) => ({ ...m, vendorId: v.id }));
                          const updatedData = { ...extractedResult, vendorName: v.name, vendorId: v.id, menus: updatedMenus };
                          setExtractedResult(updatedData);
                          setPreviewVendorId(v.id);
                          if (onMenuExtracted) onMenuExtracted(updatedData);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${
                        selectedTargetVendor === v.id
                          ? 'bg-teal-900 text-white border-teal-950'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      Gán cứng {v.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDiagnosticOverlay(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-950 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
              >
                Xác nhận & Đóng bảng chẩn đoán
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-File Summary Preview Modal */}
      <MultiFilePreviewModal
        isOpen={showMultiFileModal}
        batchItems={batchFileItems}
        currentWeekStart="2026-10-05"
        onUpdateBatchItemVendor={handleUpdateBatchItemVendor}
        onToggleSelectItem={handleToggleSelectItem}
        onInspectFileDetails={handleInspectBatchFileItem}
        onConfirmSyncBatch={handleConfirmBatchSync}
        onClose={() => setShowMultiFileModal(false)}
      />

      {/* Extraction Preview Modal (Step E) */}
      <ExtractionPreviewModal
        isOpen={showPreviewModal}
        records={previewRecords}
        stats={previewStats}
        warnings={previewWarnings}
        vendorId={pendingVendor.id}
        vendorName={pendingVendor.name}
        onConfirmSync={handleConfirmPreviewSync}
        onClose={() => setShowPreviewModal(false)}
      />

      {/* Vendor Conflict Resolution Modal (Step D) */}
      <VendorConflictModal
        isOpen={showConflictModal}
        userSelected={conflictMatchInfo?.conflictDetails?.userSelected || { id: selectedTargetVendor, name: selectedTargetVendor, code: 'NCC', aliases: [] }}
        fileDetected={conflictMatchInfo?.conflictDetails?.fileDetected || { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', aliases: [] }}
        onConfirm={handleConfirmConflictChoice}
        onClose={() => setShowConflictModal(false)}
      />

      {/* Extraction History & Debug Log Panel (Step G) */}
      <div className="pt-3">
        <ExtractionLogPanel
          logs={extractionLogs}
          onClearLogs={() => setExtractionLogs([])}
          onFileSelectForParser={handleProcessFile}
        />
      </div>
    </div>
  );
};
