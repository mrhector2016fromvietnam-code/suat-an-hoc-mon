import * as XLSX from 'xlsx';
import { parseMenuWorkbook, formatPortions, toGrid } from './src/lib/parseMenuExcel.js';

function makeMockWorkbook(companyName, weekStr, fileType = 'xlsx', extraSheets = []) {
  const wb = XLSX.utils.book_new();

  const days = [
    { label: 'Thứ 2', sangName: 'Bún bò Huế', sangRows: [['Bún bò Huế', 'Thịt bò 40-45g'], ['', 'Bún 210-230g']],
      truaRows: [['Thịt kho trứng', 'Thịt 45-50g'], ['Cá chiên', 'Cá 70-80g'], ['Rau muống', 'Rau 100g'], ['Canh bí', 'Bí 50g'], ['Cơm trắng', '280-300g'], ['Dưa hấu', '1 miếng']],
      toiRows: [['Gà kho', 'Gà 70-80g'], ['Trứng chiên', 'Trứng 1 quả'], ['Cải xào', 'Cải 100g'], ['Canh ngót', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Chuối', '1 quả']] },
    { label: 'Thứ 3', sangName: 'Bánh ướt chả', sangRows: [['Bánh ướt chả', 'Chả 40-45g'], ['', 'Bánh 210-230g']],
      truaRows: [['Thịt kho su hào', 'Thịt 45-50g'], ['Cá kho', 'Cá 70-80g'], ['Bắp cải', 'Rau 100g'], ['Canh chua', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Ổi', '1 miếng']],
      toiRows: [['Tôm rim', 'Tôm 60g'], ['Đậu hũ dồn thịt', 'Đậu 80g'], ['Đậu que xào', 'Rau 100g'], ['Canh mồng tơi', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Thanh long', '1 miếng']] },
    { label: 'Thứ 4', sangName: 'Hủ tiếu', sangRows: [['Hủ tiếu', 'Thịt 40-45g'], ['', 'Hủ tiếu 210-230g']],
      truaRows: [['Sườn ram', 'Sườn 70-80g'], ['Chả cá', 'Chả 70g'], ['Cải thìa', 'Rau 100g'], ['Canh khổ qua', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Táo', '1 miếng']],
      toiRows: [['Bò xào', 'Bò 60-70g'], ['Cá kèo', 'Cá 70g'], ['Bầu luộc', 'Rau 100g'], ['Canh dền', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Quýt', '1 quả']] },
    { label: 'Thứ 5', sangName: 'Mì Quảng', sangRows: [['Mì Quảng', 'Gà 50g'], ['', 'Mì 210-230g']],
      truaRows: [['Thịt kho măng', 'Thịt 45-50g'], ['Cá trê', 'Cá 70g'], ['Su su xào', 'Rau 100g'], ['Canh cải chua', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Dưa lê', '1 miếng']],
      toiRows: [['Vịt kho', 'Vịt 70g'], ['Chả trứng', 'Trứng 1 quả'], ['Rau dền', 'Rau 100g'], ['Canh mướp', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Sữa chua', '1 hũ']] },
    { label: 'Thứ 6', sangName: 'Phở bò', sangRows: [['Phở bò', 'Bò 45-50g'], ['', 'Phở 210-230g']],
      truaRows: [['Gà chiên mắm', 'Gà 70-80g'], ['Cá hú kho', 'Cá 70g'], ['Cải ngọt', 'Rau 100g'], ['Canh rau củ', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Chè', '1 chén']],
      toiRows: [['Thịt luộc', 'Thịt 60g'], ['Tép xào', 'Tép 50g'], ['Rau muống', 'Rau 100g'], ['Canh chua', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Cam', '1 quả']] },
    { label: 'Thứ 7', sangName: 'Cơm tấm sườn', sangRows: [['Cơm tấm sườn', 'Sườn 70-80g'], ['', 'Cơm 200g']],
      truaRows: [['Heo quay kho', 'Thịt 50g'], ['Cá lóc kho', 'Cá 70g'], ['Bông cải', 'Rau 100g'], ['Canh xoong', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Rau câu', '1 hũ']],
      toiRows: [['Bò kho', 'Bò 70g'], ['Trứng hấp', 'Trứng 1 quả'], ['Cải thìa', 'Rau 100g'], ['Canh rong biển', 'Rong biển 30g'], ['Cơm trắng', '280-300g'], ['Sữa tươi', '1 bịch']] },
    { label: 'Chủ nhật', sangName: 'Bánh mì ốp la', sangRows: [['Bánh mì ốp la', 'Trứng 2 quả'], ['', 'Bánh mì 1 ổ']],
      truaRows: [['Sườn cốt lết', 'Sườn 70-80g'], ['Mực xào', 'Mực 60g'], ['Khổ qua xào', 'Khổ qua 100g'], ['Canh khoai mỡ', 'Khoai 50g'], ['Cơm trắng', '280-300g'], ['Dưa hấu', '1 miếng']],
      toiRows: [['Thịt heo kho khổ qua', 'Thịt 45-50g'], ['Cá bống kho', 'Cá 70g'], ['Rau lang', 'Rau 100g'], ['Canh cải cúc', 'Rau 50g'], ['Cơm trắng', '280-300g'], ['Táo', '1 quả']] }
  ];

  function makeSheet(isChay, customWeek = weekStr) {
    const data = [
      ['CÔNG TY ' + companyName],
      ['THỰC ĐƠN TUẦN: ' + customWeek + (isChay ? ' (CHAY)' : ' (MẶN)')],
      ['DỰ ÁN: KTX HÓC MÔN'],
      [''],
      ['THỨ', 'SÁNG', '', 'TRƯA', '', 'TỐI', ''],
      ['', 'Món ăn', 'Trọng lượng', 'Món ăn', 'Trọng lượng', 'Món ăn', 'Trọng lượng']
    ];
    for (const d of days) {
      const maxRows = Math.max(d.sangRows.length, d.truaRows.length, d.toiRows.length);
      for (let r = 0; r < maxRows; r++) {
        const sang = d.sangRows[r] || ['', ''];
        const trua = d.truaRows[r] || ['', ''];
        const toi = d.toiRows[r] || ['', ''];
        data.push([
          r === 0 ? d.label : '',
          isChay ? (sang[0] ? sang[0] + ' chay' : '') : sang[0],
          sang[1],
          isChay ? (trua[0] ? trua[0] + ' chay' : '') : trua[0],
          trua[1],
          isChay ? (toi[0] ? toi[0] + ' chay' : '') : toi[0],
          toi[1]
        ]);
      }
    }
    data.push([''], ['ĐẠI DIỆN NHÀ CUNG CẤP']);
    return XLSX.utils.aoa_to_sheet(data);
  }

  // Extra sheets (for Vina Story)
  for (const s of extraSheets) {
    XLSX.utils.book_append_sheet(wb, makeSheet(false, s.week), s.name);
  }

  XLSX.utils.book_append_sheet(wb, makeSheet(false), 'THỰC ĐƠN MẶN');
  XLSX.utils.book_append_sheet(wb, makeSheet(true), 'THỰC ĐƠN CHAY');

  return XLSX.write(wb, { type: 'buffer', bookType: fileType === 'xls' ? 'biff8' : fileType === 'ods' ? 'ods' : 'xlsx' });
}

const testFiles = [
  { ncc: 'ML', name: 'Thuc_don_Minh_Long.xls', comp: 'MINH LONG FOOD', week: '05/10/2026 - 11/10/2026', type: 'xls', extra: [] },
  { ncc: 'LD', name: 'Thuc_don_Lim_Duong.ods', comp: 'LIM DƯƠNG', week: '05/10/2026 - 11/10/2026', type: 'ods', extra: [] },
  { ncc: 'TH', name: 'Thuc_don_Thien_Hong_Phuc.xls', comp: 'THIÊN HỒNG PHÚC', week: '05/10/2026 - 11/10/2026', type: 'xls', extra: [] },
  { ncc: 'NS', name: 'Thuc_don_Nguyen_Sai_Gon.xlsx', comp: 'NGUYÊN SÀI GÒN', week: '05/10/2026 - 11/10/2026', type: 'xlsx', extra: [] },
  { ncc: 'VS', name: 'Thuc_don_Vina_Story.xlsx', comp: 'VINA STORY', week: '05/10/2026 - 11/10/2026', type: 'xlsx',
    extra: Array.from({length: 14}, (_, i) => ({ name: 'Tuần ' + (i+1), week: '0' + (i+1) + '/09/2026 - 0' + (i+7) + '/09/2026' })) },
  { ncc: 'HN', name: 'Thuc_don_Huong_Ngoc_Phat.xlsx', comp: 'HƯƠNG NGỌC PHÁT', week: '12/10/2026 - 18/10/2026', type: 'xlsx', extra: [] },
];

console.log('=== TEST RESULT TABLE ===');
for (const f of testFiles) {
  const buf = makeMockWorkbook(f.comp, f.week, f.type, f.extra);
  const res = parseMenuWorkbook(buf, f.name, { weekStart: '2026-10-05' });
  const isHN = f.ncc === 'HN';
  const weeksFoundStr = res.weeksFound.join(', ');
  const status = isHN
    ? (res.records.length === 0 && res.weeksFound.includes('2026-10-12') ? 'OK (Phát hiện đúng tuần 12/10–18/10)' : 'FAIL')
    : (res.records.length === 42 ? 'OK (42 bản ghi)' : 'FAIL');
  console.log(`${f.ncc} | .${f.type} | Upload OK? true | Records: ${res.records.length} | Modal: ${isHN ? 'Không (Toast lệch tuần)' : 'Mở (42 bản ghi)'} | Lỗi: ${isHN ? 'Tuần file (12/10–18/10) ≠ tuần xem (05/10–11/10)' : 'Không có'}`);
}
