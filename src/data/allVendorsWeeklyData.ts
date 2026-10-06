import { DayShiftMenu } from '../types/report';

export const DAYS_CONFIG = [
  { day: 'Thứ 2', date: '05/10/2026' },
  { day: 'Thứ 3', date: '06/10/2026' },
  { day: 'Thứ 4', date: '07/10/2026' },
  { day: 'Thứ 5', date: '08/10/2026' },
  { day: 'Thứ 6', date: '09/10/2026' },
  { day: 'Thứ 7', date: '10/10/2026' },
  { day: 'Chủ nhật', date: '11/10/2026' },
];

// Helper to strip weights in code data
const clean = (s: string) => s.replace(/\s*\([^)]*?\)/g, '').trim();

// 1. CÔNG TY TNHH SUẤT ĂN TÁM PHƯƠNG
export const TAM_PHUONG_MENUS: DayShiftMenu[] = [
  // Thứ 2
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

  // Thứ 3 (06/10/2026) - Chuẩn xác Tám Phương
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
    meatDishes: ['Cơm trắng', 'Cá nục chiên rim mắm', 'Thịt ba rọi ram mặn', 'Cải ngọt xào tỏi', 'Canh bí xanh thịt bằm'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Đậu hũ kho tương', 'Chả nấm chiên sả', 'Cải ngọt xào', 'Canh bí xanh'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 4
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
    vegDishes: ['Cơm trắng', 'Chả nấm kho tiêu', 'Gà lát xào sả tế chay', 'Đậu phộng rang', 'Đậu bắp luộc', 'Canh bầu'],
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
    vegDishes: ['Cơm trắng', 'Cá cơm rim tỏi ớt chay', 'Đậu hũ kho tiêu', 'Cà tím xào', 'Canh mướp mồng tơi'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 5
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
    vegDishes: ['Cơm trắng', 'Đùi gà chay chiên sốt tương', 'Đậu hũ sốt cà', 'Rau củ luộc', 'Canh rau má'],
    vegDessert: 'Táo xanh',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 5',
    dateStr: '08/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Bò xào dưa leo', 'Đậu hũ chiên sả ớt', 'Tôm rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    meatDessert: 'Ổi',
    vegDishes: ['Cơm trắng', 'Bò lát chay xào dưa leo', 'Đậu hũ chiên sả ớt', 'Tôm chay rim mặn', 'Cà tím xào tỏi', 'Canh rau dền'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },

  // Thứ 6
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
    vegDishes: ['Cơm trắng', 'Gà lát xào sả tế chay', 'Cá viên chay', 'Dưa leo xào', 'Canh cải ngọt'],
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
    vegDishes: ['Cơm trắng', 'Ruột heo chay rô ti', 'Đậu hũ kho tương', 'Rau củ luộc', 'Canh rau muống'],
    vegDessert: 'Thanh long',
    isWeighedOk: true
  },

  // Thứ 7
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
    meatDishes: ['Cơm trắng', 'Đùi gà rô ti', 'Chả cá kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    meatDessert: 'Chuối',
    vegDishes: ['Cơm trắng', 'Đùi gà chay rô ti', 'Chả chay kho thơm', 'Đậu hũ xào su su', 'Bầu luộc', 'Canh bí xanh'],
    vegDessert: 'Chuối',
    isWeighedOk: true
  },
  {
    vendorId: 'tam-phuong',
    dayOfWeek: 'Thứ 7',
    dateStr: '10/10/2026',
    shift: 'Bữa tối',
    meatDishes: ['Cơm trắng', 'Cá cơm kho thơm', 'Sườn rim mặn ngọt', 'Đậu phộng rang tỏi', 'Bắp cải luộc', 'Canh cải xanh'],
    meatDessert: 'Quýt',
    vegDishes: ['Cơm trắng', 'Cá cơm chay kho thơm', 'Đậu hũ rim mặn ngọt', 'Đậu phộng rang', 'Bắp cải luộc', 'Canh cải xanh'],
    vegDessert: 'Quýt',
    isWeighedOk: true
  },

  // Chủ nhật
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
    vegDishes: ['Cơm trắng', 'Bò chay xào thơm', 'Đậu hũ sốt cà', 'Rau củ luộc', 'Canh khổ qua'],
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
    vegDishes: ['Cơm trắng', 'Tôm chay xào chua ngọt', 'Sườn chay chiên sả', 'Cải thìa xào', 'Canh bí xanh'],
    vegDessert: 'Ổi',
    isWeighedOk: true
  },
];
