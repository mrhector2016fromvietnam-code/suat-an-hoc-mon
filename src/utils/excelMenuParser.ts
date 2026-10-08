import { parseMenuWorkbook, toGrid, formatPortions, SUPPLIERS, matchSupplier } from '../lib/parseMenuExcel.js';
import { DayShiftMenu, MealShift } from '../types/report';
import { MenuRecord, MenuRecordItem } from '../components/ExtractionPreviewModal';

export const VENDOR_ID_TO_CODE: Record<string, string> = {
  'tam-phuong': 'TP',
  'lim-duong': 'LD',
  'minh-long-food': 'ML',
  'nguyen-sai-gon': 'NS',
  'huong-ngoc-phat': 'HN',
  'thien-hong-phuc': 'TH',
  'vina-story': 'VS',
};

export const VENDOR_CODE_TO_ID: Record<string, string> = {
  TP: 'tam-phuong',
  LD: 'lim-duong',
  ML: 'minh-long-food',
  NS: 'nguyen-sai-gon',
  HN: 'huong-ngoc-phat',
  TH: 'thien-hong-phuc',
  VS: 'vina-story',
};

/**
 * Formats YYYY-MM-DD week start into "DD/MM – DD/MM/YYYY" display string
 */
export function formatWeekIsoToDisplay(weekStartIso: string): string {
  if (!weekStartIso) return '';
  const d = new Date(`${weekStartIso}T00:00:00Z`);
  if (isNaN(d.getTime())) return weekStartIso;
  const startDay = String(d.getUTCDate()).padStart(2, '0');
  const startMonth = String(d.getUTCMonth() + 1).padStart(2, '0');
  d.setUTCDate(d.getUTCDate() + 6);
  const endDay = String(d.getUTCDate()).padStart(2, '0');
  const endMonth = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${startDay}/${startMonth} – ${endDay}/${endMonth}/${year}`;
}

/**
 * Step 2 requirement: File .xlsx/.xls/.ods ONLY passes through parseMenuWorkbook
 */
export async function parseExcelMenuFile(
  file: File,
  targetVendorId: string = 'auto',
  weekStart: string = '2026-10-05'
) {
  const buf = await file.arrayBuffer();
  const targetCode = targetVendorId !== 'auto' && targetVendorId !== 'all' ? VENDOR_ID_TO_CODE[targetVendorId] : undefined;

  const res = parseMenuWorkbook(buf, file.name, {
    supplierId: targetCode,
    weekStart,
  });

  // Step 3: Debug logging immediately after parse
  console.log('[PARSE]', res.stats, res.records.length, res.weeksFound, res.warnings);

  return res;
}

export function normalizeDayOfWeek(raw: string, index?: number): string {
  const s = String(raw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (s.includes('2') || s.includes('hai')) return 'Thứ 2';
  if (s.includes('3') || s.includes('ba')) return 'Thứ 3';
  if (s.includes('4') || s.includes('tu')) return 'Thứ 4';
  if (s.includes('5') || s.includes('nam')) return 'Thứ 5';
  if (s.includes('6') || s.includes('sau')) return 'Thứ 6';
  if (s.includes('7') || s.includes('bay')) return 'Thứ 7';
  if (s.includes('chu') || s.includes('nhat') || s.includes('cn')) return 'Chủ nhật';
  if (index !== undefined && index >= 0 && index <= 6) {
    return ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'][index];
  }
  return 'Thứ 2';
}

export function normalizeShift(raw: string): MealShift {
  const s = String(raw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (s.includes('sang')) return 'Bữa sáng';
  if (s.includes('trua')) return 'Bữa trưa';
  return 'Bữa tối';
}

/**
 * Converts parsed MenuRecords directly into DayShiftMenu[] for the entire system
 */
export function recordsToDayShiftMenus(records: MenuRecord[], vendorId: string): DayShiftMenu[] {
  const g: Record<string, Record<string, { man: MenuRecordItem[]; chay: MenuRecordItem[]; trangMieng: MenuRecordItem[] }>> = toGrid(records);
  const result: DayShiftMenu[] = [];

  const shiftNameMap: Record<'sang' | 'trua' | 'toi', MealShift> = {
    sang: 'Bữa sáng',
    trua: 'Bữa trưa',
    toi: 'Bữa tối',
  };

  const dates = Object.keys(g).sort();
  for (const d of dates) {
    const dayData = g[d];
    const sampleRec = records.find((r) => r.date === d);
    const dayOfWeek = normalizeDayOfWeek(sampleRec?.weekday || '', sampleRec?.weekdayIndex);

    // Format dateStr DD/MM/YYYY
    const parts = d.split('-');
    const dateStr = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;

    for (const shiftKey of ['sang', 'trua', 'toi'] as const) {
      const shiftCell = dayData?.[shiftKey];
      if (!shiftCell) continue;

      const gramWeights: Record<string, string> = {};

      const formatDishForApp = (item: MenuRecordItem): string => {
        const portionStr = formatPortions(item) || item.rawWeight;
        if (portionStr) {
          gramWeights[item.name] = portionStr;
          return `${item.name} (${portionStr})`;
        }
        return item.name;
      };

      const meatDishes: string[] = [];
      (shiftCell.man || []).forEach((item: MenuRecordItem) => {
        meatDishes.push(formatDishForApp(item));
      });

      const vegDishes: string[] = [];
      (shiftCell.chay || []).forEach((item: MenuRecordItem) => {
        vegDishes.push(formatDishForApp(item));
      });

      let meatDessert = '';
      if (shiftCell.trangMieng && shiftCell.trangMieng.length > 0) {
        meatDessert = shiftCell.trangMieng.map((i: MenuRecordItem) => formatDishForApp(i)).join(', ');
      }

      let vegDessert = shiftCell.trangMieng && shiftCell.trangMieng.length > 0
        ? shiftCell.trangMieng.map((i: MenuRecordItem) => formatDishForApp(i)).join(', ')
        : meatDessert;

      result.push({
        vendorId,
        dayOfWeek,
        dateStr,
        shift: shiftNameMap[shiftKey],
        meatDishes,
        meatDessert,
        vegDishes,
        vegDessert,
        gramWeights,
        isWeighedOk: true,
      });
    }
  }

  return result;
}

export { toGrid, formatPortions, parseMenuWorkbook, SUPPLIERS, matchSupplier };
