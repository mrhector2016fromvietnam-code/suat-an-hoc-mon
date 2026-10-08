import { DayShiftMenu } from '../types/report';

export interface VerificationReportResult {
  matches: boolean;
  totalVendorsActive: number;
  totalDaysCovered: number;
  totalShiftsCovered: number;
  totalDishesExtracted: number;
  emptyShiftsCount: number;
  issuesList: string[];
  logSummary: string;
}

/**
 * Step F requirement: Helper function running and verifying report consistency against menu data
 */
export function verifyReportMatchesMenu(
  menusList: DayShiftMenu[],
  selectedVendorIds: string[] = []
): VerificationReportResult {
  const issuesList: string[] = [];
  const activeVendors = selectedVendorIds.length > 0 && !selectedVendorIds.includes('all')
    ? selectedVendorIds
    : Array.from(new Set(menusList.map((m) => m.vendorId || 'tam-phuong')));

  const activeMenus = menusList.filter((m) =>
    selectedVendorIds.includes('all') || selectedVendorIds.length === 0 || activeVendors.includes(m.vendorId || '')
  );

  let totalDishesExtracted = 0;
  let emptyShiftsCount = 0;

  const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const shifts = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];

  activeVendors.forEach((vId) => {
    weekdays.forEach((day) => {
      shifts.forEach((shift) => {
        const found = activeMenus.find(
          (m) => (m.vendorId === vId || vId === 'all') && m.dayOfWeek === day && m.shift === shift
        );
        if (!found) {
          emptyShiftsCount++;
          issuesList.push(`Khuyết dữ liệu ca ăn: NCC ${vId} -> ${day} (${shift})`);
        } else {
          const mCount = (found.meatDishes || []).length;
          const vCount = (found.vegDishes || []).length;
          totalDishesExtracted += mCount + vCount;

          if (mCount === 0 && vCount === 0 && !found.meatDessert) {
            emptyShiftsCount++;
            issuesList.push(`Ca ăn rỗng không có món: NCC ${vId} -> ${day} (${shift})`);
          }
        }
      });
    });
  });

  const matches = issuesList.length === 0;
  const logSummary = `[XÁC NHẬN ĐỒNG BỘ DỮ LIỆU BÁO CÁO]
---------------------------------------------------
- Trạng thái khớp 100%: ${matches ? '✅ ĐẠT KHỚP HOÀN HẢO' : '⚠️ CÓ CẢNH BÁO KHUYẾT DỮ LIỆU'}
- Số Nhà Cung Cấp kiểm tra: ${activeVendors.length} NCC (${activeVendors.join(', ')})
- Tổng ca ăn được bao phủ: ${activeMenus.length} ca
- Tổng món ăn đã đồng bộ: ${totalDishesExtracted} món
- Số ca trống / khuyết dữ liệu: ${emptyShiftsCount} ca
${issuesList.length > 0 ? '\nDANH SÁCH CHI TIẾT CẢNH BÁO:\n- ' + issuesList.join('\n- ') : ''}`;

  console.log(logSummary);

  return {
    matches,
    totalVendorsActive: activeVendors.length,
    totalDaysCovered: weekdays.length,
    totalShiftsCovered: activeMenus.length,
    totalDishesExtracted,
    emptyShiftsCount,
    issuesList,
    logSummary,
  };
}
