export type ItemCategory = 'man' | 'chay' | 'trang_mieng' | 'canh' | 'com' | 'rau' | 'khac';
export type NormalizedShift = 'sang' | 'trua' | 'toi';

export interface ParsedDishItem {
  category: ItemCategory;
  name: string;
  qty: number | null;
  unit: 'g' | 'ml' | 'cai' | 'trai' | null;
  qty_options: number[] | null;
  confidence: number;
}

export interface NormalizedShiftData {
  shift: NormalizedShift;
  items: ParsedDishItem[];
}

export interface NormalizedDayData {
  date: string | null; // ISO YYYY-MM-DD
  weekday: string;     // 'Thứ 2' .. 'Chủ nhật'
  shifts: NormalizedShiftData[];
}

export interface NormalizedMenuSchema {
  supplier_detected: string | null;
  week_start: string | null; // YYYY-MM-DD
  days: NormalizedDayData[];
  warnings: string[];
}

export const ACTIVE_WEEK_START = '2026-10-05';
export const ACTIVE_WEEK_END = '2026-10-11';

export const DAY_OF_WEEK_MAP: Record<string, string> = {
  'Thứ 2': '2026-10-05',
  'Thứ 3': '2026-10-06',
  'Thứ 4': '2026-10-07',
  'Thứ 5': '2026-10-08',
  'Thứ 6': '2026-10-09',
  'Thứ 7': '2026-10-10',
  'Chủ nhật': '2026-10-11',
};

export const REVERSE_DAY_MAP: Record<string, string> = {
  '2026-10-05': 'Thứ 2',
  '2026-10-06': 'Thứ 3',
  '2026-10-07': 'Thứ 4',
  '2026-10-08': 'Thứ 5',
  '2026-10-09': 'Thứ 6',
  '2026-10-10': 'Thứ 7',
  '2026-10-11': 'Chủ nhật',
};

/**
 * Normalizes Vietnamese text: NFC Unicode, trim, single spaces, proper capitalization
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  let clean = str.normalize('NFC').trim();
  clean = clean.replace(/\s+/g, ' ');
  if (!clean) return '';

  // Clean trailing and leading punctuation
  clean = clean.replace(/^[-*•.,;:+/]+\s*/, '').replace(/[,;.\-+:]+$/, '').trim();

  // Fix capitalization if all caps or all lowercase
  const isUpper = clean === clean.toUpperCase();
  const isLower = clean === clean.toLowerCase();
  if (isUpper || isLower) {
    clean = clean.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
  } else {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean;
}

/**
 * Standardize measurement units:
 * gr/gram/g -> 'g'
 * ml/l/lít -> 'ml'
 * cái/hũ/hộp/chén/ổ/suất/tô/ly -> 'cai'
 * trái/quả -> 'trai'
 */
export function standardizeUnit(unitStr: string | null): 'g' | 'ml' | 'cai' | 'trai' | null {
  if (!unitStr) return null;
  const u = unitStr.toLowerCase().trim();
  if (['g', 'gr', 'gram', 'grams', 'gam'].includes(u)) return 'g';
  if (['ml', 'mll', 'l', 'lit', 'lít'].includes(u)) return 'ml';
  if (['cái', 'cai', 'hũ', 'hu', 'hộp', 'hop', 'chén', 'chen', 'ổ', 'o', 'suất', 'suat', 'tô', 'to', 'ly'].includes(u)) return 'cai';
  if (['trái', 'trai', 'quả', 'qua'].includes(u)) return 'trai';
  return null;
}

/**
 * Categorize a dish based on keywords and defaults
 */
export function categorizeDish(text: string, defaultCat: ItemCategory = 'man'): ItemCategory {
  const lower = text.normalize('NFC').toLowerCase();
  
  if (lower.includes('chay') || lower.includes('đậu hũ chay') || lower.includes('sườn non chay') || lower.includes('nấm kho')) {
    return 'chay';
  }
  if (
    lower.includes('tráng miệng') || lower.includes('tm:') || lower.includes('trái cây') ||
    lower.includes('dưa hấu') || lower.includes('chuối') || lower.includes('ổi') ||
    lower.includes('táo') || lower.includes('sữa chua') || lower.includes('sữa đậu nành') ||
    lower.includes('thạch rau câu') || lower.includes('quýt') || lower.includes('thanh long') ||
    lower.includes('cam sành') || lower.includes('nước sâm') || lower.includes('chè')
  ) {
    return 'trang_mieng';
  }
  if (lower.includes('canh') || lower.includes('súp') || lower.includes('sup')) {
    return 'canh';
  }
  if (lower.includes('cơm trắng') || lower.includes('cơm chiên') || lower.includes('cơm gạo lứt')) {
    return 'com';
  }
  if (lower.includes('rau') || lower.includes('dưa leo') || lower.includes('xà lách') || lower.includes('cải thìa') || lower.includes('bầu luộc')) {
    return 'rau';
  }
  return defaultCat;
}

/**
 * Parse a raw dish string into structured dish details:
 * e.g. "ĐẬU HŨ KHO TIÊU, 100gr" -> name: "Đậu hũ kho tiêu", qty: 100, unit: "g"
 * e.g. "Cơm trắng, 280, 300 gram" -> name: "Cơm trắng", qty_options: [280, 300], unit: "g"
 * e.g. "Phở áp chảo bò (200g)" -> name: "Phở áp chảo bò", qty: 200, unit: "g"
 * e.g. "Dưa hấu (1 miếng)" -> name: "Dưa hấu", qty: 1, unit: "cai"
 */
export function parseDishString(raw: string, defaultCategory: ItemCategory = 'man'): ParsedDishItem {
  if (!raw || !raw.trim()) {
    return { category: defaultCategory, name: '', qty: null, unit: null, qty_options: null, confidence: 1.0 };
  }

  let text = raw.normalize('NFC').trim();

  // Categorize first
  const category = categorizeDish(text, defaultCategory);

  // Strip category labels e.g. "Món mặn:", "Chay:", "TM:", "Món 1:"
  text = text.replace(/^(món mặn|món chay|chay|mặn|tráng miệng|tm|món \d+|món đạm)\s*[:\-]\s*/i, '').trim();

  let qty_options: number[] | null = null;
  let qty: number | null = null;
  let unit: 'g' | 'ml' | 'cai' | 'trai' | null = null;

  // Case 1: Multiple quantities like "280, 300 gram" or "280-300g" or "280/300gr"
  const multiQtyRegex = /(?:,|\s|\()(\d{2,4})\s*(?:,|\/|-|\s+đến\s+)\s*(\d{2,4})\s*(gr|gram|grams|g|ml|cái|trái|hũ|hộp)?\)?/i;
  const multiMatch = text.match(multiQtyRegex);

  if (multiMatch) {
    const q1 = parseInt(multiMatch[1], 10);
    const q2 = parseInt(multiMatch[2], 10);
    if (!isNaN(q1) && !isNaN(q2)) {
      qty_options = [q1, q2];
      qty = q1;
      unit = standardizeUnit(multiMatch[3] || 'g');
      text = text.replace(multiMatch[0], ' ').trim();
    }
  } else {
    // Case 2: Parenthesized quantity e.g. "(100gr)", "(1 hũ)", "(Phở: 200g)"
    const parenQtyRegex = /\(\s*(?:[\w\s]+:\s*)?(\d+(?:[.,]\d+)?)\s*(gr|gram|g|ml|cái|cai|trái|trai|hũ|hộp|chén|miếng)?\s*\)/i;
    const parenMatch = text.match(parenQtyRegex);
    if (parenMatch) {
      const num = parseFloat(parenMatch[1].replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        qty = num;
        unit = standardizeUnit(parenMatch[2] || 'g');
        text = text.replace(parenMatch[0], ' ').trim();
      }
    } else {
      // Case 3: Trailing quantity e.g. ", 100gr" or " 100g" or " 1 trái"
      const trailingQtyRegex = /(?:,\s*|\s+)(\d+(?:[.,]\d+)?)\s*(gr|gram|g|ml|cái|cai|trái|trai|hũ|hộp|miếng|chén)\b/i;
      const trailMatch = text.match(trailingQtyRegex);
      if (trailMatch) {
        const num = parseFloat(trailMatch[1].replace(',', '.'));
        if (!isNaN(num) && num > 0) {
          qty = num;
          unit = standardizeUnit(trailMatch[2] || 'g');
          text = text.replace(trailMatch[0], ' ').trim();
        }
      }
    }
  }

  // Remove leftover empty parentheses or extra specification parentheses e.g. "(Phở bò)"
  text = text.replace(/\(\s*\)/g, ' ').trim();
  text = normalizeVietnameseText(text);

  // If text became empty because string was pure weight "100gr"
  if (!text && raw.trim()) {
    text = normalizeVietnameseText(raw.trim());
  }

  return {
    category,
    name: text,
    qty,
    unit,
    qty_options,
    confidence: text && text.length >= 2 ? 0.95 : 0.6,
  };
}

/**
 * Format a ParsedDishItem into a clean display dish string:
 * "Tên món (định lượng)" or "Tên món"
 */
export function formatDishDisplay(item: ParsedDishItem): string {
  if (!item.name) return '';
  const cleanName = normalizeVietnameseText(item.name);
  if (item.qty_options && item.qty_options.length > 0) {
    return `${cleanName} (${item.qty_options.join(', ')}${item.unit || 'g'})`;
  }
  if (item.qty && item.qty > 0) {
    return `${cleanName} (${item.qty}${item.unit || 'g'})`;
  }
  return cleanName;
}

/**
 * Standardizes raw menu objects into NormalizedMenuSchema
 */
export function normalizeMenuData(
  rawInput: any,
  selectedWeekStart: string = ACTIVE_WEEK_START
): NormalizedMenuSchema {
  const warnings: string[] = [];

  const supplier = rawInput?.supplier_detected || rawInput?.vendorName || rawInput?.vendorId || null;
  const weekStart = rawInput?.week_start || selectedWeekStart;

  if (weekStart && weekStart !== selectedWeekStart) {
    warnings.push(`Tuần thực đơn trong file (${weekStart}) khác với tuần báo cáo đang chọn (${selectedWeekStart}).`);
  }

  const days: NormalizedDayData[] = [];
  const rawDays = Array.isArray(rawInput?.days) ? rawInput.days : [];

  const standardWeekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  standardWeekdays.forEach((dayName) => {
    const expectedDate = DAY_OF_WEEK_MAP[dayName] || null;
    const foundRawDay = rawDays.find((d: any) => d.weekday === dayName || d.dayOfWeek === dayName);

    const shiftDataList: NormalizedShiftData[] = [
      { shift: 'sang', items: [] },
      { shift: 'trua', items: [] },
      { shift: 'toi', items: [] },
    ];

    if (foundRawDay && Array.isArray(foundRawDay.shifts)) {
      foundRawDay.shifts.forEach((s: any) => {
        let shiftKey: NormalizedShift = 'sang';
        const rawShiftName = String(s.shift || '').toLowerCase();
        if (rawShiftName.includes('trưa') || rawShiftName.includes('trua') || rawShiftName === 'chính' || rawShiftName === 'bữa trưa') shiftKey = 'trua';
        else if (rawShiftName.includes('tối') || rawShiftName.includes('toi') || rawShiftName === 'tăng ca' || rawShiftName === 'bữa tối') shiftKey = 'toi';

        const shiftObj = shiftDataList.find((sh) => sh.shift === shiftKey);
        if (shiftObj && Array.isArray(s.items)) {
          s.items.forEach((item: any) => {
            if (typeof item === 'string') {
              const parsed = parseDishString(item);
              if (parsed.name) shiftObj.items.push(parsed);
            } else if (item && typeof item === 'object') {
              const parsed = parseDishString(item.name || '', item.category || 'man');
              if (item.qty) parsed.qty = item.qty;
              if (item.unit) parsed.unit = standardizeUnit(item.unit);
              if (item.qty_options) parsed.qty_options = item.qty_options;
              if (item.confidence !== undefined) parsed.confidence = item.confidence;
              if (parsed.name) shiftObj.items.push(parsed);
            }
          });
        }
      });
    }

    days.push({
      date: expectedDate,
      weekday: dayName,
      shifts: shiftDataList,
    });
  });

  return {
    supplier_detected: supplier,
    week_start: weekStart,
    days,
    warnings,
  };
}

/**
 * Converts NormalizedMenuSchema directly into DayShiftMenu[] format for application state
 */
export function normalizedMenuToDayShiftMenus(
  schema: NormalizedMenuSchema,
  vendorId: string
): any[] {
  const menus: any[] = [];
  const shiftNameMap: Record<NormalizedShift, string> = {
    sang: 'Bữa sáng',
    trua: 'Bữa trưa',
    toi: 'Bữa tối',
  };

  schema.days.forEach((day) => {
    day.shifts.forEach((s) => {
      const meatDishes: string[] = [];
      const vegDishes: string[] = [];
      let meatDessert = '';
      let vegDessert = '';

      s.items.forEach((item) => {
        const dishStr = formatDishDisplay(item);
        if (!dishStr) return;

        if (item.category === 'chay') {
          vegDishes.push(dishStr);
        } else if (item.category === 'trang_mieng') {
          if (!meatDessert) meatDessert = dishStr;
          if (!vegDessert) vegDessert = dishStr;
        } else {
          // man, canh, com, rau, khac
          meatDishes.push(dishStr);
        }
      });

      // Default vegetarian alternative for breakfast if empty
      if (s.shift === 'sang' && meatDishes.length > 0 && vegDishes.length === 0) {
        vegDishes.push(`${meatDishes[0]} (chay)`);
      }

      menus.push({
        vendorId,
        dayOfWeek: day.weekday,
        dateStr: day.date ? day.date.split('-').reverse().join('/') : (DAY_OF_WEEK_MAP[day.weekday] ? DAY_OF_WEEK_MAP[day.weekday].split('-').reverse().join('/') : '05/10/2026'),
        shift: shiftNameMap[s.shift] || 'Bữa sáng',
        meatDishes,
        vegDishes: vegDishes.length > 0 ? vegDishes : ['Cơm trắng', 'Món chay thanh đạm'],
        meatDessert: meatDessert || 'Trái cây theo mùa',
        vegDessert: vegDessert || meatDessert || 'Trái cây theo mùa',
        isWeighedOk: true,
      });
    });
  });

  return menus;
}
