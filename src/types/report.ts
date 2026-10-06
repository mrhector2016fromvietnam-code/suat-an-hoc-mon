export type MealShift = 'Bữa sáng' | 'Bữa trưa' | 'Bữa tối';

export interface VendorPortionRow {
  id: string;
  name: string;
  code: string;
  td8: number;
  td11_1: number;
  td11_3: number;
}

export interface DayShiftMenu {
  vendorId?: string; // Optional: specific to a vendor, or 'all'
  dayOfWeek: string; // e.g. "Thứ 2"
  dateStr: string;   // e.g. "05/10/2026"
  shift: MealShift;
  meatDishes: string[];
  meatDessert: string;
  vegDishes: string[];
  vegDessert: string;
  gramWeights?: Record<string, string>;
  isWeighedOk?: boolean;
}

export interface WeeklyMenuData {
  projectName: string;
  weekRange: string;
  vendorName: string;
  menus: DayShiftMenu[];
}

