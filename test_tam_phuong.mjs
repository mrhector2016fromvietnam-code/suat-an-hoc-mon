import * as XLSX from 'xlsx';
import { parseMenuWorkbook, toGrid, formatPortions } from './src/lib/parseMenuExcel.js';

// Build exact Tam Phuong Workbook to test
const wb = XLSX.utils.book_new();

// 1. Sheet mặn
const manRows = [
  ['CÔNG TY TNHH SUẤT ĂN CÔNG NGHIỆP TÁM PHƯƠNG'],
  ['THỰC ĐƠN TUẦN: 05/10/2026 - 11/10/2026', '', '', '', '', '', '', 'DỰ ÁN: KÝ TÚC XÁ HÓC MÔN'],
  ['', 'SÁNG', '', 'TRƯA', '', 'TỐI', ''],
  ['Thứ', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng'],
  // Thứ 2
  ['Thứ 2', 'Bún thịt xào', 'Thịt heo 40-45g', 'Thịt kho trứng cút', 'Thịt 45-50g, Trứng 1 quả', 'Sườn heo ram củ cải', 'Sườn 45-50g'],
  ['', '', 'Rau thơm 25-30g', 'Cá basa chiên sả', 'Cá 60g', 'Cá nục chiên rim mắm', 'Cá 60g'],
  ['', '', 'Bún 210-230g', 'Cải thìa xào tỏi', 'Rau 60g', 'Mắm thái', 'Mắm 20g'],
  ['', '', '', 'Canh bí đao thịt bằm', 'Canh 150g', 'Cải ngọt xào', 'Rau 60g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Canh bồ ngót', 'Canh 150g'],
  ['', '', '', 'Dưa hấu', '1 miếng', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', '', '', 'Ổi', '1 trái'],
  // Thứ 3
  ['Thứ 3', 'Bánh ướt chả', 'Chả lụa+nem 40-45g', 'Thịt heo kho su hào', 'Thịt 45-50g · Su hào 40g', 'Gà kho sả ớt', 'Gà 70-75g'],
  ['', '', 'Xà lách, rau thơm 25-30g', 'Cá lóc kho tiêu', 'Cá 60g', 'Cá điêu hồng chiên xù', 'Cá 60g'],
  ['', '', 'Bánh ướt 210-230g', 'Đậu que xào tỏi', 'Rau 60g', 'Cải thìa luộc', 'Rau 60g'],
  ['', '', '', 'Canh chua cá', 'Canh 150g', 'Canh cải thảo tôm khô', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Chuối laba', '1 trái', 'Thanh long', '1 miếng'],
  // Thứ 4
  ['Thứ 4', 'Hủ tiếu Nam Vang', 'Thịt+tôm 40-45g', 'Bò xào cần tây', 'Bò 45-50g', 'Thịt ba chỉ luộc', 'Thịt 50-55g'],
  ['', '', 'Giá, hẹ 25-30g', 'Trứng chiên thịt bằm', 'Trứng 1 quả', 'Cá trê kho gừng', 'Cá 60g'],
  ['', '', 'Hủ tiếu 210-230g', 'Bí đỏ xào tỏi', 'Rau 60g', 'Rau muống xào tỏi', 'Rau 60g'],
  ['', '', '', 'Canh mồng tơi cua', 'Canh 150g', 'Canh bầu nấu tôm', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Táo xanh', '1 trái', 'Cam sành', '1 miếng'],
  // Thứ 5
  ['Thứ 5', 'Mì Quảng gà', 'Gà 40-45g', 'Sườn non nướng mật ong', 'Sườn 50-55g', 'Thịt kho măng', 'Thịt 45-50g'],
  ['', '', 'Rau sống 25-30g', 'Cá hú kho tộ', 'Cá 60g', 'Tôm rim ba chỉ', 'Tôm+thịt 50g'],
  ['', '', 'Mì Quảng 210-230g', 'Bắp cải xào cà chua', 'Rau 60g', 'Su su xào trứng', 'Rau 60g'],
  ['', '', '', 'Canh rong biển thịt bằm', 'Canh 150g', 'Canh chua rau muống', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Sữa chua', '1 hộp', 'Chè đậu xanh', '1 ly'],
  // Thứ 6
  ['Thứ 6', 'Bánh mì chảo xíu mại', 'Xíu mại 40-45g', 'Gà chiên nước mắm', 'Gà 65-70g', 'Thịt bò xào ớt chuông', 'Bò 45-50g'],
  ['', '', 'Dưa leo 25-30g', 'Cá rô phi chiên giòn', 'Cá 60g', 'Cá chim kho tương', 'Cá 60g'],
  ['', '', 'Bánh mì 1 ổ', 'Đậu rồng xào tỏi', 'Rau 60g', 'Cải thảo xào nấm', 'Rau 60g'],
  ['', '', '', 'Canh bí đỏ đậu phộng', 'Canh 150g', 'Canh súp củ dền', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Quýt đường', '1 trái', 'Dưa lưới', '1 miếng'],
  // Thứ 7
  ['Thứ 7', 'Phở bò Hà Nội', 'Bò 40-45g', 'Thịt heo xào chua ngọt', 'Thịt 50-55g', 'Mực xào sa tế', 'Mực 50-55g'],
  ['', '', 'Rau thơm, giá 25-30g', 'Chả cá thác lác sốt cà', 'Chả cá 60g', 'Cá bạc má chiên tỏi', 'Cá 60g'],
  ['', '', 'Bánh phở 210-230g', 'Khổ qua xào trứng', 'Rau 60g', 'Rau lang luộc chấm kho quẹt', 'Rau 60g'],
  ['', '', '', 'Canh cải ngọt thịt bằm', 'Canh 150g', 'Canh chua cá điêu hồng', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Thạch rau câu', '1 hũ', 'Sữa đậu nành', '1 bịch'],
  // Chủ nhật
  ['Chủ nhật', 'Bún bò Huế', 'Thịt bắp bò 40-45g', 'Vịt kho gừng', 'Vịt 60-65g', 'Thịt heo kho khổ qua', 'Thịt 45-50g · Khổ qua 40g'],
  ['', '', 'Rau bắp chuối 25-30g', 'Cá trê chiên mắm gừng', 'Cá 60g', 'Cá nục kho cà', 'Cá 60g'],
  ['', '', 'Bún 210-230g', 'Bầu xào trứng', 'Rau 60g', 'Cải thìa xào dầu hào', 'Rau 60g'],
  ['', '', '', 'Canh khoai mỡ tôm thịt', 'Canh 150g', 'Canh rau dền nấu tôm', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Dưa hấu', '1 miếng', 'Ổi hồng', '1 trái'],
  ['NHÀ CUNG CẤP TÁM PHƯƠNG']
];

const wsMan = XLSX.utils.aoa_to_sheet(manRows);
XLSX.utils.book_append_sheet(wb, wsMan, 'Thực đơn mặn');

// 2. Sheet chay
const chayRows = [
  ['CÔNG TY TNHH SUẤT ĂN CÔNG NGHIỆP TÁM PHƯƠNG'],
  ['THỰC ĐƠN CHAY TUẦN: 05/10/2026 - 11/10/2026', '', '', '', '', '', '', 'DỰ ÁN: KÝ TÚC XÁ HÓC MÔN'],
  ['', 'SÁNG', '', 'TRƯA', '', 'TỐI', ''],
  ['Thứ', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng', 'Món', 'Trọng lượng'],
  // Thứ 2
  ['Thứ 2', 'Bún xào chay', 'Đậu hũ+nấm 40-45g', 'Đậu hũ kho nấm rơm', 'Đậu hũ 60g', 'Sườn non chay ram mặn', 'Sườn chay 50g'],
  ['', '', 'Rau sống 25-30g', 'Chả lụa chay chiên', 'Chả chay 50g', 'Nấm bào ngư xào sả', 'Nấm 60g'],
  ['', '', 'Bún 210-230g', 'Cải thìa xào tỏi', 'Rau 60g', 'Cải ngọt xào', 'Rau 60g'],
  ['', '', '', 'Canh bí đao chay', 'Canh 150g', 'Canh bồ ngót chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Dưa hấu', '1 miếng', 'Ổi', '1 trái'],
  // Thứ 3
  ['Thứ 3', 'Bánh ướt chay', 'Chả lụa chay 40-45g', 'Đậu hũ sốt cà chua', 'Đậu hũ 60g', 'Mì căn xào sả ớt', 'Mì căn 50g'],
  ['', '', 'Rau thơm 25-30g', 'Nấm đùi gà kho tiêu', 'Nấm 50g', 'Tàu hũ ky chiên giòn', 'Tàu hũ ky 40g'],
  ['', '', 'Bánh ướt 210-230g', 'Đậu que xào', 'Rau 60g', 'Cải thìa luộc', 'Rau 60g'],
  ['', '', '', 'Canh chua chay', 'Canh 150g', 'Canh cải thảo chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Chuối laba', '1 trái', 'Thanh long', '1 miếng'],
  // Thứ 4
  ['Thứ 4', 'Hủ tiếu chay', 'Chả chay 40-45g', 'Mì căn xào nấm', 'Mì căn 50g', 'Đậu hũ chiên sả', 'Đậu hũ 60g'],
  ['', '', 'Giá hẹ 25-30g', 'Chả giò chay', 'Chả giò 50g', 'Nấm rơm kho tiêu', 'Nấm 50g'],
  ['', '', 'Hủ tiếu 210-230g', 'Bí đỏ xào', 'Rau 60g', 'Rau muống luộc', 'Rau 60g'],
  ['', '', '', 'Canh mồng tơi chay', 'Canh 150g', 'Canh bầu chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Táo xanh', '1 trái', 'Cam sành', '1 miếng'],
  // Thứ 5
  ['Thứ 5', 'Mì Quảng chay', 'Đậu hũ 40-45g', 'Sườn chay nướng', 'Sườn 50g', 'Đậu hũ kho măng', 'Đậu hũ 60g'],
  ['', '', 'Rau sống 25-30g', 'Nấm kho tộ', 'Nấm 50g', 'Mì căn chiên mắm chay', 'Mì căn 50g'],
  ['', '', 'Mì Quảng 210-230g', 'Bắp cải xào', 'Rau 60g', 'Su su xào', 'Rau 60g'],
  ['', '', '', 'Canh rong biển chay', 'Canh 150g', 'Canh chua chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Sữa chua', '1 hộp', 'Chè đậu xanh', '1 ly'],
  // Thứ 6
  ['Thứ 6', 'Bánh mì xíu mại chay', 'Xíu mại chay 40-45g', 'Đậu hũ chiên giòn', 'Đậu hũ 60g', 'Mì căn xào ớt chuông', 'Mì căn 50g'],
  ['', '', 'Dưa leo 25-30g', 'Chả cá chay sốt cà', 'Chả chay 50g', 'Nấm bào ngư kho tương', 'Nấm 50g'],
  ['', '', 'Bánh mì 1 ổ', 'Đậu rồng xào', 'Rau 60g', 'Cải thảo xào', 'Rau 60g'],
  ['', '', '', 'Canh bí đỏ chay', 'Canh 150g', 'Canh súp củ dền chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Quýt đường', '1 trái', 'Dưa lưới', '1 miếng'],
  // Thứ 7
  ['Thứ 7', 'Phở chay', 'Nấm+chả chay 40-45g', 'Sườn chay xào chua ngọt', 'Sườn 50g', 'Đậu hũ kho dứa', 'Đậu hũ 60g'],
  ['', '', 'Rau thơm 25-30g', 'Chả lụa chay kho tiêu', 'Chả chay 50g', 'Tàu hũ ky xào sả', 'Tàu hũ ky 40g'],
  ['', '', 'Bánh phở 210-230g', 'Khổ qua xào chay', 'Rau 60g', 'Rau lang luộc', 'Rau 60g'],
  ['', '', '', 'Canh cải ngọt chay', 'Canh 150g', 'Canh chua chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Thạch rau câu', '1 hũ', 'Sữa đậu nành', '1 bịch'],
  // Chủ nhật
  ['Chủ nhật', 'Bún bò chay Huế', 'Bò viên chay 40-45g', 'Nấm đùi gà kho gừng', 'Nấm 50g', 'Đậu hũ kho khổ qua', 'Đậu hũ 60g'],
  ['', '', 'Rau bắp chuối 25-30g', 'Chả lụa chay chiên xù', 'Chả chay 50g', 'Mì căn kho cà chua', 'Mì căn 50g'],
  ['', '', 'Bún 210-230g', 'Bầu xào chay', 'Rau 60g', 'Cải thìa xào', 'Rau 60g'],
  ['', '', '', 'Canh khoai mỡ chay', 'Canh 150g', 'Canh rau dền chay', 'Canh 150g'],
  ['', '', '', 'Cơm trắng', '280, 300 gram', 'Cơm trắng', '280, 300 gram'],
  ['', '', '', 'Dưa hấu', '1 miếng', 'Ổi hồng', '1 trái'],
  ['NHÀ CUNG CẤP TÁM PHƯƠNG']
];

const wsChay = XLSX.utils.aoa_to_sheet(chayRows);
XLSX.utils.book_append_sheet(wb, wsChay, 'Thực đơn chay');

const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
const res = parseMenuWorkbook(buf, 'THUC_DON_TAM_PHUONG_TUAN_41.xlsx', { supplierId: 'TP', weekStart: '2026-10-05' });

console.log('[PARSE]', res.stats, res.records.length, res.weeksFound, res.warnings);
const grid = toGrid(res.records);

// Verification tests
console.log('\n--- KẾT QUẢ TỰ KIỂM TRA BƯỚC 6 ---');
const daysCount = Object.keys(grid).length;
console.log('1. Số ngày có dữ liệu:', daysCount, '(Kỳ vọng: 7)');
console.log('2. Tổng số bản ghi:', res.records.length, '(Kỳ vọng: 42)');
console.log('3. Tổng số món:', res.stats.dishes, '(Kỳ vọng: 210)');

// Test Thứ 3 Sáng
const t3Sang = grid['2026-10-06']?.sang?.man;
console.log('4. Thứ 3 06/10 - Sáng - Mặn:');
console.log('   Tên:', t3Sang?.[0]?.name);
console.log('   Định lượng:', formatPortions(t3Sang?.[0] || { portions: [] }));

// Test Thứ 3 Trưa
const t3Trua = grid['2026-10-06']?.trua?.man;
console.log('5. Thứ 3 06/10 - Trưa - Mặn món đầu:');
console.log('   Tên:', t3Trua?.[0]?.name);
console.log('   Định lượng:', formatPortions(t3Trua?.[0] || { portions: [] }));

// Test Chủ nhật Tối
const cnToi = grid['2026-10-11']?.toi?.man;
console.log('6. Chủ nhật 11/10 - Tối - Mặn món đầu:');
console.log('   Tên:', cnToi?.[0]?.name);
console.log('   Định lượng:', formatPortions(cnToi?.[0] || { portions: [] }));

// Test Thứ 2 Sáng
const t2Sang = grid['2026-10-05']?.sang?.man;
console.log('7. Thứ 2 05/10 - Sáng - Mặn:');
console.log('   Số món:', t2Sang?.length, '(Kỳ vọng: 1 món)');
console.log('   Tên:', t2Sang?.[0]?.name);
console.log('   Định lượng:', formatPortions(t2Sang?.[0] || { portions: [] }));
