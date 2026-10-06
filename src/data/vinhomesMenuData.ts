import { VendorPortionRow, DayShiftMenu, MealShift } from '../types/report';

export const DEFAULT_VENDORS: VendorPortionRow[] = [
  { id: 'tam-phuong', name: 'Tám Phương', code: 'TP', td8: 0, td11_1: 0, td11_3: 0 },
  { id: 'lim-duong', name: 'Lim Dương', code: 'LD', td8: 0, td11_1: 0, td11_3: 0 },
  { id: 'vina-story', name: 'Vina Story', code: 'VS', td8: 0, td11_1: 0, td11_3: 0 },
  { id: 'minh-long-food', name: 'Minh Long Food', code: 'ML', td8: 699, td11_1: 207, td11_3: 245 },
  { id: 'nguyen-sai-gon', name: 'Nguyên Sài Gòn', code: 'NS', td8: 534, td11_1: 441, td11_3: 142 },
  { id: 'huong-ngoc-phat', name: 'Hương Ngọc Phát', code: 'HN', td8: 621, td11_1: 349, td11_3: 319 },
  { id: 'thien-hong-phuc', name: 'Thiên Hồng Phúc', code: 'TH', td8: 415, td11_1: 207, td11_3: 207 },
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

// Helper to build 7-day menus for any vendor
const buildVendorWeeklyMenus = (vendorId: string): DayShiftMenu[] => {
  if (vendorId === 'tam-phuong') {
    return [
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
        // Exact from user Image 3: Tám Phương Bữa tối ngày 05/10/2026
        meatDishes: ['Cơm trắng', 'Sườn heo ram củ cải', 'Cá nục chiên rim mắm', 'Mắm thái', 'Cải ngọt xào', 'Canh bồ ngót'],
        meatDessert: 'Ổi',
        vegDishes: ['Cơm trắng', 'Cá bống ram mè', 'Rau củ luộc + chao', 'Đậu phộng rang muối', 'Cải ngọt xào', 'Canh bồ ngót'],
        vegDessert: 'Ổi',
        isWeighedOk: true
      },

      // Thứ 3 (06/10/2026) - Exactly as user emphasized: tráng miệng chay là Sữa đậu nành
      {
        vendorId: 'tam-phuong',
        dayOfWeek: 'Thứ 3',
        dateStr: '06/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Bánh mì chả lụa thịt nguội', 'Rau dưa ăn kèm'],
        meatDessert: 'Sữa đậu nành',
        vegDishes: ['Bánh mì chả lụa chay', 'Rau dưa ăn kèm'],
        vegDessert: 'Sữa đậu nành', // EXACT USER INSTRUCTION
        isWeighedOk: true
      },
      {
        vendorId: 'tam-phuong',
        dayOfWeek: 'Thứ 3',
        dateStr: '06/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Heo quay kho củ cải', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
        meatDessert: 'Thạch rau câu (1 hũ)',
        vegDishes: ['Cơm trắng', 'Sườn chay kho măng', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
        vegDessert: 'Thạch rau câu (1 hũ)',
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
        meatDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt', 'Thịt kho tiêu', 'Cải ngọt + cà rốt xào', 'Canh mướp mồng tơi'],
        meatDessert: 'Thanh long',
        vegDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt chay', 'Ruột heo kho tiêu chay', 'Cà tím xào đậu hũ', 'Cải ngọt + cà rốt xào', 'Canh mướp mồng tơi'],
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
        vegDishes: ['Sườn chay nấu lagu + Bánh mì'],
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
        vegDishes: ['Bánh ướt chả giò chay (2 cuốn)'],
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
        meatDishes: ['Cơm trắng', 'Đùi gà rôti', 'Chả chay kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
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
  }

  // Exact menu sheet from Image 4: CÔNG TY CỔ PHẦN LIM DƯƠNG
  if (vendorId === 'lim-duong') {
    return [
      // Thứ 2
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 2',
        dateStr: '05/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Phở áp chảo bò (Phở: 200-220g, Bò: 40g, Rau: 30g)'],
        meatDessert: 'Sữa chua',
        vegDishes: ['Phở áp chảo bò (Phở: 200-220gr, Bò chay: 35-45gr, Rau: 30-35gr)'],
        vegDessert: 'Sữa chua',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 2',
        dateStr: '05/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng (280-300g)', 'Cá cơm kho tiêu (70-80g)', 'Sườn rim sả ớt (30-40g)', 'Cải ngọt xào (70-80g)', 'Canh khổ qua (240-260ml)'],
        meatDessert: 'Chuối (90-100g)',
        vegDishes: ['Cơm trắng (280-300gr)', 'Đậu hũ kho thập cẩm (70-80g)', 'Cá cơm kho tiêu chay (70-80g)', 'Sườn rim sả ớt (30-40g)', 'Cải ngọt xào (70-80g)', 'Canh khổ qua (240-260ml)'],
        vegDessert: 'Chuối (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 2',
        dateStr: '05/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng (280-300g)', 'Bò xào sả (70-80g)', 'Đậu hũ chiên sả ớt (70-80g)', 'Đậu phộng rang (30-40g)', 'Cải thảo xào (70-80g)', 'Canh súp (240-260ml)'],
        meatDessert: 'Ổi (90-100g)',
        vegDishes: ['Cơm trắng (280-300gr)', 'Bò lát xào sả (70-80g)', 'Đậu hũ chiên sả ớt (70-80g)', 'Đậu phộng rang (30-40g)', 'Cải thảo xào (70-80g)', 'Canh súp (240-260ml)'],
        vegDessert: 'Ổi (90-100gr)',
        isWeighedOk: true
      },

      // Thứ 3
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 3',
        dateStr: '06/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Bánh mì chả lụa (1 ổ, chả: 35g, rau: 30g)'],
        meatDessert: 'Sữa đậu nành',
        vegDishes: ['Bánh mì (1 ổ)', 'Chả lụa chay (30-40gr)', 'Rau (30-35gr)'],
        vegDessert: 'Sữa đậu nành',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 3',
        dateStr: '06/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Heo quay kho củ cải', 'Sườn kho măng', 'Đậu hũ xào hành', 'Bầu luộc', 'Canh khoai mỡ'],
        meatDessert: 'Thạch rau câu (90-100gr / 1 hũ)',
        vegDishes: ['Cơm trắng', 'Heo quay kho củ cải chay (70-80g)', 'Sườn chay kho măng (70-80g)', 'Đậu hũ xào hành (30-40g)', 'Bầu luộc (70-80g)', 'Canh khoai mỡ (240-260ml)'],
        vegDessert: 'Thạch rau câu (90-100gr / 1 hũ)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 3',
        dateStr: '06/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Sườn xào su củ rốt', 'Đậu hũ kho tương', 'Chả kho tiêu', 'Rau muống xào tỏi', 'Canh bí xanh'],
        meatDessert: 'Táo xanh (90-100gr)',
        vegDishes: ['Cơm trắng', 'Sườn xào su củ rốt (70-80g)', 'Đậu hũ kho tương (70-80g)', 'Chả chay kho tiêu (30-40g)', 'Rau muống xào tỏi (70-80g)', 'Canh bí xanh (240-260ml)'],
        vegDessert: 'Táo xanh (90-100gr)',
        isWeighedOk: true
      },

      // Thứ 4
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 4',
        dateStr: '07/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Bánh hỏi thịt heo khìa', 'Rau củ'],
        meatDessert: 'Chuối',
        vegDishes: ['Bánh hỏi (200-220gr)', 'Thịt heo chay (40-50gr)', 'Rau củ (30-40gr)'],
        vegDessert: 'Chuối',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 4',
        dateStr: '07/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Chả cá kho tiêu', 'Gà lát xào sả tế', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu'],
        meatDessert: 'Chuối (90-100gr)',
        vegDishes: ['Cơm trắng', 'Chả nấm kho tiêu (70-80g)', 'Gà lát xào sả tế chay (70-80g)', 'Đậu phộng rang (25-35g)', 'Đậu bắp luộc (70-80g)', 'Canh bầu (240-260ml)'],
        vegDessert: 'Chuối (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 4',
        dateStr: '07/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt', 'Ruột heo kho tiêu', 'Cà tím xào đậu hũ', 'Cải ngọt + cà rốt xào', 'Canh mướp mồng tơi'],
        meatDessert: 'Thanh long (90-100gr)',
        vegDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt chay (70-80g)', 'Ruột heo kho tiêu chay (70-80g)', 'Cà tím xào đậu hũ (30-40g)', 'Cải ngọt + cà rốt xào (70-80g)', 'Canh mướp mồng tơi (240-260ml)'],
        vegDessert: 'Thanh long (90-100gr)',
        isWeighedOk: true
      },

      // Thứ 5
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 5',
        dateStr: '08/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Bánh mì (1 ổ)', 'Sườn heo lagu (40-50g)', 'Nước soup (150-200ml)'],
        meatDessert: 'Táo xanh',
        vegDishes: ['Bánh mì (1 ổ)', 'Sườn heo chay (40-50gr)', 'Rau củ (30-35gr)', 'Nước soup (150-200ml)'],
        vegDessert: 'Táo xanh',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 5',
        dateStr: '08/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Đùi gà chiên sốt tương', 'Đậu hũ sốt tứ xuyên', 'Đậu phộng rang tỏi ớt', 'Rau củ luộc', 'Canh rau má'],
        meatDessert: 'Táo xanh (90-100gr)',
        vegDishes: ['Cơm trắng', 'Đùi gà chiên sốt tương cay (70-80g)', 'Đậu hũ sốt tứ xuyên (70-80g)', 'Đậu phộng rang tỏi ớt (30-40g)', 'Rau củ luộc (70-80g)', 'Canh rau má (240-260ml)'],
        vegDessert: 'Táo xanh (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 5',
        dateStr: '08/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Bò xào dưa leo', 'Đậu hũ chiên sốt sả ớt', 'Tôm rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
        meatDessert: 'Ổi (90-100gr)',
        vegDishes: ['Cơm trắng', 'Bò lát xào dưa leo (70-80g)', 'Đậu hũ chiên sốt sả ớt (70-80g)', 'Tôm chay rim mặn (30-40g)', 'Cà tím xào tỏi (70-80g)', 'Canh rau dền (240-260ml)'],
        vegDessert: 'Ổi (90-100gr)',
        isWeighedOk: true
      },

      // Thứ 6
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 6',
        dateStr: '09/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Bánh cuốn chả lụa chả giò thịt'],
        meatDessert: 'Quýt (90-100gr)',
        vegDishes: ['Bánh cuốn (200-220gr)', 'Chả giò chay (2 cuốn)', 'Rau (30-35gr)'],
        vegDessert: 'Quýt (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 6',
        dateStr: '09/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Gà lát xào sả tế', 'Cá viên rau muống', 'Đậu hũ tứ xuyên', 'Dưa leo xào', 'Canh cải ngọt'],
        meatDessert: 'Quýt (90-100gr)',
        vegDishes: ['Cơm trắng', 'Gà lát xào sả tế (70-80g)', 'Cá viên rau muống chay (70-80g)', 'Đậu hũ tứ xuyên (30-40g)', 'Dưa leo xào (70-80g)', 'Canh cải ngọt (240-260ml)'],
        vegDessert: 'Quýt (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 6',
        dateStr: '09/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Ruột heo rô ti', 'Đậu hũ kho tương', 'Sườn non rim mắm ngọt', 'Rau củ luộc', 'Canh rau muống'],
        meatDessert: 'Thanh long (90-100gr)',
        vegDishes: ['Cơm trắng', 'Ruột heo rô ti chay (70-80g)', 'Đậu hũ kho tương (70-80g)', 'Sườn non rim mắm ngọt (30-40g)', 'Rau củ luộc (70-80g)', 'Canh rau muống (240-260ml)'],
        vegDessert: 'Thanh long (90-100gr)',
        isWeighedOk: true
      },

      // Thứ 7
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 7',
        dateStr: '10/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Mì trứng xào tôm thịt'],
        meatDessert: 'Chuối',
        vegDishes: ['Mì trứng (200-220gr)', 'Thịt heo chay (30-40gr)', 'Tôm chay (10gr)', 'Rau (30-35gr)'],
        vegDessert: 'Chuối',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 7',
        dateStr: '10/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Đùi gà rôti', 'Chả kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
        meatDessert: 'Chuối (90-100gr)',
        vegDishes: ['Cơm trắng', 'Đùi gà rôti chay (70-80g)', 'Chả chay kho thơm (70-80g)', 'Đậu hũ xào su su (30-40g)', 'Bầu luộc (70-80g)', 'Canh bí xanh (240-260ml)'],
        vegDessert: 'Chuối (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Thứ 7',
        dateStr: '10/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Cá cơm kho thơm', 'Ruột heo rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
        meatDessert: 'Quýt (90-100gr)',
        vegDishes: ['Cơm trắng', 'Cá cơm kho thơm chay (70-80g)', 'Ruột heo rim mặn ngọt (70-80g)', 'Đậu phộng rang tỏi (30-40g)', 'Bắp cải luộc (70-80g)', 'Canh cải xanh (240-260ml)'],
        vegDessert: 'Quýt (90-100gr)',
        isWeighedOk: true
      },

      // Chủ nhật
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Chủ nhật',
        dateStr: '11/10/2026',
        shift: 'Bữa sáng',
        meatDishes: ['Nui xào bò lát thịt bằm'],
        meatDessert: 'Sữa tươi',
        vegDishes: ['Nui (200-220gr)', 'Bò chay (40-45gr)', 'Rau (30-35gr)'],
        vegDessert: 'Sữa đậu nành',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Chủ nhật',
        dateStr: '11/10/2026',
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Bò xào thơm', 'Đậu hũ chiên sốt cà', 'Cá viên xào rau muống', 'Rau củ luộc', 'Canh khổ qua'],
        meatDessert: 'Thạch rau câu (90-100gr)',
        vegDishes: ['Cơm trắng', 'Bò xào thơm (70-80g)', 'Đậu hũ chiên sốt cà (70-80g)', 'Cá viên xào rau muống (30-40g)', 'Rau củ luộc (70-80g)', 'Canh khổ qua (240-260ml)'],
        vegDessert: 'Thạch rau câu (90-100gr)',
        isWeighedOk: true
      },
      {
        vendorId: 'lim-duong',
        dayOfWeek: 'Chủ nhật',
        dateStr: '11/10/2026',
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Tôm xào chua ngọt', 'Nấm đậu hũ kho tương', 'Sườn non chiên sả', 'Cải thìa xào', 'Canh bí xanh'],
        meatDessert: 'Ổi (90-100gr)',
        vegDishes: ['Cơm trắng', 'Tôm xào chua ngọt (70-80g)', 'Nấm đậu hũ kho tương (70-80g)', 'Sườn non chiên sả (30-40g)', 'Cải thìa xào (70-80g)', 'Canh bí xanh (240-260ml)'],
        vegDessert: 'Ổi (90-100gr)',
        isWeighedOk: true
      },
    ];
  }

  // Minh Long Food
  if (vendorId === 'minh-long-food') {
    return DAYS_OF_WEEK.flatMap(({ day, date }) => [
      {
        vendorId: 'minh-long-food',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa sáng',
        meatDishes: ['Hủ tiếu Nam Vang thịt heo tôm', 'Hẹ giá'],
        meatDessert: 'Sữa bắp',
        vegDishes: ['Hủ tiếu chay nấm rơm đậu hũ', 'Hẹ giá'],
        vegDessert: 'Sữa bắp',
        isWeighedOk: true
      },
      {
        vendorId: 'minh-long-food',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Gà kho sả ớt', 'Trứng chiên thịt bằm', 'Rau muống luộc dầm me', 'Canh rau má tôm khô'],
        meatDessert: 'Dưa hấu',
        vegDishes: ['Cơm trắng', 'Gà lát chay kho sả', 'Đậu hũ chiên giòn', 'Rau muống luộc chao', 'Canh rau má'],
        vegDessert: 'Dưa hấu',
        isWeighedOk: true
      },
      {
        vendorId: 'minh-long-food',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Thịt ba rọi kho trứng cút', 'Cá thu chiên sốt cà', 'Cải thìa xào tỏi', 'Canh cải xoong thịt bằm'],
        meatDessert: 'Chuối',
        vegDishes: ['Cơm trắng', 'Thịt kho trứng chay', 'Đậu hũ sốt cà', 'Cải thìa xào tỏi', 'Canh cải xoong'],
        vegDessert: 'Chuối',
        isWeighedOk: true
      },
    ]);
  }

  // Nguyên Sài Gòn
  if (vendorId === 'nguyen-sai-gon') {
    return DAYS_OF_WEEK.flatMap(({ day, date }) => [
      {
        vendorId: 'nguyen-sai-gon',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa sáng',
        meatDishes: ['Bánh mì xíu mại trứng cút', 'Dưa leo'],
        meatDessert: 'Sữa đậu nành',
        vegDishes: ['Bánh mì xíu mại chay', 'Dưa leo'],
        vegDessert: 'Sữa đậu nành',
        isWeighedOk: true
      },
      {
        vendorId: 'nguyen-sai-gon',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Sườn cốt lết ram', 'Cá điêu hồng chiên xù', 'Bắp cải xào tỏi', 'Canh mướp hương nấu thịt'],
        meatDessert: 'Ổi',
        vegDishes: ['Cơm trắng', 'Sườn non chay ram mặn', 'Chả cá chay sốt cà', 'Bắp cải xào tỏi', 'Canh mướp hương'],
        vegDessert: 'Ổi',
        isWeighedOk: true
      },
      {
        vendorId: 'nguyen-sai-gon',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Gà chiên nước mắm', 'Chả cá sốt cà', 'Đậu que xào thịt', 'Canh bí đỏ thịt bằm'],
        meatDessert: 'Chuối laba',
        vegDishes: ['Cơm trắng', 'Đậu hũ kho nấm rơm', 'Chả lụa chay rim mè', 'Đậu que xào', 'Canh bí đỏ'],
        vegDessert: 'Chuối laba',
        isWeighedOk: true
      },
    ]);
  }

  // Hương Ngọc Phát
  if (vendorId === 'huong-ngoc-phat') {
    return DAYS_OF_WEEK.flatMap(({ day, date }) => [
      {
        vendorId: 'huong-ngoc-phat',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa sáng',
        meatDishes: ['Bún xào thịt nạc xắt lát', 'Rau sống'],
        meatDessert: 'Sữa chua',
        vegDishes: ['Bún xào chay đậu hũ nấm', 'Rau sống'],
        vegDessert: 'Sữa chua',
        isWeighedOk: true
      },
      {
        vendorId: 'huong-ngoc-phat',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Thịt kho tàu nước dừa', 'Tôm ram thịt ba chỉ', 'Đậu cô ve xào tỏi', 'Canh bồ ngót thịt bằm'],
        meatDessert: 'Cam sành',
        vegDishes: ['Cơm trắng', 'Đậu hũ kho nước cốt dừa', 'Tôm chay rim mặn', 'Đậu cô ve xào tỏi', 'Canh bồ ngót'],
        vegDessert: 'Cam sành',
        isWeighedOk: true
      },
      {
        vendorId: 'huong-ngoc-phat',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Sườn ram mặn ngọt', 'Tép xào bông cải', 'Rau muống xào tỏi', 'Canh chua cá điêu hồng'],
        meatDessert: 'Thanh long',
        vegDishes: ['Cơm trắng', 'Sườn chay ram mặn', 'Nấm rơm xào bông cải', 'Rau muống xào tỏi', 'Canh chua chay'],
        vegDessert: 'Thanh long',
        isWeighedOk: true
      },
    ]);
  }

  // Thiên Hồng Phúc
  if (vendorId === 'thien-hong-phuc') {
    return DAYS_OF_WEEK.flatMap(({ day, date }) => [
      {
        vendorId: 'thien-hong-phuc',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa sáng',
        meatDishes: ['Xôi mặn thịt gà xé', 'Hành phi'],
        meatDessert: 'Chuối',
        vegDishes: ['Xôi gấc đậu xanh chay', 'Hạt sen'],
        vegDessert: 'Chuối',
        isWeighedOk: true
      },
      {
        vendorId: 'thien-hong-phuc',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa trưa',
        meatDishes: ['Cơm trắng', 'Cá nục kho cà', 'Thịt heo xào chua ngọt', 'Cải xanh luộc gừng', 'Canh súp củ dền'],
        meatDessert: 'Thơm chín cây',
        vegDishes: ['Cơm trắng', 'Đậu hũ kho sốt cà chua', 'Sườn non chay xào chua ngọt', 'Cải xanh luộc chao', 'Canh súp củ dền'],
        vegDessert: 'Thơm chín cây',
        isWeighedOk: true
      },
      {
        vendorId: 'thien-hong-phuc',
        dayOfWeek: day,
        dateStr: date,
        shift: 'Bữa tối',
        meatDishes: ['Cơm trắng', 'Thịt kho tiêu', 'Trứng chiên hành hoa', 'Bắp cải xào cà rốt', 'Canh mướp hương nấu thịt'],
        meatDessert: 'Quýt',
        vegDishes: ['Cơm trắng', 'Nấm đùi gà kho tiêu', 'Đậu hũ chiên giòn', 'Bắp cải xào', 'Canh mướp hương'],
        vegDessert: 'Quýt',
        isWeighedOk: true
      },
    ]);
  }

  // Vina Story
  return DAYS_OF_WEEK.flatMap(({ day, date }) => [
    {
      vendorId: 'vina-story',
      dayOfWeek: day,
      dateStr: date,
      shift: 'Bữa sáng',
      meatDishes: ['Cháo thịt gà xé', 'Quẩy giòn'],
      meatDessert: 'Sữa đậu nành',
      vegDishes: ['Cháo nấm rơm hạt sen chay', 'Quẩy giòn'],
      vegDessert: 'Sữa đậu nành',
      isWeighedOk: true
    },
    {
      vendorId: 'vina-story',
      dayOfWeek: day,
      dateStr: date,
      shift: 'Bữa trưa',
      meatDishes: ['Cơm trắng', 'Thịt kho củ cải', 'Cá lóc phi lê kho tộ', 'Rau lang luộc chấm kho quẹt', 'Canh cua mồng tơi'],
      meatDessert: 'Dưa hấu',
      vegDishes: ['Cơm trắng', 'Sườn non chay kho củ cải', 'Đậu hũ kho tộ', 'Rau lang luộc chấm chao', 'Canh mồng tơi'],
      vegDessert: 'Dưa hấu',
      isWeighedOk: true
    },
    {
      vendorId: 'vina-story',
      dayOfWeek: day,
      dateStr: date,
      shift: 'Bữa tối',
      meatDishes: ['Cơm trắng', 'Bò xào cần tây', 'Cá điêu hồng chiên xù', 'Cải ngọt xào dầu hào', 'Canh rau dền tôm'],
      meatDessert: 'Táo',
      vegDishes: ['Cơm trắng', 'Bò lát chay xào cần tây', 'Đậu hũ sốt cà', 'Cải ngọt xào', 'Canh rau dền'],
      vegDessert: 'Táo',
      isWeighedOk: true
    },
  ]);
};

// Build all menus across all 7 vendors
export const PRELOADED_MENUS: DayShiftMenu[] = [
  ...buildVendorWeeklyMenus('tam-phuong'),
  ...buildVendorWeeklyMenus('lim-duong'),
  ...buildVendorWeeklyMenus('minh-long-food'),
  ...buildVendorWeeklyMenus('nguyen-sai-gon'),
  ...buildVendorWeeklyMenus('huong-ngoc-phat'),
  ...buildVendorWeeklyMenus('thien-hong-phuc'),
  ...buildVendorWeeklyMenus('vina-story'),
];

export const getMenuForVendorAndShift = (
  menus: DayShiftMenu[],
  vendorId: string,
  dayOfWeek: string,
  shift: MealShift
): DayShiftMenu => {
  const exact = menus.find(
    (m) => m.vendorId === vendorId && m.dayOfWeek === dayOfWeek && m.shift === shift
  );
  if (exact) return exact;

  const vendorShift = menus.find(
    (m) => m.vendorId === vendorId && m.shift === shift
  );
  if (vendorShift) return vendorShift;

  const anyShift = menus.find(
    (m) => m.dayOfWeek === dayOfWeek && m.shift === shift
  );
  if (anyShift) return anyShift;

  return PRELOADED_MENUS[0];
};
