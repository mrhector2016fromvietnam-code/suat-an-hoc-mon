import React, { useState } from 'react';
import { 
  Calendar, Flame, Sparkles, AlertTriangle, 
  Info, Check, Download, ChefHat, Eye
} from 'lucide-react';
import { WEEKLY_MENUS, MEAL_PACKAGES } from '../data/mockData';
import { DayMenu } from '../types/catering';

interface WeeklyMenuPlannerProps {
  onOpenAiAdvisor: () => void;
}

export const WeeklyMenuPlanner: React.FC<WeeklyMenuPlannerProps> = ({ onOpenAiAdvisor }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Thứ 2');
  const [selectedPackage, setSelectedPackage] = useState<string>('cong-nhan-tiet-kiem');
  const [activeModalMenu, setActiveModalMenu] = useState<DayMenu | null>(null);

  const daysList = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  // Current active day menu item
  const currentMenu = WEEKLY_MENUS.find((m) => m.dayOfWeek === selectedDay) || WEEKLY_MENUS[0];
  const currentPackageInfo = MEAL_PACKAGES.find((p) => p.id === selectedPackage) || MEAL_PACKAGES[0];

  return (
    <div className="py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Hệ Thống Thực Đơn Tiêu Chuẩn 4 Tuần Không Trùng Món
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Ma Trận Thực Đơn &amp; Dinh Dưỡng Tuần
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Thực đơn được các kỹ sư công nghệ thực phẩm và bác sĩ dinh dưỡng tính toán vi chất khoa học. Khẩu phần bảo đảm đủ 5 nhóm chất, nóng hổi và ngon miệng.
          </p>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo Thực Đơn Tùy Biến AI</span>
          </button>
        </div>
      </div>

      {/* Package Selector Segmented Control */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="text-xs text-neutral-500 font-medium px-2 py-1 mb-1">
          Chọn gói suất ăn để xem định lượng:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {MEAL_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-xs'
                    : 'bg-neutral-50/70 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="text-[11px] font-semibold text-emerald-700 font-mono">
                  {pkg.code}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{pkg.name}</div>
                <div className="text-xs font-mono font-bold text-neutral-900 mt-1">
                  {pkg.price.toLocaleString('vi-VN')} đ
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Selector Tabs (Thứ 2 đến Thứ 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {daysList.map((day) => {
          const isCurrent = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-center transition-all ${
                isCurrent
                  ? 'bg-emerald-700 text-white font-bold shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 font-medium'
              }`}
            >
              <div className="text-xs font-semibold">{day}</div>
              <div className={`text-[11px] font-mono mt-0.5 ${isCurrent ? 'text-emerald-200' : 'text-neutral-500'}`}>
                {day === 'Thứ 2' ? '06/10' : day === 'Thứ 3' ? '07/10' : day === 'Thứ 4' ? '08/10' : day === 'Thứ 5' ? '09/10' : day === 'Thứ 6' ? '10/10' : '11/10'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Showcase Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Visual Meal Presentation */}
          <div className="lg:col-span-5 relative bg-neutral-900 min-h-[300px] lg:min-h-full">
            <img
              src={
                selectedPackage === 'hoc-duong-ban-tru'
                  ? '/src/assets/images/school_catering_tray_1791218620156.jpg'
                  : '/src/assets/images/meal_tray_industrial_1791218594110.jpg'
              }
              alt="Khay cơm công nghiệp Hóc Môn"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />

            {/* In-image Badge */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900/80 backdrop-blur-md text-white text-xs font-semibold border border-neutral-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentMenu.dayOfWeek} · Ca Trưa</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs text-emerald-300 font-semibold mb-1">
                {currentPackageInfo.name} · {currentPackageInfo.price.toLocaleString('vi-VN')} đ/suất
              </div>
              <div className="text-base font-bold leading-snug">
                Khay Inox 304 tiêu chuẩn 5 ngăn giữ nhiệt
              </div>
              <div className="text-xs text-neutral-300 mt-1">
                Kèm canh nóng &amp; cơm trắng thêm không giới hạn
              </div>
            </div>
          </div>

          {/* Right Column: Dish Breakdown & Calorie Matrix */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Khẩu Phần Ăn Chi Tiết {currentMenu.dayOfWeek}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Áp dụng cho các nhà máy tại Tân Thới Hiệp, Nhị Xuân, Bà Điểm &amp; Vĩnh Lộc
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold font-mono tabular-nums">{currentMenu.totalKcal}</span>
                  <span className="text-xs font-medium">kcal</span>
                </div>
              </div>

              {/* Dish List */}
              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    Món Đạm Chính
                  </span>
                  <div>
                    <div className="font-bold text-neutral-900 text-sm">{currentMenu.mainDish}</div>
                    <div className="text-xs text-neutral-500">Định lượng 110g - 130g thịt/cá tươi nguyên chất</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 shrink-0">
                    Món Phụ Tăng Đạm
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">{currentMenu.secondaryDish}</div>
                    <div className="text-xs text-neutral-500">Bổ sung đạm thực vật hoặc trứng tươi tiệt trùng</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-100 text-teal-800 shrink-0">
                    Canh Thanh Nhiệt
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">{currentMenu.soup}</div>
                    <div className="text-xs text-neutral-500">Nước hầm xương heo hoặc tôm tươi tự nhiên, không mì chính</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-100 text-green-800 shrink-0">
                    Rau Xào / Luộc
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">{currentMenu.stirFry}</div>
                    <div className="text-xs text-neutral-500">100% Rau VietGAP thu hái mỗi sáng tại HTX Củ Chi</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 shrink-0">
                    Tráng Miệng
                  </span>
                  <div>
                    <div className="font-semibold text-neutral-900 text-sm">{currentMenu.dessert}</div>
                    <div className="text-xs text-neutral-500">Trái cây theo mùa kiểm định dư lượng hóa chất</div>
                  </div>
                </div>
              </div>

              {/* Macro Nutritional Matrix */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-semibold text-neutral-700 mb-2">
                  Cân Đối Dinh Dưỡng Khẩu Phần (P : L : C)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-neutral-200">
                    <div className="text-neutral-500 text-[11px]">Protein (Đạm)</div>
                    <div className="font-mono font-bold text-neutral-900 text-sm tabular-nums mt-0.5">
                      {currentMenu.proteinG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-neutral-200">
                    <div className="text-neutral-500 text-[11px]">Carbs (Bột đường)</div>
                    <div className="font-mono font-bold text-neutral-900 text-sm tabular-nums mt-0.5">
                      {currentMenu.carbsG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-neutral-200">
                    <div className="text-neutral-500 text-[11px]">Fat (Chất béo)</div>
                    <div className="font-mono font-bold text-neutral-900 text-sm tabular-nums mt-0.5">
                      {currentMenu.fatG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-neutral-200">
                    <div className="text-neutral-500 text-[11px]">Năng lượng</div>
                    <div className="font-mono font-bold text-amber-700 text-sm tabular-nums mt-0.5">
                      {currentMenu.totalKcal} kcal
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergen Warning */}
              {currentMenu.allergens.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Cảnh báo dị ứng:</strong> Món ăn chứa{' '}
                    {currentMenu.allergens.join(', ')}. Quý công ty vui lòng báo số suất thay thế cho người cơ địa dị ứng.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200">
              <div className="text-xs text-neutral-500">
                Gạo dẻo ST25 &amp; Canh nóng được phục vụ thêm không giới hạn
              </div>
              <button
                onClick={() => setActiveModalMenu(currentMenu)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem Hồ Sơ Nguồn Gốc Nguyên Liệu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Ingredients Source & Traceability */}
      {activeModalMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Hồ Sơ Truy Xuất Nguồn Gốc {activeModalMenu.dayOfWeek}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">Quy chuẩn ISO 22000:2018</span>
              </div>
              <button
                onClick={() => setActiveModalMenu(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="font-semibold text-emerald-900">1. Nguồn Thịt &amp; Thủy Hải Sản Tươi Sống:</div>
                <p className="text-emerald-800">
                  Thịt heo, gà tươi 100% từ Công ty Cổ phần Chăn nuôi C.P. Việt Nam (Chi nhánh Hóc Môn). Cá tươi nhập từ Chợ Đầu Mối Nông Sản Thực Phẩm Hóc Môn có giấy chứng nhận kiểm dịch thú y trong ngày.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="font-semibold text-blue-900">2. Nguồn Rau Củ Quả &amp; Gia Vị:</div>
                <p className="text-blue-800">
                  Rau xanh các loại cung ứng độc quyền bởi Hợp tác xã Rau sạch VietGAP Tân Phú Trung (Củ Chi). Dầu ăn Neptune Gold, hạt nêm Knorr, nước mắm cá cơm Phú Quốc, tuyệt đối không sử dụng phụ gia trôi nổi.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="font-semibold text-neutral-900">3. Quy Trình Nấu &amp; Bảo Quản Nhiệt:</div>
                <p className="text-neutral-700">
                  Nấu chín sôi tâm thực phẩm &gt;100°C trong nồi áp suất hơi công nghiệp. Đóng khay tự động và xếp vào thùng bảo ôn điện tử, duy trì nhiệt độ &gt;68°C tới khi công nhân mở nắp ăn.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalMenu(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800"
              >
                Đã Rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
