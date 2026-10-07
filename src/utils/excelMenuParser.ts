import * as XLSX from 'xlsx';
import { DayShiftMenu, MealShift } from '../types/report';
import { cleanDishName } from '../data/vinhomesMenuData';

export interface ParsedExcelResult {
  vendorName: string;
  vendorId: string;
  detectedVendors: { id: string; name: string; code: string }[];
  menus: DayShiftMenu[];
  rawTextSummary: string;
  diagnosticMetadata: {
    fileName: string;
    fileSize: string;
    fileType: string;
    sheetNames: string[];
    headerTitles: string[];
    detectedVendorHeaders: { text: string; vendorId: string; vendorName: string }[];
    totalRowsParsed: number;
    rawKeyValuePairs: Record<string, string>;
    isTargetLocked: boolean;
    targetVendorId: string;
  };
}

const VENDOR_KEYWORDS: { id: string; name: string; code: string; patterns: string[] }[] = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', patterns: ['tám phương', 'tam phuong', 'tam-phuong'] },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD', patterns: ['lim dương', 'lim duong', 'lim-duong'] },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', patterns: ['minh long', 'minh long food', 'minh-long', 'minhlong'] },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', patterns: ['nguyên sài gòn', 'nguyen sai gon', 'nguyen-sai-gon', 'nguyên sài'] },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', patterns: ['hương ngọc phát', 'huong ngoc phat', 'huong-ngoc-phat', 'hương ngọc'] },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', patterns: ['thiên hồng phúc', 'thien hong phuc', 'thien-hong-phuc', 'thiên hồng'] },
  { id: 'vina-story', name: 'Vina Story', code: 'VS', patterns: ['vina story', 'vinastory', 'vina-story'] },
];

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const DAY_DATES: Record<string, string> = {
  'Thứ 2': '05/10/2026',
  'Thứ 3': '06/10/2026',
  'Thứ 4': '07/10/2026',
  'Thứ 5': '08/10/2026',
  'Thứ 6': '09/10/2026',
  'Thứ 7': '10/10/2026',
  'Chủ nhật': '11/10/2026',
};

export const detectVendorFromCellText = (text: string): { id: string; name: string; code: string } | null => {
  // Strip volume units (100ml, 200ml) and weight units (100g, 200gr) before testing vendor keywords
  const cleanText = (text || '').replace(/\d+\s*ml\b/gi, ' ').replace(/\d+\s*g\b/gi, ' ');
  const lower = cleanText.toLowerCase();

  for (const v of VENDOR_KEYWORDS) {
    for (const pat of v.patterns) {
      if (lower.includes(pat)) {
        return { id: v.id, name: v.name, code: v.code };
      }
    }
    // Check explicit code patterns like "NCC: TP" or "Mã ML"
    const codeReg = new RegExp(`(?:ncc|cty|mã|code)[:\\s]*${v.code}\\b`, 'i');
    if (codeReg.test(lower)) {
      return { id: v.id, name: v.name, code: v.code };
    }
  }
  return null;
};

const normalizeDay = (str: string): string | null => {
  const lower = (str || '').toLowerCase();
  if (lower.includes('thứ 2') || lower.includes('thứ hai') || lower === 't2' || lower === 't 2') return 'Thứ 2';
  if (lower.includes('thứ 3') || lower.includes('thứ ba') || lower === 't3' || lower === 't 3') return 'Thứ 3';
  if (lower.includes('thứ 4') || lower.includes('thứ tư') || lower === 't4' || lower === 't 4') return 'Thứ 4';
  if (lower.includes('thứ 5') || lower.includes('thứ năm') || lower === 't5' || lower === 't 5') return 'Thứ 5';
  if (lower.includes('thứ 6') || lower.includes('thứ sáu') || lower === 't6' || lower === 't 6') return 'Thứ 6';
  if (lower.includes('thứ 7') || lower.includes('thứ bảy') || lower === 't7' || lower === 't 7') return 'Thứ 7';
  if (lower.includes('chủ nhật') || lower.includes('chu nhat') || lower === 'cn') return 'Chủ nhật';
  return null;
};

const normalizeShift = (str: string): MealShift | null => {
  const lower = (str || '').toLowerCase();
  if (lower.includes('sáng') || lower.includes('ca 1')) return 'Bữa sáng';
  if (lower.includes('trưa') || lower.includes('ca 2')) return 'Bữa trưa';
  if (lower.includes('tối') || lower.includes('ca 3') || lower.includes('chiều')) return 'Bữa tối';
  return null;
};

/**
 * Enhanced Excel Menu Extractor
 */
export const parseExcelMenuFile = async (
  file: File,
  targetVendorId: string = 'auto'
): Promise<ParsedExcelResult> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true, cellFormula: false });

  let fullTextLines: string[] = [];
  const detectedVendorsMap = new Map<string, { id: string; name: string; code: string }>();
  const extractedMenusList: DayShiftMenu[] = [];

  // If user selected targetVendorId explicitly
  if (targetVendorId !== 'auto' && targetVendorId !== 'all') {
    const targetObj = VENDOR_KEYWORDS.find((v) => v.id === targetVendorId);
    if (targetObj) {
      detectedVendorsMap.set(targetObj.id, targetObj);
    }
  }

  // Iterate all sheets in workbook
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    // Check if sheet name indicates vendor
    const sheetVendor = detectVendorFromCellText(sheetName);
    const isTargetLocked = targetVendorId !== 'auto' && targetVendorId !== 'all';
    
    let currentSheetVendorId = isTargetLocked
      ? targetVendorId
      : (sheetVendor?.id || 'tam-phuong');

    if (sheetVendor && !isTargetLocked) {
      detectedVendorsMap.set(sheetVendor.id, sheetVendor);
      fullTextLines.push(`=== BẢNG THỰC ĐƠN TRANG: ${sheetName} (NHÀ CUNG CẤP: ${sheetVendor.name}) ===`);
    } else {
      fullTextLines.push(`=== BẢNG THỰC ĐƠN TRANG: ${sheetName} ===`);
    }

    // Convert sheet to 2D array
    const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, raw: false, defval: '' });

    let activeDay = 'Thứ 2';
    let activeShift: MealShift = 'Bữa sáng';
    let activeMeat: string[] = [];
    let activeVeg: string[] = [];
    let activeMeatDessert = '';
    let activeVegDessert = '';

    const pushActiveMenu = () => {
      if (activeMeat.length > 0 || activeVeg.length > 0 || activeMeatDessert) {
        extractedMenusList.push({
          vendorId: isTargetLocked ? targetVendorId : currentSheetVendorId,
          dayOfWeek: activeDay,
          dateStr: DAY_DATES[activeDay] || '05/10/2026',
          shift: activeShift,
          meatDishes: activeMeat.map(cleanDishName).filter(Boolean),
          vegDishes: activeVeg.length > 0 ? activeVeg.map(cleanDishName).filter(Boolean) : ['Cơm trắng', 'Món chay thanh đạm'],
          meatDessert: cleanDishName(activeMeatDessert || 'Trái cây theo mùa'),
          vegDessert: cleanDishName(activeVegDessert || activeMeatDessert || 'Trái cây theo mùa'),
          isWeighedOk: true,
        });
      }
      activeMeat = [];
      activeVeg = [];
      activeMeatDessert = '';
      activeVegDessert = '';
    };

    rows.forEach((row) => {
      if (!Array.isArray(row)) return;
      const cells = row.map((cell) => String(cell || '').trim());
      const rowJoined = cells.filter(Boolean).join(' | ');
      if (!rowJoined) return;

      fullTextLines.push(rowJoined);

      // Check for row-level vendor only if NOT locked to a specific target vendor
      if (!isTargetLocked) {
        const rowVendor = detectVendorFromCellText(rowJoined);
        if (rowVendor) {
          detectedVendorsMap.set(rowVendor.id, rowVendor);
          currentSheetVendorId = rowVendor.id;
        }
      }

      // Check for day
      for (const cell of cells) {
        const foundDay = normalizeDay(cell);
        if (foundDay) {
          pushActiveMenu();
          activeDay = foundDay;
          break;
        }
      }

      // Check for shift
      for (const cell of cells) {
        const foundShift = normalizeShift(cell);
        if (foundShift) {
          pushActiveMenu();
          activeShift = foundShift;
          break;
        }
      }

      // Check for dishes in cell contents
      cells.forEach((cell) => {
        if (!cell) return;
        const lowerCell = cell.toLowerCase();

        // Skip headers
        if (lowerCell.includes('thứ') || lowerCell.includes('ngày') || lowerCell.includes('thực đơn') || lowerCell.includes('lán trại') || lowerCell.includes('stt')) {
          return;
        }

        if (lowerCell.includes('tráng miệng') || lowerCell.includes('tm:') || lowerCell.includes('trái cây')) {
          const val = cell.replace(/.*?(tráng miệng|tm|trái cây)[:\-\s]*/i, '').trim();
          if (val) {
            if (lowerCell.includes('chay')) activeVegDessert = val;
            else activeMeatDessert = val;
          }
        } else if (lowerCell.includes('chay:') || lowerCell.includes('món chay')) {
          const val = cell.replace(/.*?(chay|món chay)[:\-\s]*/i, '').trim();
          if (val) activeVeg.push(...val.split(/[,;\-\+]/).map((s) => s.trim()));
        } else if (lowerCell.includes('mặn:') || lowerCell.includes('món mặn')) {
          const val = cell.replace(/.*?(mặn|món mặn)[:\-\s]*/i, '').trim();
          if (val) activeMeat.push(...val.split(/[,;\-\+]/).map((s) => s.trim()));
        } else if (cell.length > 3 && !cell.includes('|') && !normalizeDay(cell) && !normalizeShift(cell)) {
          // Regular dish cell
          activeMeat.push(...cell.split(/[,;\-\+]/).map((s) => s.trim()));
        }
      });
    });

    pushActiveMenu();
  });

  const rawTextSummary = fullTextLines.join('\n');
  const detectedList = Array.from(detectedVendorsMap.values());
  const primaryVendor = detectedList[0] || { id: 'tam-phuong', name: 'Tám Phương', code: 'TP' };

  // Detailed raw key-value pairs extracted from Excel headers & metadata for diagnostic verification
  const rawKeyValuePairs: Record<string, string> = {
    'Tên tệp Excel (Filename)': file.name,
    'Kích thước tệp (File Size)': `${(file.size / 1024).toFixed(1)} KB`,
    'Chế độ chỉ định NCC (Target Vendor Lock)': targetVendorId !== 'auto' ? `ĐÃ KHÓA CỨNG (${targetVendorId})` : 'TỰ ĐỘNG NHẬN DIỆN',
    'Danh sách trang tính (Excel Sheets)': workbook.SheetNames.join(', '),
    'Số lượng trang tính (Sheet Count)': String(workbook.SheetNames.length),
    'Header Dòng 1 (Excel Row 1)': fullTextLines[1] || 'None',
    'Header Dòng 2 (Excel Row 2)': fullTextLines[2] || 'None',
    'Header Dòng 3 (Excel Row 3)': fullTextLines[3] || 'None',
    'Nhà cung cấp khớp từ Header': primaryVendor.name + ` (Mã: ${primaryVendor.code})`,
    'Tất cả NCC tìm thấy từ từ khóa Header': detectedList.map((v) => `${v.name} [${v.code}]`).join(', ') || 'Chưa phát hiện từ khóa riêng',
    'Tổng số dòng dữ liệu đọc được': `${fullTextLines.length} dòng`,
    'Tổng số ca ăn bóc tách thành công': `${extractedMenusList.length} ca`,
  };

  // Add sheet-specific raw header snippets into key-value pairs
  workbook.SheetNames.forEach((sName, idx) => {
    const sheetVendor = detectVendorFromCellText(sName);
    rawKeyValuePairs[`Trang tính ${idx + 1} (${sName})`] = sheetVendor
      ? `Khớp NCC: ${sheetVendor.name} [${sheetVendor.code}]`
      : 'Không chứa từ khóa NCC';
  });

  return {
    vendorName: detectedList.length > 1
      ? `Tổng hợp ${detectedList.length} Nhà Cung Cấp (${detectedList.map((v) => v.name).join(', ')})`
      : primaryVendor.name,
    vendorId: detectedList.length > 1 ? 'all' : primaryVendor.id,
    detectedVendors: detectedList,
    menus: extractedMenusList,
    rawTextSummary,
    diagnosticMetadata: {
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      fileType: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      sheetNames: workbook.SheetNames,
      headerTitles: fullTextLines.slice(0, 5),
      detectedVendorHeaders: detectedList.map((v) => ({ text: v.name, vendorId: v.id, vendorName: v.name })),
      totalRowsParsed: fullTextLines.length,
      rawKeyValuePairs,
      isTargetLocked: targetVendorId !== 'auto' && targetVendorId !== 'all',
      targetVendorId,
    }
  };
};
