import React, { useState } from 'react';
import { 
  Truck, Navigation, Thermometer, MapPin, 
  Clock, ShieldAlert, Phone, CheckCircle2, ArrowRight
} from 'lucide-react';

interface FleetRoute {
  id: string;
  name: string;
  corridor: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  capacityPortions: number;
  stopsCount: number;
  avgDeliveryTemp: number;
  currentStatus: 'Đang giao hàng' | 'Đã hoàn tất' | 'Đang tiếp nhiệt tại bến';
  estimatedReturn: string;
  activeStops: string[];
}

export const DeliveryFleetTracker: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-01');

  const routes: FleetRoute[] = [
    {
      id: 'route-01',
      name: 'Tuyến KCN Tân Thới Hiệp - Tô Ký',
      corridor: 'Nguyễn Văn Bứa ➔ QL22 ➔ Tô Ký ➔ KCN Tân Thới Hiệp (Quận 12 giáp Hóc Môn)',
      vehiclePlate: '51D - 482.91 (Xe 2.5T có dàn giữ nhiệt)',
      driverName: 'Bác Nguyễn Văn Tài (12 năm kinh nghiệm)',
      driverPhone: '0909 234 561',
      capacityPortions: 3500,
      stopsCount: 4,
      avgDeliveryTemp: 71.5,
      currentStatus: 'Đã hoàn tất',
      estimatedReturn: '12:45 Trưa',
      activeStops: [
        'Công Ty May Mặc Tân Thới Hiệp (895 suất) - Đã ký nhận 11:18',
        'Xí Nghiệp In & Bao Bì Việt Á (420 suất) - Đã ký nhận 11:32',
        'Công Ty Giày Da Phước Long (650 suất) - Đã ký nhận 11:45'
      ]
    },
    {
      id: 'route-02',
      name: 'Tuyến Cụm Công Nghiệp Nhị Xuân & Xuân Thới Sơn',
      corridor: 'Nguyễn Văn Bứa ➔ Đặng Công Bỉnh ➔ Cụm CN Nhị Xuân (Hóc Môn)',
      vehiclePlate: '51D - 633.28 (Xe 2.0T thùng inox 304)',
      driverName: 'Anh Huỳnh Quốc Bảo',
      driverPhone: '0912 654 890',
      capacityPortions: 2800,
      stopsCount: 3,
      avgDeliveryTemp: 69.8,
      currentStatus: 'Đang giao hàng',
      estimatedReturn: '13:00 Trưa',
      activeStops: [
        'Xí Nghiệp Cơ Khí Nhị Xuân (540 suất) - Đang dỡ hàng',
        'Nhà Máy Đúc Kim Loại Toàn Thắng (380 suất) - Dự kiến 11:40',
        'Công Ty Nhựa Tái Chế Đại Phong (260 suất) - Dự kiến 11:55'
      ]
    },
    {
      id: 'route-03',
      name: 'Tuyến KCN Bà Điểm & KCN Vĩnh Lộc',
      corridor: 'Phan Văn Hớn ➔ Bà Điểm ➔ Nguyễn Thị Tú ➔ Lô C KCN Vĩnh Lộc',
      vehiclePlate: '51D - 772.19 (Xe bảo ôn chuyên dụng 3.0T)',
      driverName: 'Anh Võ Văn Sơn',
      driverPhone: '0977 888 123',
      capacityPortions: 4200,
      stopsCount: 5,
      avgDeliveryTemp: 70.2,
      currentStatus: 'Đang giao hàng',
      estimatedReturn: '13:15 Trưa',
      activeStops: [
        'Công Ty Điện Tử & Linh Kiện Vĩnh Lộc (700 suất) - Đang giao',
        'Công Ty May Tân Bình Phước (510 suất) - Dự kiến 11:35',
        'Công Ty Chế Biến Gỗ Bà Điểm (430 suất) - Dự kiến 11:50'
      ]
    },
    {
      id: 'route-04',
      name: 'Tuyến Học Đường & Trường Tiểu Học Hóc Môn',
      corridor: 'Nguyễn Văn Bứa ➔ Lê Thị Hà ➔ Phan Văn Hớn ➔ Xuân Thới Thượng',
      vehiclePlate: '51C - 991.04 (Xe chuyên dụng cấp đông & giữ nóng 1.8T)',
      driverName: 'Anh Trần Hữu Phước',
      driverPhone: '0938 119 443',
      capacityPortions: 2200,
      stopsCount: 3,
      avgDeliveryTemp: 73.0,
      currentStatus: 'Đã hoàn tất',
      estimatedReturn: '12:30 Trưa',
      activeStops: [
        'Trường Tiểu Học Xuân Thới Thượng (780 suất) - Đã ký nhận 10:55',
        'Trường Mầm Non Hướng Dương (340 suất) - Đã ký nhận 10:40',
        'Trường THCS Đặng Công Bỉnh (410 suất) - Đã ký nhận 11:10'
      ]
    }
  ];

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Hạ Tầng Vận Chuyển Giữ Nhiệt Khép Kín
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Đội Xe Chuyên Dụng &amp; Bản Đồ Giao Hàng Hóc Môn
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Sở hữu 12 xe tải thùng kín cách nhiệt inox 304 có hệ thống sấy nóng điện tử, bảo đảm cơm và canh luôn ở mức nhiệt độ 68°C - 75°C khi đưa tới bàn ăn công nhân.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            12/12 Xe có định vị GPS &amp; cảm biến nhiệt
          </span>
        </div>
      </div>

      {/* Fleet Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-900 h-64 sm:h-80">
        <img
          src="/src/assets/images/delivery_fleet_vans_1791218607272.jpg"
          alt="Đội xe giao suất ăn công nghiệp Hóc Môn"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Trung Tâm Điều Phối Vận Tải Thực Phẩm Hóc Môn
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Bán Kính Phục Vụ 25km Trong Vòng 30 Phút
            </h3>
            <p className="text-xs text-neutral-300 max-w-xl">
              Xuất phát từ đường Nguyễn Văn Bứa, dễ dàng tiếp cận nhanh chóng toàn bộ khu vực Hóc Môn, Quận 12, Bình Tân, Củ Chi và Đức Hòa (Long An).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-center">
              <div className="text-xs text-neutral-400">Nhiệt độ giao TB</div>
              <div className="text-lg font-bold font-mono text-emerald-400">71.2°C</div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-center">
              <div className="text-xs text-neutral-400">Công suất đội xe</div>
              <div className="text-lg font-bold font-mono text-white">45.000 / ngày</div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Selector & Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Route List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-neutral-700 px-1">
            Chọn Tuyến Vận Chuyển:
          </div>

          {routes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`w-full p-4 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'bg-white border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-neutral-900">{route.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    route.currentStatus === 'Đã hoàn tất'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {route.currentStatus}
                  </span>
                </div>

                <div className="text-xs text-neutral-500 truncate">{route.corridor}</div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-600 font-mono">
                  <span>{route.vehiclePlate.split(' ')[0]} {route.vehiclePlate.split(' ')[1]}</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {route.avgDeliveryTemp}°C
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Route Details Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">{activeRoute.name}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{activeRoute.corridor}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400">Nhiệt độ hiện tại:</span>
              <div className="text-xl font-extrabold font-mono text-emerald-700 tabular-nums">
                {activeRoute.avgDeliveryTemp}°C
              </div>
            </div>
          </div>

          {/* Vehicle and Driver Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-neutral-500">Tài xế điều khiển:</div>
              <div className="font-bold text-neutral-900 text-sm">{activeRoute.driverName}</div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-mono font-semibold pt-1">
                <Phone className="w-3.5 h-3.5" /> {activeRoute.driverPhone}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-neutral-500">Phương tiện &amp; Sức chứa:</div>
              <div className="font-bold text-neutral-900 text-sm">{activeRoute.vehiclePlate}</div>
              <div className="text-neutral-600 font-mono pt-1">
                Tải trọng: {activeRoute.capacityPortions.toLocaleString('vi-VN')} suất / chuyến
              </div>
            </div>
          </div>

          {/* Delivery Stops Roadmap */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-neutral-800 flex items-center justify-between">
              <span>Lộ Trình Các Điểm Giao Hàng Trên Tuyến ({activeRoute.activeStops.length} điểm):</span>
              <span className="text-[11px] text-neutral-500 font-mono">Dự kiến về bến: {activeRoute.estimatedReturn}</span>
            </div>

            <div className="space-y-2">
              {activeRoute.activeStops.map((stop, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 font-medium text-neutral-800">{stop}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Dispatch Contact */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold">Đường dây nóng điều phối đội xe Hóc Môn:</div>
              <div className="text-amber-800">
                Hỗ trợ công nhân tăng ca đột xuất hoặc thay đổi giờ ăn do xưởng cúp điện.
              </div>
            </div>
            <a
              href="tel:0908123456"
              className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 whitespace-nowrap transition-colors"
            >
              Gọi Điều Xe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
