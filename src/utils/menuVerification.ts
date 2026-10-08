import * as XLSX from 'xlsx';
import { parseMenuWorkbook, toGrid, formatPortions } from '../lib/parseMenuExcel.js';
import { recordsToDayShiftMenus } from './excelMenuParser';
import { DayShiftMenu } from '../types/report';
import { MenuRecord, MenuRecordItem } from '../components/ExtractionPreviewModal';

export function makeExactTamPhuongWorkbook() {
  const wb = XLSX.utils.book_new();

  const makeSheet = (isChay: boolean) => {
    const rows = [
      ['CÔNG TY TNHH SUẤT ĂN CÔNG NGHIỆP TÁM PHƯƠNG'],
      ['THỰC ĐƠN ' + (isChay ? 'CHAY ' : '') + 'TUẦN: 05/10/2026 - 11/10/2026', '', '', '', '', '', '', 'DỰ ÁN: KÝ TÚC XÁ HÓC MÔN'],
      ['', 'SÁNG', '', 'TRƯA', '', 'TỐI', ''],
      ['Thứ', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng']
    ];

    // Thứ 2: 05/10
    rows.push(
      ['Thứ 2', isChay ? 'Bún xào chay' : 'Bún thịt xào', isChay ? 'Đậu hũ 40-45g' : 'Thịt heo 40-45g', isChay ? 'Đậu hũ kho nấm' : 'Thịt kho trứng cút', '45-50g, 1 quả', isChay ? 'Sườn non chay ram mặn' : 'Sườn heo ram củ cải', '45-50g'],
      ['', '', 'Cà rốt,cải, giá 25-30g', isChay ? 'Chả lụa chay chiên' : 'Cá basa chiên sả', '60g', isChay ? 'Nấm xào sả' : 'Cá nục chiên rim mắm', '60g'],
      ['', '', 'Bún 210-230g', isChay ? 'Chả cá chay' : 'Mắm thái', '20-30g', isChay ? 'Mì căn xào' : 'Mắm ruốc', '20g'],
      ['', '', '', isChay ? 'Cải thìa xào tỏi' : 'Cải thìa xào tỏi', '70-80g', isChay ? 'Cải ngọt xào' : 'Cải ngọt xào', '70-80g'],
      ['', '', '', isChay ? 'Canh bí đao chay' : 'Canh bí đao thịt bằm', '150g', isChay ? 'Canh bồ ngót chay' : 'Canh bồ ngót', '150g'],
      ['', '', '', 'Cơm trắng', '280-300g', 'Cơm trắng', '280-300g'],
      ['', '', '', 'Dưa hấu', '1 miếng', 'Ổi', '1 trái']
    );

    // Thứ 3: 06/10
    rows.push(
      ['Thứ 3', isChay ? 'Bánh ướt chay' : 'Bánh ướt chả', isChay ? 'Chả chay 40-45g' : 'Chả lụa+nem 40-45g', isChay ? 'Nấm đùi gà kho' : 'Thịt heo kho su hào', '70-80g', isChay ? 'Sườn chay xào chua ngọt' : 'Sườn xào su su cà rốt', '70-80g'],
      ['', '', 'Xà lách, rau thơm 25-30g', isChay ? 'Đậu hũ sốt cà' : 'Chả trứng hấp ngũ sắc', '70-80g', isChay ? 'Đậu hũ dồn thịt' : 'Đậu hũ nhồi thịt sốt cà', '80g'],
      ['', '', 'Bánh ướt 210-230g', isChay ? 'Chả lụa chay' : 'Chả cá rim mặn', '25-35g', isChay ? 'Chả cá chay' : 'Chả cá kho tiêu', '60g'],
      ['', '', '', isChay ? 'Bắp cải xào' : 'Bắp cải xào', '70-80g', isChay ? 'Rau muống xào' : 'Rau muống xào tỏi', '100g'],
      ['', '', '', isChay ? 'Canh khoai mỡ chay' : 'Canh khoai mỡ', '250ml', isChay ? 'Canh bí xanh chay' : 'Canh bí xanh', '150g'],
      ['', '', '', 'Cơm trắng', '280-300g', 'Cơm trắng', '280-300g'],
      ['', '', '', isChay ? 'Sữa đậu nành' : 'Thạch rau câu', isChay ? '1 bịch' : '90-100g', isChay ? 'Táo' : 'Táo xanh', '1 quả']
    );

    // Thứ 4 to Thứ 7
    for (let dayNum = 4; dayNum <= 7; dayNum++) {
      rows.push(
        ['Thứ ' + dayNum, 'Món sáng Thứ ' + dayNum, 'Thịt 40-45g', 'Món trưa 1', '70-80g', 'Món tối 1', '70-80g'],
        ['', '', 'Rau 25-30g', 'Món trưa 2', '60g', 'Món tối 2', '60g'],
        ['', '', 'Bột/Bún 210-230g', 'Món trưa 3', '30g', 'Món tối 3', '30g'],
        ['', '', '', 'Rau trưa xào', '80g', 'Rau tối xào', '80g'],
        ['', '', '', 'Canh trưa', '150g', 'Canh tối', '150g'],
        ['', '', '', 'Cơm trắng', '280-300g', 'Cơm trắng', '280-300g'],
        ['', '', '', 'Trái cây trưa', '1 phần', 'Trái cây tối', '1 phần']
      );
    }

    // Chủ nhật (11/10)
    rows.push(
      ['Chủ nhật', isChay ? 'Bún bò chay Huế' : 'Bún bò Huế', 'Thịt 40-45g', isChay ? 'Nấm kho gừng' : 'Vịt kho gừng', '70-80g', isChay ? 'Đậu hũ kho khổ qua' : 'Thịt heo kho khổ qua', '45-50g · Khổ qua 40g'],
      ['', '', 'Rau 25-30g', 'Món trưa 2', '60g', 'Cá nục kho cà', '60g'],
      ['', '', 'Bún 210-230g', 'Món trưa 3', '30g', 'Cải thìa xào dầu hào', '60g'],
      ['', '', '', 'Rau trưa xào', '80g', 'Canh rau dền nấu tôm', '150g'],
      ['', '', '', 'Canh trưa', '150g', 'Cơm trắng', '280-300g'],
      ['', '', '', 'Cơm trắng', '280-300g', 'Dưa hấu', '1 miếng'],
      ['', '', '', 'Trái cây trưa', '1 phần', 'Ổi hồng', '1 trái']
    );

    rows.push(['NHÀ CUNG CẤP TÁM PHƯƠNG']);
    return XLSX.utils.aoa_to_sheet(rows);
  };

  XLSX.utils.book_append_sheet(wb, makeSheet(false), 'Thực đơn mặn');
  XLSX.utils.book_append_sheet(wb, makeSheet(true), 'Thực đơn chay');
  return wb;
}

export function verifyRecordsMatchStore(records: MenuRecord[], storeMenus: DayShiftMenu[], vendorId = 'tam-phuong') {
  const grid = toGrid(records);
  const mismatches: any[] = [];

  const shiftMap: Record<string, string> = {
    sang: 'Bữa sáng',
    trua: 'Bữa trưa',
    toi: 'Bữa tối',
  };
  const dayNameMap: Record<string, string> = {
    '2026-10-05': 'Thứ 2',
    '2026-10-06': 'Thứ 3',
    '2026-10-07': 'Thứ 4',
    '2026-10-08': 'Thứ 5',
    '2026-10-09': 'Thứ 6',
    '2026-10-10': 'Thứ 7',
    '2026-10-11': 'Chủ nhật',
  };

  const dates = Object.keys(grid).sort();
  for (const date of dates) {
    const day = dayNameMap[date] || 'Thứ 2';
    for (const shiftKey of ['sang', 'trua', 'toi']) {
      const shiftName = shiftMap[shiftKey];
      const parsedCell = (grid as Record<string, Record<string, { man: MenuRecordItem[]; chay: MenuRecordItem[]; trangMieng: MenuRecordItem[] }>>)[date]?.[shiftKey];
      if (!parsedCell) continue;

      const storeCell = storeMenus.find(
        (m) => m.vendorId === vendorId && m.dayOfWeek === day && m.shift === shiftName
      );
      if (!storeCell) {
        mismatches.push({ date, shift: shiftKey, error: 'Missing in store' });
        continue;
      }

      // 1. Check meat dishes
      const expectedMeatNames = parsedCell.man.map((it: MenuRecordItem) => {
        const portionStr = formatPortions(it) || it.rawWeight;
        return portionStr ? `${it.name} (${portionStr})` : it.name;
      });
      if (JSON.stringify(expectedMeatNames) !== JSON.stringify(storeCell.meatDishes)) {
        mismatches.push({
          date,
          shift: shiftKey,
          type: 'meatDishes',
          expected: expectedMeatNames,
          actual: storeCell.meatDishes,
        });
      }

      // 2. Check veg dishes
      const expectedVegNames = parsedCell.chay.map((it: MenuRecordItem) => {
        const portionStr = formatPortions(it) || it.rawWeight;
        return portionStr ? `${it.name} (${portionStr})` : it.name;
      });
      if (JSON.stringify(expectedVegNames) !== JSON.stringify(storeCell.vegDishes)) {
        mismatches.push({
          date,
          shift: shiftKey,
          type: 'vegDishes',
          expected: expectedVegNames,
          actual: storeCell.vegDishes,
        });
      }

      // 3. Check dessert
      const expectedDessert = parsedCell.trangMieng.map((it: MenuRecordItem) => it.name).join(', ');
      if (expectedDessert !== storeCell.meatDessert) {
        mismatches.push({
          date,
          shift: shiftKey,
          type: 'meatDessert',
          expected: expectedDessert,
          actual: storeCell.meatDessert,
        });
      }
    }
  }

  return mismatches.length === 0 ? 'PASS' : JSON.stringify(mismatches, null, 2);
}
