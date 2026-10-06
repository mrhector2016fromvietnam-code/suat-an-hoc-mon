export type ShiftType = 'Trưa' | 'Chiều' | 'Đêm' | 'Xế (Ăn nhẹ)';

export type ZoneType = 
  | 'KCN Tân Thới Hiệp' 
  | 'Cụm CN Nhị Xuân' 
  | 'KCN Bà Điểm' 
  | 'KCN Vĩnh Lộc' 
  | 'Củ Chi / Tây Bắc' 
  | 'Khu Dân Cư & Trường Học Hóc Môn';

export interface MealPackage {
  id: string;
  name: string;
  code: string;
  price: number; // VNĐ
  targetAudience: string;
  caloriesTarget: number; // kcal
  proteinTarget: number; // g
  description: string;
  features: string[];
  image: string;
  badgeText?: string;
}

export interface DishItem {
  name: string;
  category: 'Món chính' | 'Món phụ/Xào' | 'Món canh' | 'Tráng miệng' | 'Cơm/Thêm';
  portionGram: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayMenu {
  id: string;
  dayOfWeek: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7';
  dateStr: string;
  shift: ShiftType;
  packageId: string;
  packageName: string;
  mainDish: string;
  secondaryDish: string;
  soup: string;
  stirFry: string;
  dessert: string;
  specialNote?: string;
  totalKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  allergens: string[];
  imageUrl: string;
}

export interface CateringClient {
  id: string;
  name: string;
  industry: string;
  zone: ZoneType;
  address: string;
  contactPerson: string;
  phone: string;
  activePackageId: string;
  standardPortions: {
    lunch: number;
    dinner: number;
    night: number;
    vegetarian: number;
  };
  contractValidUntil: string;
  ratingAvg: number;
}

export interface DispatchTrip {
  id: string;
  clientName: string;
  zone: ZoneType;
  shift: ShiftType;
  totalPortions: number;
  vegetarianPortions: number;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  dispatchTime: string;
  deliveryTime: string;
  hotBoxTemp: number; // Celsius, e.g. 69.5
  status: 'Chờ đóng khay' | 'Đang vận chuyển nhiệt' | 'Đã giao & Ký nhận' | 'Đã lưu mẫu';
  receivedBy?: string;
  sampleSealCode: string;
}

export interface FoodSafetySample {
  id: string;
  date: string;
  mealShift: ShiftType;
  menuSummary: string;
  storageCabinet: string;
  cabinetTemp: number; // Celsius (2-8°C)
  inspectorName: string;
  sealNumber: string;
  supplierProof: string;
  retentionHours: number; // 24 or 48
  status: 'Đang lưu mẫu an toàn' | 'Đã nghiệm thu hoàn tất' | 'Kiểm tra đột xuất đạt';
  notes: string;
}

export interface DailyMealAdjustment {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  lunchCount: number;
  dinnerCount: number;
  nightCount: number;
  vegetarianCount: number;
  specialDietNotes: string;
  status: 'Đã xác nhận' | 'Chờ duyệt' | 'Đang nấu';
  submittedAt: string;
  totalEstimatedCost: number;
}
