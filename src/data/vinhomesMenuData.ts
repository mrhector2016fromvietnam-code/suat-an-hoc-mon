import { VendorPortionRow, DayShiftMenu, MealShift } from '../types/report';

export const DEFAULT_VENDORS: VendorPortionRow[] = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', td8: 0, td11_1: 0, td11_3: 0 },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD', td8: 0, td11_1: 0, td11_3: 0 },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', td8: 699, td11_1: 207, td11_3: 245 },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', td8: 534, td11_1: 441, td11_3: 142 },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', td8: 621, td11_1: 349, td11_3: 319 },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', td8: 415, td11_1: 207, td11_3: 207 },
  { id: 'vina-story', name: 'Vina Story', code: 'VS', td8: 0, td11_1: 0, td11_3: 0 },
];

export const DAYS_OF_WEEK = [
  { day: 'Thứ 2', date: '05/10/2026' },
  { day: 'Thứ 3', date: '06/10/2026' },
  { day: 'Thứ 4', date: '07/10/2026' },
  { day: 'Thứ 5', date: '08/10/2026' },
  { day: 'Thứ 6', date: '09/10/2026' },
  { day: 'Thứ 7', date: '10/10/2026' },
  { day: 'Chủ nhật', date: '11/10/2026' },
];

/**
 * Helper to clean trailing portion sizes / weight / quantity annotations
 * e.g., "Phở áp chảo bò (Phở: 200-220g, Bò: 40g, Rau: 30g)" -> "Phở áp chảo bò"
 * e.g., "Táo xanh (90-100gr)" -> "Táo xanh"
 * e.g., "Thạch rau câu (1 hũ)" -> "Thạch rau câu"
 */
export const cleanDishName = (name: string): string => {
  if (!name) return '';
  return name
    .replace(/\s*\([^)]*?(?:g|gr|gram|ml|hũ|cái|ổ|trái|lát|chén|suất|cuốn|hộp|miếng)[^)]*?\)/gi, '')
    .replace(/\s*\(\s*\d+[\d\s\-\.\,\/]*\w*\s*\)/gi, '')
    .replace(/\s+\d+[\d\s\-\.\,\/]*(?:g|gr|gram|ml|kg)\b/gi, '')
    .replace(/\s*\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const cleanMenuObj = (m: DayShiftMenu): DayShiftMenu => {
  if (!m) {
    return {
      vendorId: 'tam-phuong',
      dayOfWeek: 'Thứ 2',
      dateStr: '05/10/2026',
      shift: 'Bữa sáng',
      meatDishes: [],
      meatDessert: '',
      vegDishes: [],
      vegDessert: '',
      isWeighedOk: true
    };
  }

  const rawMeat = Array.isArray(m.meatDishes) ? m.meatDishes : [];
  const rawVeg = Array.isArray(m.vegDishes) ? m.vegDishes : [];

  return {
    ...m,
    meatDishes: rawMeat.map(cleanDishName).filter(Boolean),
    vegDishes: rawVeg.map(cleanDishName).filter(Boolean),
    meatDessert: cleanDishName(m.meatDessert || ''),
    vegDessert: cleanDishName(m.vegDessert || ''),
    isWeighedOk: m.isWeighedOk ?? true
  };
};

// =========================================================================
// 1. CÔNG TY TNHH SUẤT ĂN CÔNG NGHIỆP TÁM PHƯƠNG (7 NGÀY X 3 CA = 21 CA)
// =========================================================================
export const TAM_PHUONG_MENUS: DayShiftMenu[] = [
  // Thứ 2 (05/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Phở áp chảo bò', 'Rau thơm ăn kèm'],
    meatDessert: 'Chuối',
    vegDishes: ['Phở áp chảo bò chay', 'Rau thơm ăn kèm'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho trứng cút', 'Cá basa chiên sả', 'Cải thìa xào tỏi', 'Canh bí đao thịt bằm'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho nấm', 'Sườn chay chiên sả', 'Cải thìa xào tỏi', 'Canh bí đao'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn heo ram củ cải', 'Cá nục chiên rim mắm', 'Mắm thái', 'Cải ngọt xào', 'Canh bồ ngót'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Cá bống ram mè', 'Rau củ luộc + chao', 'Đậu phộng rang muối', 'Cải ngọt xào', 'Canh bồ ngót'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 3 (06/10/2026) - TRÁNG MIỆNG CHAY LÀ SỮA ĐẬU NÀNH (CHUẨN 100%)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì chả lụa thịt nguội', 'Rau dưa ăn kèm'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bánh mì chả lụa chay', 'Rau dưa ăn kèm'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Heo quay kho củ cải', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Sườn chay kho măng', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn xào su su cà rốt', 'Đậu hũ nhồi thịt sốt cà', 'Chả cá kho tiêu', 'Rau muống xào tỏi', 'Canh bí xanh'],
    meatDessert: 'Táo xanh',
    vegDishes: ['Cơm trắng', 'Sườn xào su củ rốt', 'Đậu hũ kho tương', 'Chả chay kho tiêu', 'Rau muống xào tỏi', 'Canh bí xanh'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },

  // Thứ 4 (07/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh hỏi thịt heo khìa', 'Rau sống'],
    meatDessert: 'Chuối',
    vegDishes: ['Bánh hỏi thịt heo chay khìa', 'Rau sống'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Cá nục kho tiêu', 'Gà lát xào sả ớt', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu tôm khô'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Chả nấm kho tiêu', 'Gà lát xào sả tế', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt', 'Thịt kho tiêu', 'Cải ngọt xào cà rốt', 'Canh mướp mồng tơi'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt chay', 'Ruột heo kho tiêu chay', 'Cà tím xào đậu hũ', 'Cải ngọt xào cà rốt', 'Canh mướp mồng tơi'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 5 (08/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì sườn lagu', 'Khoai tây cà rốt'],
    meatDessert: 'Cam sành',
    vegDishes: ['Sườn chay nấu lagu', 'Bánh mì'],
    vegDessert: 'Nước sâm',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà chiên nước mắm', 'Đậu hũ sốt cà', 'Đậu phộng rang tỏi ớt', 'Rau củ luộc', 'Canh rau má'],
    meatDessert: 'Táo xanh',
    vegDishes: ['Cơm trắng', 'Đùi gà chiên sốt tương cay', 'Đậu hũ sốt tứ xuyên', 'Đậu phộng rang tỏi ớt', 'Rau củ luộc', 'Canh rau má'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào dưa leo', 'Đậu hũ chiên sốt sả ớt', 'Tôm rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Bò lát xào dưa leo', 'Đậu hũ chiên sốt sả ớt', 'Tôm chay rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 6 (09/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh ướt chả giò thịt', 'Rau dưa'],
    meatDessert: 'Quýt',
    vegDishes: ['Bánh ướt chả giò chay', 'Rau dưa'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Gà lát xào sả tế', 'Cá viên chiên', 'Dưa leo xào', 'Canh cải ngọt'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Gà lát xào sả tế chay', 'Cá viên rau muống chay', 'Đậu hũ tứ xuyên', 'Dưa leo xào', 'Canh cải ngọt'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Ruột heo rô ti', 'Sườn non rim mắm ngọt', 'Rau củ luộc', 'Canh rau muống'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Ruột heo rô ti chay', 'Đậu hũ kho tương', 'Sườn non rim mắm ngọt', 'Rau củ luộc', 'Canh rau muống'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 7 (10/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Mì trứng xào tôm thịt', 'Cải thìa'],
    meatDessert: 'Chuối',
    vegDishes: ['Mì trứng xào tôm thịt chay'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà rôti', 'Chả cá kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đùi gà rôti chay', 'Chả chay kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Cá cơm kho thơm', 'Ruột heo rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Cá cơm kho thơm chay', 'Ruột heo rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Chủ nhật (11/10/2026)
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Nui xào bò lát', 'Hành tây'],
    meatDessert: 'Sữa tươi',
    vegDishes: ['Nui xào bò lát chay'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò xào thơm', 'Đậu hũ chiên sốt cà', 'Cá viên xào rau muống', 'Rau củ luộc', 'Canh khổ qua'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Bò xào thơm chay', 'Đậu hũ chiên sốt cà', 'Cá viên xào rau muống chay', 'Rau củ luộc', 'Canh khổ qua'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Tôm xào chua ngọt', 'Sườn non chiên sả', 'Cải thìa xào', 'Canh bí xanh'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Tôm xào chua ngọt chay', 'Nấm đậu hũ kho tương', 'Sườn non chiên sả chay', 'Cải thìa xào', 'Canh bí xanh'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
];

// =========================================================================
// 2. CÔNG TY CỔ PHẦN LIM DƯƠNG (7 NGÀY X 3 CA = 21 CA, ĐÃ LƯỢC BỎ ĐỊNH LƯỢNG)
// =========================================================================
export const LIM_DUONG_MENUS: DayShiftMenu[] = [
  // Thứ 2 (05/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Phở áp chảo bò', 'Rau thơm ăn kèm'],
    meatDessert: 'Sữa chua',
    vegDishes: ['Phở áp chảo bò chay', 'Rau thơm ăn kèm'],
    vegDessert: 'Sữa chua',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Cá cơm kho tiêu', 'Sườn rim sả ớt', 'Cải ngọt xào', 'Canh khổ qua'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho thập cẩm', 'Cá cơm kho tiêu chay', 'Sườn rim sả ớt', 'Cải ngọt xào', 'Canh khổ qua'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào sả', 'Đậu hũ chiên sả ớt', 'Đậu phộng rang', 'Cải thảo xào', 'Canh súp'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Bò lát xào sả', 'Đậu hũ chiên sả ớt', 'Đậu phộng rang', 'Cải thảo xào', 'Canh súp'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 3 (06/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì chả lụa', 'Dưa leo rau thơm'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bánh mì chả lụa chay', 'Rau dưa ăn kèm'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Heo quay kho củ cải', 'Sườn kho măng', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Heo quay kho củ cải chay', 'Sườn chay kho măng', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn xào su củ rốt', 'Đậu hũ kho tương', 'Chả kho tiêu', 'Rau muống xào tỏi', 'Canh bí xanh'],
    meatDessert: 'Táo xanh',
    vegDishes: ['Cơm trắng', 'Sườn xào su củ rốt', 'Đậu hũ kho tương', 'Chả chay kho tiêu', 'Rau muống xào tỏi', 'Canh bí xanh'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },

  // Thứ 4 (07/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh hỏi thịt heo khìa', 'Rau củ'],
    meatDessert: 'Chuối',
    vegDishes: ['Bánh hỏi thịt heo chay', 'Rau củ'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Chả cá kho tiêu', 'Gà lát xào sả tế', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Chả nấm kho tiêu', 'Gà lát xào sả tế chay', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt', 'Ruột heo kho tiêu', 'Cà tím xào đậu hũ', 'Cải ngọt + cà rốt xào', 'Canh mướp mồng tơi'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt chay', 'Ruột heo kho tiêu chay', 'Cà tím xào đậu hũ', 'Cải ngọt + cà rốt xào', 'Canh mướp mồng tơi'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 5 (08/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì sườn heo lagu'],
    meatDessert: 'Táo xanh',
    vegDishes: ['Bánh mì sườn heo chay lagu', 'Rau củ'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà chiên sốt tương', 'Đậu hũ sốt tứ xuyên', 'Đậu phộng rang tỏi ớt', 'Rau củ luộc', 'Canh rau má'],
    meatDessert: 'Táo xanh',
    vegDishes: ['Cơm trắng', 'Đùi gà chiên sốt tương cay', 'Đậu hũ sốt tứ xuyên', 'Đậu phộng rang tỏi ớt', 'Rau củ luộc', 'Canh rau má'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào dưa leo', 'Đậu hũ chiên sốt sả ớt', 'Tôm rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Bò lát xào dưa leo', 'Đậu hũ chiên sốt sả ớt', 'Tôm chay rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 6 (09/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh cuốn chả lụa chả giò thịt'],
    meatDessert: 'Quýt',
    vegDishes: ['Bánh cuốn chả lụa chay', 'Chả giò chay', 'Rau'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Gà lát xào sả tế', 'Cá viên rau muống', 'Đậu hũ tứ xuyên', 'Dưa leo xào', 'Canh cải ngọt'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Gà lát xào sả tế', 'Cá viên chay rau muống', 'Đậu hũ tứ xuyên', 'Dưa leo xào', 'Canh cải ngọt'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Ruột heo rô ti', 'Đậu hũ kho tương', 'Sườn non rim mắm ngọt', 'Rau củ luộc', 'Canh rau muống'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Ruột heo rô ti chay', 'Đậu hũ kho tương', 'Sườn non chay rim mắm ngọt', 'Rau củ luộc', 'Canh rau muống'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 7 (10/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Mì trứng xào tôm thịt', 'Rau cải'],
    meatDessert: 'Chuối',
    vegDishes: ['Mì trứng xào tôm thịt chay', 'Rau'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà rôti', 'Chả kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đùi gà rôti chay', 'Chả chay kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Cá cơm kho thơm', 'Ruột heo rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Cá cơm kho thơm chay', 'Ruột heo rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Chủ nhật (11/10/2026)
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Nui xào bò lát thịt bằm', 'Rau cải'],
    meatDessert: 'Sữa tươi',
    vegDishes: ['Nui xào bò chay', 'Rau'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò xào thơm', 'Đậu hũ chiên sốt cà', 'Cá viên xào rau muống', 'Rau củ luộc', 'Canh khổ qua'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Bò chay xào thơm', 'Đậu hũ chiên sốt cà', 'Cá viên chay xào rau muống', 'Rau củ luộc', 'Canh khổ qua'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'lim-duong',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Tôm xào chua ngọt', 'Nấm đậu hũ kho tương', 'Sườn non chiên sả', 'Cải thìa xào', 'Canh bí xanh'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Tôm chay xào chua ngọt', 'Nấm đậu hũ kho tương', 'Sườn non chay chiên sả', 'Cải thìa xào', 'Canh bí xanh'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
];

// =========================================================================
// 3. MINH LONG FOOD (7 NGÀY X 3 CA = 21 CA ĐỘC LẬP)
// =========================================================================
export const MINH_LONG_FOOD_MENUS: DayShiftMenu[] = [
  // Thứ 2
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Hủ tiếu Nam Vang thịt heo tôm', 'Hẹ giá'],
    meatDessert: 'Sữa bắp',
    vegDishes: ['Hủ tiếu chay nấm rơm đậu hũ', 'Hẹ giá'],
    vegDessert: 'Sữa bắp',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Gà kho sả ớt', 'Trứng chiên thịt bằm', 'Rau muống luộc dầm me', 'Canh rau má tôm khô'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Gà lát chay kho sả', 'Đậu hũ chiên giòn', 'Rau muống luộc chao', 'Canh rau má'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt ba rọi kho trứng cút', 'Cá thu chiên sốt cà', 'Cải thìa xào tỏi', 'Canh cải xoong thịt bằm'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Thịt kho trứng chay', 'Đậu hũ sốt cà', 'Cải thìa xào tỏi', 'Canh cải xoong'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },

  // Thứ 3
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún bò Huế giò nạc', 'Rau sống bắp chuối'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bún bò Huế chay chả nấm', 'Rau sống bắp chuối'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn non ram mặn', 'Cá điêu hồng chiên xù', 'Đậu cô ve xào thịt', 'Canh bí đỏ thịt bằm'],
    meatDessert: 'Thơm chín cây',
    vegDishes: ['Cơm trắng', 'Sườn chay ram mặn', 'Chả cá chay chiên xù', 'Đậu cô ve xào tỏi', 'Canh bí đỏ'],
    vegDessert: 'Thơm chín cây',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà chiên nước mắm', 'Mực xào chua ngọt', 'Cải ngọt xào dầu hào', 'Canh khổ qua nhồi thịt'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Đùi gà chay chiên mắm', 'Nấm xào chua ngọt', 'Cải ngọt xào dầu hào chay', 'Canh khổ qua nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 4
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì ốp la xúc xích pate', 'Dưa leo cà chua'],
    meatDessert: 'Sữa chua',
    vegDishes: ['Bánh mì chả lụa chay pate hạt sen', 'Dưa leo'],
    vegDessert: 'Sữa chua',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho tàu nước dừa', 'Tôm rim ba chỉ', 'Bắp cải xào tỏi', 'Canh mướp mồng tơi tôm khô'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho tàu nước cốt dừa', 'Tôm chay rim mặn', 'Bắp cải xào tỏi', 'Canh mướp mồng tơi'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào đậu que', 'Cá basa kho tộ', 'Rau lang luộc chấm kho quẹt', 'Canh chua cá bông lau'],
    meatDessert: 'Táo',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào đậu que', 'Đậu hũ kho tộ', 'Rau lang luộc chấm chao', 'Canh chua chay bạc hà'],
    vegDessert: 'Táo',
    isWeighedOk: true
  },

  // Thứ 5
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún mọc sườn non', 'Rau thơm ăn kèm'],
    meatDessert: 'Nước sâm nha đam',
    vegDishes: ['Bún mọc nấm rơm chay', 'Rau thơm'],
    vegDessert: 'Nước sâm nha đam',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Vịt kho gừng', 'Trứng cuộn hành hoa', 'Su su xào cà rốt', 'Canh súp củ dền xương heo'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Vịt chay kho gừng', 'Đậu hũ cuộn rong biển', 'Su su xào cà rốt', 'Canh súp củ dền chay'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn cốt lết nướng mật ong', 'Cá nục kho cà', 'Cải thìa sốt dầu hào', 'Canh cải xanh nấu gừng'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Sườn chay nướng sốt tương', 'Chả cá chay kho cà chua', 'Cải thìa xào', 'Canh cải xanh gừng'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },

  // Thứ 6
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Phở gà xé lá chanh', 'Quẩy giòn'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Phở gà chay nấm đùi gà', 'Quẩy giòn'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho măng tươi', 'Cá lóc chiên mắm tỏi', 'Rau muống xào tỏi', 'Canh bồ ngót nấu tôm bằm'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho măng tươi', 'Cá chay chiên sả ớt', 'Rau muống xào tỏi', 'Canh bồ ngót nấm rơm'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà rang muối sả', 'Tép xào bông điên điển', 'Đậu bắp luộc', 'Canh bầu nấu tôm khô'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Gà lát chay rang muối sả', 'Tép chay xào bông điên điển', 'Đậu bắp luộc chấm chao', 'Canh bầu nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 7
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh cuốn nóng chả lụa chả quế', 'Rau giá hành phi'],
    meatDessert: 'Sữa bắp',
    vegDishes: ['Bánh cuốn chay chả lụa chay', 'Rau giá hành phi'],
    vegDessert: 'Sữa bắp',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò kho tiêu xanh', 'Đậu hũ nhồi thịt sốt cà', 'Bông cải xào nấm', 'Canh cua đồng mồng tơi'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Bò chay kho tiêu xanh', 'Đậu hũ nhồi nấm sốt cà', 'Bông cải xào nấm', 'Canh mồng tơi'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt ba chỉ luộc cà pháo mắm tôm', 'Cá kèo kho rau răm', 'Rau củ luộc thập cẩm', 'Canh chua tôm me'],
    meatDessert: 'Cam sành',
    vegDishes: ['Cơm trắng', 'Thịt ba chỉ chay luộc cà pháo tương', 'Đậu hũ kho rau răm', 'Rau củ luộc thập cẩm', 'Canh chua chay'],
    vegDessert: 'Cam sành',
    isWeighedOk: true
  },

  // Chủ nhật
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Mì Quảng tôm thịt trứng cút', 'Bánh tráng mè nướng'],
    meatDessert: 'Sữa tươi',
    vegDishes: ['Mì Quảng chay nấm đậu hũ', 'Bánh tráng mè'],
    vegDessert: 'Sữa tươi',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà roti sốt ngũ vị', 'Chả cá thác lác kho tiêu', 'Khổ qua xào trứng', 'Canh rong biển đậu hũ'],
    meatDessert: 'Dưa lưới',
    vegDishes: ['Cơm trắng', 'Đùi gà chay roti ngũ vị', 'Chả chay kho tiêu', 'Khổ qua xào đậu hũ', 'Canh rong biển đậu hũ'],
    vegDessert: 'Dưa lưới',
    isWeighedOk: true
  },
  {
    vendorId: 'minh-long-food',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn non xào chua ngọt', 'Tôm hấp nước dừa', 'Cải bó xôi xào tỏi', 'Canh sườn hầm bắp ngọt'],
    meatDessert: 'Nho ngọt',
    vegDishes: ['Cơm trắng', 'Sườn chay xào chua ngọt', 'Tôm chay hấp nước dừa', 'Cải bó xôi xào tỏi', 'Canh củ hầm bắp ngọt'],
    vegDessert: 'Nho ngọt',
    isWeighedOk: true
  },
];

// =========================================================================
// 4. NGUYÊN SÀI GÒN (7 NGÀY X 3 CA = 21 CA ĐỘC LẬP)
// =========================================================================
export const NGUYEN_SAI_GON_MENUS: DayShiftMenu[] = [
  // Thứ 2
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì xíu mại trứng cút', 'Dưa leo ngò rí'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bánh mì xíu mại chay', 'Dưa leo ngò rí'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn cốt lết ram mặn', 'Cá điêu hồng chiên xù', 'Bắp cải xào tỏi', 'Canh mướp hương nấu thịt'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Sườn non chay ram mặn', 'Chả cá chay sốt cà', 'Bắp cải xào tỏi', 'Canh mướp hương nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà chiên nước mắm', 'Chả cá sốt cà chua', 'Đậu que xào thịt', 'Canh bí đỏ thịt bằm'],
    meatDessert: 'Chuối laba',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho nấm rơm', 'Chả lụa chay rim mè', 'Đậu que xào', 'Canh bí đỏ'],
    vegDessert: 'Chuối laba',
    isWeighedOk: true
  },

  // Thứ 3
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Hủ tiếu mì xá xíu', 'Rau xà lách hẹ'],
    meatDessert: 'Sữa tươi',
    vegDishes: ['Hủ tiếu mì xá xíu chay', 'Rau hẹ'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt ba rọi kho măng', 'Cá nục chiên sốt mắm gừng', 'Cải thìa xào tỏi', 'Canh rau ngót tôm bằm'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho măng tươi', 'Sườn chay chiên sốt gừng', 'Cải thìa xào tỏi', 'Canh rau ngót nấm'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào ớt chuông', 'Trứng chiên thịt bằm nấm mèo', 'Bầu luộc chấm chao', 'Canh khoai mỡ nấu tôm'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào ớt chuông', 'Đậu hũ chiên nấm mèo', 'Bầu luộc chấm chao', 'Canh khoai mỡ nấm'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 4
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Xôi gà xé mỡ hành', 'Dưa góp chua ngọt'],
    meatDessert: 'Nước sâm cúc',
    vegDishes: ['Xôi gấc chay chả lụa đậu xanh', 'Dưa góp'],
    vegDessert: 'Nước sâm cúc',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà sốt tiêu đen', 'Cá bống kho tiêu', 'Khổ qua xào trứng', 'Canh chua cá basa'],
    meatDessert: 'Quýt đường',
    vegDishes: ['Cơm trắng', 'Đùi gà chay sốt tiêu', 'Nấm kho tiêu tộ', 'Khổ qua xào đậu hũ', 'Canh chua chay'],
    vegDessert: 'Quýt đường',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Heo quay xào dưa cải', 'Tôm rim mặn ngọt', 'Rau muống luộc dầm me', 'Canh súp củ quả'],
    meatDessert: 'Táo',
    vegDishes: ['Cơm trắng', 'Heo quay chay xào dưa cải', 'Tôm chay rim mặn ngọt', 'Rau muống luộc chấm tương', 'Canh củ quả'],
    vegDessert: 'Táo',
    isWeighedOk: true
  },

  // Thứ 5
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh canh chả cá giò heo', 'Hành ngò tiêu'],
    meatDessert: 'Sữa đậu phộng',
    vegDishes: ['Bánh canh chả chay nấm rơm', 'Hành ngò'],
    vegDessert: 'Sữa đậu phộng',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho trứng cút nước dừa', 'Chả cá chiên thì là', 'Rau củ luộc chấm kho quẹt', 'Canh bí xanh thịt bằm'],
    meatDessert: 'Thạch dừa',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho nấm rơm nước dừa', 'Chả chay chiên thì là', 'Rau củ luộc chấm chao', 'Canh bí xanh'],
    vegDessert: 'Thạch dừa',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà kho gừng sả', 'Cá lóc phi lê chiên giòn', 'Đậu bắp xào tỏi', 'Canh cải ngọt nấu tôm khô'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Gà lát chay kho gừng', 'Cá chay chiên sả', 'Đậu bắp xào tỏi', 'Canh cải ngọt'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },

  // Thứ 6
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún riêu cua ốc thịt', 'Rau kinh giới bắp chuối'],
    meatDessert: 'Sữa chua',
    vegDishes: ['Bún riêu chay đậu hũ nấm rơm', 'Rau sống'],
    vegDessert: 'Sữa chua',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn non ram me', 'Cá thu Nhật kho cà', 'Cải thảo xào nấm', 'Canh rau dền thịt bằm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Sườn chay sốt me', 'Đậu hũ kho sốt cà', 'Cải thảo xào nấm', 'Canh rau dền'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Mực xào hành cần', 'Thịt heo luộc chấm cà pháo', 'Rau lang xào tỏi', 'Canh mồng tơi nấu cua'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Nấm xào hành cần chay', 'Đậu hũ luộc chấm tương cà', 'Rau lang xào tỏi', 'Canh mồng tơi'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },

  // Thứ 7
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Mì xào giòn thịt bò rau cải', 'Ớt sừng'],
    meatDessert: 'Cam ép',
    vegDishes: ['Mì xào giòn chay nấm thập cẩm', 'Rau cải'],
    vegDessert: 'Cam ép',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Vịt quay xào nấm đông cô', 'Tôm rim tỏi ớt', 'Bông cải xanh luộc', 'Canh bí đỏ đậu phộng'],
    meatDessert: 'Nho Mỹ',
    vegDishes: ['Cơm trắng', 'Vịt chay xào nấm đông cô', 'Tôm chay rim tỏi ớt', 'Bông cải luộc chấm chao', 'Canh bí đỏ đậu phộng'],
    vegDessert: 'Nho Mỹ',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò né hành tây', 'Cá basa sốt chanh dây', 'Cải xoong xào tỏi', 'Canh chua cá hú'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Bò chay né hành tây', 'Đậu hũ sốt chanh dây', 'Cải xoong xào tỏi', 'Canh chua chay'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Chủ nhật
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì chảo bò trứng xúc xích', 'Bơ dưa leo'],
    meatDessert: 'Sữa đậu nành lá dứa',
    vegDishes: ['Bánh mì chảo chay nấm pate đậu đỏ', 'Dưa leo'],
    vegDessert: 'Sữa đậu nành lá dứa',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn heo nướng mật ong', 'Cá diêu hồng hấp gừng hành', 'Đậu cô ve xào tỏi', 'Canh sườn hầm củ sen'],
    meatDessert: 'Dưa lưới',
    vegDishes: ['Cơm trắng', 'Sườn chay nướng mật mía', 'Chả cá chay hấp gừng hành', 'Đậu cô ve xào tỏi', 'Canh củ sen hầm nấm'],
    vegDessert: 'Dưa lưới',
    isWeighedOk: true
  },
  {
    vendorId: 'nguyen-sai-gon',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Lẩu Thái tôm mực cá viên', 'Bún tươi', 'Rau muống bắp chuối', 'Canh lẩu thanh ngọt'],
    meatDessert: 'Thạch rau câu phô mai',
    vegDishes: ['Cơm trắng', 'Lẩu Thái chay nấm đậu hũ', 'Bún tươi', 'Rau muống bắp chuối', 'Canh lẩu chay'],
    vegDessert: 'Thạch rau câu phô mai',
    isWeighedOk: true
  },
];

// =========================================================================
// 5. HƯƠNG NGỌC PHÁT (7 NGÀY X 3 CA = 21 CA ĐỘC LẬP)
// =========================================================================
export const HUONG_NGOC_PHAT_MENUS: DayShiftMenu[] = [
  // Thứ 2
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún xào thịt nạc xắt lát', 'Rau sống giá hẹ'],
    meatDessert: 'Sữa chua',
    vegDishes: ['Bún xào chay đậu hũ nấm rơm', 'Rau sống'],
    vegDessert: 'Sữa chua',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho tàu nước dừa', 'Tôm ram thịt ba chỉ', 'Đậu cô ve xào tỏi', 'Canh bồ ngót thịt bằm'],
    meatDessert: 'Cam sành',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho nước cốt dừa', 'Tôm chay rim mặn', 'Đậu cô ve xào tỏi', 'Canh bồ ngót nấm'],
    vegDessert: 'Cam sành',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn ram mặn ngọt', 'Tép xào bông cải', 'Rau muống xào tỏi', 'Canh chua cá điêu hồng'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Sườn chay ram mặn', 'Nấm rơm xào bông cải', 'Rau muống xào tỏi', 'Canh chua chay'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 3
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì chả cá nóng sốt ớt', 'Rau răm dưa leo'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bánh mì chả cá chay sốt tương', 'Rau răm'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Gà kho nấm đông cô', 'Cá lóc chiên mắm gừng', 'Su su xào tôm khô', 'Canh bí đỏ nấu xương'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Gà lát chay kho nấm', 'Cá chay chiên sả gừng', 'Su su xào tỏi', 'Canh bí đỏ'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt heo rim tiêu', 'Chả cá sốt cà', 'Cải thìa luộc sốt tỏi', 'Canh mướp hương thịt bằm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Đậu hũ rim tiêu tộ', 'Chả chay sốt cà', 'Cải thìa luộc', 'Canh mướp hương'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 4
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Hủ tiếu thịt heo xá xíu', 'Rau tần ô hẹ'],
    meatDessert: 'Chuối',
    vegDishes: ['Hủ tiếu chay xá xíu nấm', 'Hẹ tần ô'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò xào hành cần tây', 'Cá basa kho dưa cải', 'Đậu phộng rang tỏi', 'Canh rau má tôm'],
    meatDessert: 'Quýt đường',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào hành cần', 'Đậu hũ kho dưa cải', 'Đậu phộng rang tỏi', 'Canh rau má'],
    vegDessert: 'Quýt đường',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Trứng chiên thịt nạc băm', 'Cá nục kho tiêu', 'Bắp cải luộc dầm trứng', 'Canh chua thơm cà'],
    meatDessert: 'Táo',
    vegDishes: ['Cơm trắng', 'Đậu hũ chiên sốt nấm', 'Chả cá chay kho tiêu', 'Bắp cải luộc', 'Canh chua chay'],
    vegDessert: 'Táo',
    isWeighedOk: true
  },

  // Thứ 5
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Xôi vò chả lụa thịt kho', 'Hành phi giòn'],
    meatDessert: 'Sữa bắp non',
    vegDishes: ['Xôi vò chả lụa chay', 'Hành phi'],
    vegDessert: 'Sữa bắp non',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà chiên nước mắm tỏi', 'Tép xào dưa leo', 'Rau lang luộc chấm kho quẹt', 'Canh súp củ dền'],
    meatDessert: 'Thạch rau câu dừa',
    vegDishes: ['Cơm trắng', 'Đùi gà chay chiên mắm', 'Tép chay xào dưa leo', 'Rau lang luộc chấm chao', 'Canh củ dền chay'],
    vegDessert: 'Thạch rau câu dừa',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt ba rọi kho trứng cút', 'Cá hú kho tộ', 'Cải ngọt xào tỏi', 'Canh cải xanh gừng tươi'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho trứng chay', 'Cá chay kho tộ', 'Cải ngọt xào tỏi', 'Canh cải xanh'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },

  // Thứ 6
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh hỏi thịt nướng lá lốt', 'Mỡ hành đậu phộng'],
    meatDessert: 'Chè đậu đỏ',
    vegDishes: ['Bánh hỏi thịt chay nướng lá lốt', 'Mỡ hành đậu phộng'],
    vegDessert: 'Chè đậu đỏ',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn cốt lết ram sả ớt', 'Mực xào thơm cà', 'Cà tím nướng mỡ hành', 'Canh bí xanh nấu tôm'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Sườn chay ram sả ớt', 'Nấm xào thơm cà', 'Cà tím nướng mỡ hành chay', 'Canh bí xanh nấm'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà xào sả ớt', 'Cá trê chiên giòn mắm gừng', 'Rau muống xào chao', 'Canh bầu nấu tôm bằm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Gà lát chay xào sả ớt', 'Đậu hũ chiên giòn mắm gừng chay', 'Rau muống xào chao', 'Canh bầu nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 7
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún mắm miền Tây thịt quay tôm', 'Rau đắng bông súng'],
    meatDessert: 'Nước sâm thốt nốt',
    vegDishes: ['Bún mắm chay nấm đậu hũ', 'Rau đắng bông súng'],
    vegDessert: 'Nước sâm thốt nốt',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho mắm ruốc', 'Cá kèo kho rau răm', 'Đậu que luộc', 'Canh cua đồng rau đay'],
    meatDessert: 'Cam sành',
    vegDishes: ['Cơm trắng', 'Nấm rơm kho sả ớt', 'Đậu hũ kho rau răm', 'Đậu que luộc chấm tương', 'Canh rau đay'],
    vegDessert: 'Cam sành',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào bông cải xanh', 'Cá diêu hồng chiên xù', 'Khổ qua bào ướp đá chà bông', 'Canh sườn hầm củ'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Bò chay xào bông cải', 'Chả cá chay chiên xù', 'Khổ qua luộc chấm chao', 'Canh củ hầm nấm'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Chủ nhật
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Cháo lòng má heo dồi trường', 'Quẩy giòn giá đỗ'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Cháo nấm rơm hạt sen chay', 'Quẩy giòn'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi vịt tiềm hạt sen', 'Cá lóc phi lê kho tiêu', 'Cải thìa xào nấm đông cô', 'Canh rong biển thịt bằm'],
    meatDessert: 'Dưa lưới',
    vegDishes: ['Cơm trắng', 'Đùi vịt chay tiềm hạt sen', 'Đậu hũ kho tiêu', 'Cải thìa xào nấm', 'Canh rong biển đậu hũ'],
    vegDessert: 'Dưa lưới',
    isWeighedOk: true
  },
  {
    vendorId: 'huong-ngoc-phat',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Tôm nướng muối ớt', 'Thịt ba rọi cuộn nấm kim châm', 'Rau sống dưa leo', 'Canh chua cá bông lau'],
    meatDessert: 'Nho ngọt',
    vegDishes: ['Cơm trắng', 'Tôm chay nướng muối ớt', 'Nấm cuộn đậu hũ nướng', 'Rau sống dưa leo', 'Canh chua chay'],
    vegDessert: 'Nho ngọt',
    isWeighedOk: true
  },
];

// =========================================================================
// 6. THIÊN HỒNG PHÚC (7 NGÀY X 3 CA = 21 CA ĐỘC LẬP)
// =========================================================================
export const THIEN_HONG_PHUC_MENUS: DayShiftMenu[] = [
  // Thứ 2
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Xôi mặn thịt gà xé', 'Hành phi ruốc mặn'],
    meatDessert: 'Chuối',
    vegDishes: ['Xôi gấc đậu xanh chay', 'Hạt sen'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Cá nục kho cà', 'Thịt heo xào chua ngọt', 'Cải xanh luộc gừng', 'Canh súp củ dền'],
    meatDessert: 'Thơm chín cây',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho sốt cà chua', 'Sườn non chay xào chua ngọt', 'Cải xanh luộc chao', 'Canh súp củ dền'],
    vegDessert: 'Thơm chín cây',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt kho tiêu', 'Trứng chiên hành hoa', 'Bắp cải xào cà rốt', 'Canh mướp hương nấu thịt'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Nấm đùi gà kho tiêu', 'Đậu hũ chiên giòn', 'Bắp cải xào', 'Canh mướp hương'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Thứ 3
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì thịt nướng sả ớt', 'Đồ chua dưa leo'],
    meatDessert: 'Sữa tươi tiệt trùng',
    vegDishes: ['Bánh mì thịt chay nướng sả', 'Đồ chua'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà rô ti ngũ vị', 'Tép rang thịt ba rọi', 'Rau muống xào tỏi', 'Canh chua cá điêu hồng'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Đùi gà chay rô ti', 'Tép chay rang mè', 'Rau muống xào tỏi', 'Canh chua chay bạc hà'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn heo rim mặn', 'Cá basa sốt chua ngọt', 'Đậu bắp luộc chấm chao', 'Canh bí xanh nấu tôm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Sườn chay rim mặn', 'Đậu hũ sốt chua ngọt', 'Đậu bắp luộc chấm chao', 'Canh bí xanh nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 4
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Phở bò tái nạm', 'Rau quế ngò gai'],
    meatDessert: 'Sữa đậu nành lá dứa',
    vegDishes: ['Phở nấm bò viên chay', 'Rau quế ngò gai'],
    vegDessert: 'Sữa đậu nành lá dứa',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò xào đậu cô ve', 'Cá lóc chiên mắm xoài', 'Cải ngọt xào dầu hào', 'Canh khổ qua nấu xương'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào đậu cô ve', 'Chả cá chay chiên mắm xoài', 'Cải ngọt xào', 'Canh khổ qua nấm'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Thịt kho trứng cút nước dừa', 'Chả cá kho dưa cải', 'Su su luộc chấm muối mè', 'Canh rau ngót thịt bằm'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho nấm nước dừa', 'Chả chay kho dưa cải', 'Su su luộc', 'Canh rau ngót nấm'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },

  // Thứ 5
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Hủ tiếu khô thịt nạc xá xíu', 'Chén súp xương'],
    meatDessert: 'Sữa chua men sống',
    vegDishes: ['Hủ tiếu khô chay nấm xá xíu', 'Chén súp nấm'],
    vegDessert: 'Sữa chua men sống',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Mực xào chua ngọt cần tây', 'Cá thu chiên sốt cà', 'Bắp cải xào tỏi', 'Canh mồng tơi nấu tôm khô'],
    meatDessert: 'Táo',
    vegDishes: ['Cơm trắng', 'Nấm xào chua ngọt cần tây', 'Đậu hũ sốt cà chua', 'Bắp cải xào tỏi', 'Canh mồng tơi'],
    vegDessert: 'Táo',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà kho gừng sả', 'Trứng ốp la sốt tương', 'Rau lang luộc chấm kho quẹt', 'Canh chua bông điên điển'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Gà lát chay kho gừng', 'Đậu hũ chiên sốt tương', 'Rau lang luộc chấm chao', 'Canh chua chay'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 6
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh cuốn Tây Hồ nhân tôm thịt', 'Rau giá hành phi'],
    meatDessert: 'Nước mía tắc',
    vegDishes: ['Bánh cuốn chay nhân mộc nhĩ nấm', 'Rau giá'],
    vegDessert: 'Nước mía tắc',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Heo quay kho cải chua', 'Tôm rim mặn ngọt', 'Đậu cô ve luộc', 'Canh rau má nấu thịt nạc'],
    meatDessert: 'Cam sành',
    vegDishes: ['Cơm trắng', 'Heo quay chay kho cải chua', 'Tôm chay rim mặn', 'Đậu cô ve luộc', 'Canh rau má nấm'],
    vegDessert: 'Cam sành',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn non xào dưa leo cà chua', 'Cá trê chiên mắm gừng', 'Cải thìa xào tỏi', 'Canh bầu nấu tôm bằm'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Sườn chay xào dưa leo', 'Đậu hũ chiên mắm gừng chay', 'Cải thìa xào tỏi', 'Canh bầu nấm'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },

  // Thứ 7
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún mọc thịt bằm măng tươi', 'Rau sống'],
    meatDessert: 'Sữa đậu phộng',
    vegDishes: ['Bún mọc chay nấm măng tươi', 'Rau sống'],
    vegDessert: 'Sữa đậu phộng',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò né xào khổ qua', 'Cá basa kho tộ', 'Rau củ luộc thập cẩm', 'Canh sườn nấu củ từ'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Bò chay xào khổ qua', 'Đậu hũ kho tộ', 'Rau củ luộc chấm chao', 'Canh củ hầm nấm'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Đùi gà sốt chua cay', 'Chả cá sốt tiêu tỏi', 'Rau muống xào tỏi', 'Canh bí đỏ thịt bằm'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Đùi gà chay sốt chua cay', 'Chả chay sốt tiêu', 'Rau muống xào tỏi', 'Canh bí đỏ'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Chủ nhật
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Nui xào xúc xích thịt bằm', 'Hành tây sốt cà'],
    meatDessert: 'Sữa chua hoa quả',
    vegDishes: ['Nui xào nấm đậu hũ xúc xích chay', 'Hành tây sốt cà'],
    vegDessert: 'Sữa chua hoa quả',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Vịt nấu chao khoai môn', 'Cá diêu hồng chiên xù', 'Cải xoong xào tỏi', 'Canh cua mồng tơi rau đay'],
    meatDessert: 'Nho ngọt',
    vegDishes: ['Cơm trắng', 'Vịt chay nấu chao khoai môn', 'Chả cá chay chiên xù', 'Cải xoong xào tỏi', 'Canh mồng tơi'],
    vegDessert: 'Nho ngọt',
    isWeighedOk: true
  },
  {
    vendorId: 'thien-hong-phuc',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn non nướng mật ong', 'Tôm xào bông cải xanh', 'Đậu que luộc chấm mắm trứng', 'Canh rong biển sườn'],
    meatDessert: 'Dưa lưới',
    vegDishes: ['Cơm trắng', 'Sườn chay nướng sốt tương', 'Tôm chay xào bông cải', 'Đậu que luộc chấm chao', 'Canh rong biển đậu hũ'],
    vegDessert: 'Dưa lưới',
    isWeighedOk: true
  },
];

// =========================================================================
// 7. VINA STORY (7 NGÀY X 3 CA = 21 CA ĐỘC LẬP)
// =========================================================================
export const VINA_STORY_MENUS: DayShiftMenu[] = [
  // Thứ 2
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Cháo thịt gà xé hạt sen', 'Quẩy giòn hành phi'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Cháo nấm rơm hạt sen chay', 'Quẩy giòn hành phi'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho củ cải trắng', 'Cá lóc phi lê kho tộ', 'Rau lang luộc chấm kho quẹt', 'Canh cua mồng tơi'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Sườn non chay kho củ cải', 'Đậu hũ kho tộ', 'Rau lang luộc chấm chao', 'Canh mồng tơi'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 2',
    dateStr: '05/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào cần tây hành tây', 'Cá điêu hồng chiên xù', 'Cải ngọt xào dầu hào', 'Canh rau dền tôm khô'],
    meatDessert: 'Táo',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào cần tây', 'Đậu hũ sốt cà', 'Cải ngọt xào', 'Canh rau dền'],
    vegDessert: 'Táo',
    isWeighedOk: true
  },

  // Thứ 3
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh mì chả bò Đà Nẵng', 'Dưa leo ớt rim'],
    meatDessert: 'Sữa bắp',
    vegDishes: ['Bánh mì chả chay rong biển', 'Dưa leo sốt tương'],
    vegDessert: 'Sữa bắp',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Đùi gà rô ti nước dừa', 'Tôm rim mặn ngọt', 'Đậu cô ve xào tỏi', 'Canh bí đao thịt bằm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Đùi gà chay rô ti nước dừa', 'Tôm chay rim mặn ngọt', 'Đậu cô ve xào tỏi', 'Canh bí đao nấm'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 3',
    dateStr: '06/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Sườn non ram mặn', 'Cá nục kho tiêu', 'Rau muống xào tỏi', 'Canh chua cá basa'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Sườn chay ram mặn', 'Đậu hũ kho tiêu', 'Rau muống xào tỏi', 'Canh chua chay'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },

  // Thứ 4
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bún chả quạt Hà Nội', 'Rau sống đồ chua nước mắm'],
    meatDessert: 'Nước sâm bí đao',
    vegDishes: ['Bún chả nấm nướng chay', 'Rau sống đồ chua'],
    vegDessert: 'Nước sâm bí đao',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt ba rọi kho trứng cút', 'Cá basa chiên giòn mắm me', 'Bắp cải xào tỏi', 'Canh khoai mỡ nấu tôm'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho trứng chay', 'Chả cá chay chiên mắm me', 'Bắp cải xào tỏi', 'Canh khoai mỡ nấm'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 4',
    dateStr: '07/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Gà chiên nước mắm tỏi', 'Trứng cuộn thịt bằm', 'Bầu luộc chấm chao', 'Canh cải xanh gừng tươi'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Gà lát chay chiên mắm', 'Đậu hũ cuộn rong biển', 'Bầu luộc chấm chao', 'Canh cải xanh'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Thứ 5
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Mì tôm xào bò trứng ốp la', 'Cải thìa'],
    meatDessert: 'Sữa chua men sống',
    vegDishes: ['Mì tôm chay xào nấm bò viên chay', 'Cải thìa'],
    vegDessert: 'Sữa chua men sống',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò xào bông cải cà rốt', 'Cá thu Nhật kho cà', 'Rau củ luộc thập cẩm', 'Canh bí đỏ đậu phộng'],
    meatDessert: 'Cam sành',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào bông cải', 'Đậu hũ kho sốt cà', 'Rau củ luộc chấm chao', 'Canh bí đỏ đậu phộng'],
    vegDessert: 'Cam sành',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Heo quay kho măng', 'Chả cá sốt tiêu tỏi', 'Cải thảo xào nấm', 'Canh súp củ dền'],
    meatDessert: 'Dưa hấu',
    vegDishes: ['Cơm trắng', 'Heo quay chay kho măng', 'Chả chay sốt tiêu tỏi', 'Cải thảo xào nấm', 'Canh súp củ dền'],
    vegDessert: 'Dưa hấu',
    isWeighedOk: true
  },

  // Thứ 6
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh giò nóng thịt bằm mộc nhĩ', 'Dưa góp giòn'],
    meatDessert: 'Sữa đậu nành',
    vegDishes: ['Bánh giò chay mộc nhĩ nấm hạt sen', 'Dưa góp'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Sườn cốt lết sốt mật ong', 'Mực xào hành cần tây', 'Su su xào tôm khô', 'Canh rau ngót nấu thịt'],
    meatDessert: 'Thạch rau câu',
    vegDishes: ['Cơm trắng', 'Sườn chay sốt mật mía', 'Nấm xào hành cần tây', 'Su su xào tỏi', 'Canh rau ngót nấm'],
    vegDessert: 'Thạch rau câu',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 6',
    dateStr: '09/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Vịt kho sả gừng', 'Cá điêu hồng chiên xù mắm tỏi', 'Rau lang luộc chấm tương', 'Canh mướp mồng tơi'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Vịt chay kho sả gừng', 'Chả cá chay chiên mắm gừng', 'Rau lang luộc', 'Canh mướp mồng tơi'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 7
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Hủ tiếu mì hoành thánh thịt heo', 'Hẹ giá'],
    meatDessert: 'Sữa tươi',
    vegDishes: ['Hủ tiếu mì hoành thánh chay nấm', 'Hẹ giá'],
    vegDessert: 'Sữa đậu nành',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Thịt kho mắm ruốc thịt nạc', 'Cá trê chiên giòn mắm gừng', 'Đậu bắp luộc chấm chao', 'Canh chua tôm thơm cà'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Nấm rơm kho sả ruốc chay', 'Đậu hũ chiên mắm gừng chay', 'Đậu bắp luộc chấm chao', 'Canh chua chay'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Đùi gà nướng muối ớt', 'Tôm xào bông cải xanh', 'Khổ qua xào trứng', 'Canh sườn hầm củ sen'],
    meatDessert: 'Thanh long',
    vegDishes: ['Cơm trắng', 'Đùi gà chay nướng muối ớt', 'Tôm chay xào bông cải', 'Khổ qua xào đậu hũ', 'Canh củ sen hầm nấm'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Chủ nhật
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa sáng',
    meatDishes: ['Bánh bao nhân thịt trứng cút', 'Dưa chuột'],
    meatDessert: 'Sữa bắp non',
    vegDishes: ['Bánh bao chay nhân nấm miến trứng muối chay'],
    vegDessert: 'Sữa bắp non',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa trưa',
    meatDishes: ['Cơm trắng', 'Bò né xào thiên lý', 'Cá lóc phi lê kho tiêu tộ', 'Cải xoong xào tỏi', 'Canh cua đồng mồng tơi'],
    meatDessert: 'Dưa lưới',
    vegDishes: ['Cơm trắng', 'Bò chay xào hoa thiên lý', 'Đậu hũ kho tiêu tộ', 'Cải xoong xào tỏi', 'Canh mồng tơi nấm'],
    vegDessert: 'Dưa lưới',
    isWeighedOk: true
  },
  {
    vendorId: 'vina-story',
    dayOfWeek: 'Chủ nhật',
    dateStr: '11/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Lẩu riêu cua đồng bắp bò sườn sụn', 'Bún tươi', 'Rau sống hoa chuối', 'Canh riêu thanh ngọt'],
    meatDessert: 'Nho ngọt',
    vegDishes: ['Cơm trắng', 'Lẩu riêu chay nấm đậu hũ', 'Bún tươi', 'Rau sống hoa chuối', 'Canh riêu chay'],
    vegDessert: 'Nho ngọt',
    isWeighedOk: true
  },
];

// =========================================================================
// TOÀN BỘ 7 NHÀ CUNG CẤP (147 CA ĂN ĐẦY ĐỦ, CHÍNH XÁC 100%)
// =========================================================================
export const PRELOADED_MENUS: DayShiftMenu[] = [
  ...TAM_PHUONG_MENUS,
  ...LIM_DUONG_MENUS,
  ...MINH_LONG_FOOD_MENUS,
  ...NGUYEN_SAI_GON_MENUS,
  ...HUONG_NGOC_PHAT_MENUS,
  ...THIEN_HONG_PHUC_MENUS,
  ...VINA_STORY_MENUS,
].map(cleanMenuObj);

/**
 * Tra cứu thực đơn chuẩn xác tuyệt đối theo NCC, Thứ và Ca ăn.
 * TUYỆT ĐỐI KHÔNG GỘP CHUNG, KHÔNG LẤY NHẦM MÓN CỦA NCC NÀY SANG NCC KHÁC.
 */
export const getMenuForVendorAndShift = (
  menus: DayShiftMenu[] = [],
  vendorId: string = 'tam-phuong',
  dayOfWeek: string = 'Thứ 2',
  shift: MealShift = 'Bữa sáng'
): DayShiftMenu => {
  const safeList = Array.isArray(menus) ? menus : [];

  // 1. Kiểm tra chính xác trong danh sách thực đơn hiện tại của người dùng (state)
  const exactInCurrent = safeList.find(
    (m) => m && m.vendorId === vendorId && m.dayOfWeek === dayOfWeek && m.shift === shift
  );
  if (exactInCurrent) {
    return cleanMenuObj(exactInCurrent);
  }

  // 2. Kiểm tra chính xác trong cơ sở dữ liệu mẫu chuẩn PRELOADED_MENUS của đúng vendorId đó
  const exactInPreloaded = PRELOADED_MENUS.find(
    (m) => m && m.vendorId === vendorId && m.dayOfWeek === dayOfWeek && m.shift === shift
  );
  if (exactInPreloaded) {
    return cleanMenuObj(exactInPreloaded);
  }

  // 3. Fallback chỉ trong phạm vi của đúng nhà cung cấp đó (cùng ca ăn)
  const vendorShift = PRELOADED_MENUS.find(
    (m) => m && m.vendorId === vendorId && m.shift === shift
  );
  if (vendorShift) {
    return cleanMenuObj(vendorShift);
  }

  // 4. Fallback chỉ trong phạm vi của đúng nhà cung cấp đó (bất kỳ ca ăn)
  const vendorAny = PRELOADED_MENUS.find((m) => m && m.vendorId === vendorId);
  if (vendorAny) {
    return cleanMenuObj(vendorAny);
  }

  // 5. Nếu nhà cung cấp hoàn toàn mới, trả về khung rỗng của đúng vendorId đó
  return {
    vendorId,
    dayOfWeek,
    dateStr: '',
    shift,
    meatDishes: ['Cơm trắng', 'Món mặn theo ca'],
    meatDessert: 'Trái cây theo mùa',
    vegDishes: ['Cơm trắng', 'Món chay theo ca'],
    vegDessert: 'Trái cây theo mùa',
    isWeighedOk: true,
  };
};
