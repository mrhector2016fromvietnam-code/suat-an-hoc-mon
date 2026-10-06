import React, { useState } from 'react';
import { 
  Truck, Thermometer, Clock, ShieldCheck, 
  Search, CheckCircle2, AlertCircle, Phone, 
  ArrowUpRight, Users, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { DISPATCH_TRIPS_TODAY, CATERING_CLIENTS } from '../data/mockData';
import { DispatchTrip, ZoneType } from '../types/catering';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenAiAdvisor: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate, onOpenAiAdvisor }) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrip, setSelectedTrip] = useState<DispatchTrip | null>(null);

  // Filtered trips
  const filteredTrips = DISPATCH_TRIPS_TODAY.filter((trip) => {
    const matchesZone = selectedZone === 'all' || trip.zone === selectedZone;
    const matchesSearch = trip.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const totalPortionsToday = DISPATCH_TRIPS_TODAY.reduce((sum, item) => sum + item.totalPortions, 0);
  const totalVegPortionsToday = DISPATCH_TRIPS_TODAY.reduce((sum, item) => sum + item.vegetarianPortions, 0);
  const avgTemp = (DISPATCH_TRIPS_TODAY.reduce((sum, item) => sum + item.hotBoxTemp, 0) / DISPATCH_TRIPS_TODAY.length).toFixed(1);

  return (
    <div className="py-8 space-y-8">
      {/* Executive Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Portions */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Tổng suất ăn hôm nay</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
              {totalPortionsToday.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-emerald-700 font-medium">+185 suất tăng ca</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span>Suất mặn: {(totalPortionsToday - totalVegPortionsToday).toLocaleString('vi-VN')}</span>
            <span>·</span>
            <span className="text-amber-700 font-medium">Suất chay: {totalVegPortionsToday}</span>
          </div>
        </div>

        {/* Stat 2: Hot Box Temp */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Nhiệt độ giữ nóng TB</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Thermometer className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
              {avgTemp}°C
            </span>
            <span className="text-xs text-emerald-700 font-medium">Đạt chuẩn &gt;65°C</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Thùng cách nhiệt inox 304 giữ nóng suốt 4 giờ vận chuyển
          </div>
        </div>

        {/* Stat 3: On-time Delivery */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Tiến độ giao hàng</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
              100%
            </span>
            <span className="text-xs text-emerald-700 font-medium">Đúng giờ</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            5/5 chuyến xe ca trưa &amp; chiều đã xuất bến đúng kế hoạch
          </div>
        </div>

        {/* Stat 4: Food Safety Inspection */}
        <div className="p-5 rounded-xl bg-white border border-neutral-200/90 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>An toàn thực phẩm 24h</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
              3/3 Mẫu
            </span>
            <span className="text-xs text-emerald-700 font-medium">Niêm phong</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Tủ mát lưu mẫu KCS nhiệt độ 3.8°C theo QĐ 1246/QĐ-BYT
          </div>
        </div>
      </div>

      {/* Main Operations Board Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        {/* Table Header & Controls */}
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span>Bảng Điều Phối Xuất Suất Ăn Hôm Nay</span>
              <span className="text-xs font-normal text-neutral-500 font-mono">
                (Ca Trưa 11h30 &amp; Ca Chiều 16h30)
              </span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Theo dõi trực tiếp quá trình đóng thùng cách nhiệt, nhiệt độ thực tế và ký nhận bàn giao từ xí nghiệp.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm công ty, tài xế, biển số..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-48 sm:w-56"
              />
            </div>

            {/* Filter by Zone */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Tất cả khu vực KCN</option>
              <option value="KCN Tân Thới Hiệp">KCN Tân Thới Hiệp</option>
              <option value="Cụm CN Nhị Xuân">Cụm CN Nhị Xuân</option>
              <option value="KCN Bà Điểm">KCN Bà Điểm</option>
              <option value="KCN Vĩnh Lộc">KCN Vĩnh Lộc</option>
              <option value="Khu Dân Cư & Trường Học Hóc Môn">Trường học Hóc Môn</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <th className="py-3 px-4">Doanh Nghiệp / Địa Điểm</th>
                <th className="py-3 px-4">Khu Vực</th>
                <th className="py-3 px-4 text-center">Ca / Giờ Giao</th>
                <th className="py-3 px-4 text-right">Số Suất Ăn</th>
                <th className="py-3 px-4 text-center">Nhiệt Độ Thùng</th>
                <th className="py-3 px-4">Tài Xế &amp; Xe Vận Chuyển</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredTrips.map((trip) => {
                const isDelivered = trip.status === 'Đã giao & Ký nhận';
                const isShipping = trip.status === 'Đang vận chuyển nhiệt';

                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    {/* Client Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{trip.clientName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{trip.id} · Tem: {trip.sampleSealCode}</div>
                    </td>

                    {/* Zone */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      <span>{trip.zone}</span>
                    </td>

                    {/* Shift & Time */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-medium text-neutral-900">{trip.shift}</span>
                      <div className="text-[11px] text-neutral-500 font-mono">{trip.deliveryTime}</div>
                    </td>

                    {/* Portions */}
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                      <span className="font-bold text-neutral-900">{trip.totalPortions}</span>
                      {trip.vegetarianPortions > 0 && (
                        <div className="text-[11px] text-amber-700">({trip.vegetarianPortions} suất chay)</div>
                      )}
                    </td>

                    {/* Temperature */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                        trip.hotBoxTemp >= 68 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <Thermometer className="w-3.5 h-3.5" />
                        {trip.hotBoxTemp}°C
                      </span>
                    </td>

                    {/* Driver */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-neutral-800 font-medium">{trip.driverName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{trip.vehiclePlate}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã ký nhận
                        </span>
                      ) : isShipping ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-xs border border-blue-200 animate-pulse">
                          <Truck className="w-3.5 h-3.5" /> Đang giao nóng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-xs border border-neutral-200">
                          <Clock className="w-3.5 h-3.5" /> Đóng khay ca chiều
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrip(trip);
                        }}
                        className="p-1 rounded-md text-neutral-400 hover:text-emerald-600 hover:bg-neutral-100 transition-colors"
                        title="Xem chi tiết phiếu giao"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-neutral-500 gap-2">
          <div>
            Hiển thị <strong>{filteredTrips.length}</strong> / {DISPATCH_TRIPS_TODAY.length} chuyến vận chuyển hôm nay.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('daily-orders')}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Điều chỉnh số lượng suất ngày mai</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Fast Meal Adjustment CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Dành cho Đối tác Doanh Nghiệp</span>
            <h3 className="text-xl font-bold leading-snug">Chốt Số Lượng Suất Ăn Hàng Ngày Trước 09:00</h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Tăng/giảm số lượng công nhân tăng ca hoặc chuyển đổi suất chay nhanh chóng. Hệ thống tự động tính chi phí phát sinh và thông báo trực tiếp cho Bếp trưởng Hóc Môn.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('daily-orders')}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-900 font-semibold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
            >
              Vào Cổng Báo Suất Doanh Nghiệp
            </button>
          </div>
        </div>

        {/* Col 2: Food Safety 3-Step Compliance */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Quyết định 1246/QĐ-BYT
              </span>
              <span className="font-mono">100% Khép kín</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 leading-snug">Quy Trình Kiểm Thực 3 Bước &amp; Lưu Mẫu 24H</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Mọi mẻ thức ăn đều được kiểm tra cảm quan, đo nhiệt độ tâm món &gt;85°C và lưu 150g mẫu trong thố inox chuyên dụng niêm phong tại tủ lạnh 2°C - 8°C.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('food-safety')}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
            >
              Xem Nhật Ký Kiểm Thực &amp; Chứng Nhận
            </button>
          </div>
        </div>

        {/* Col 3: AI Smart Nutritionist Callout */}
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Trợ Lý Dinh Dưỡng Gemini AI</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 leading-snug">Thiết Kế Thực Đơn Theo Ngân Sách Doanh Nghiệp</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Nhập mức giá (từ 20.000đ đến 55.000đ) và đặc thù ngành nghề (may mặc, cơ khí, văn phòng), AI sẽ phân tích tháp dinh dưỡng và lập ma trận thực đơn tuần tối ưu chi phí.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={onOpenAiAdvisor}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trải Nghiệm Dinh Dưỡng AI Ngay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Trip Details */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Chi Tiết Phiếu Giao Suất Ăn</h3>
                <span className="text-xs text-neutral-500 font-mono">{selectedTrip.id}</span>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Khách hàng:</span>
                  <span className="font-semibold text-neutral-900">{selectedTrip.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Khu vực:</span>
                  <span className="font-medium text-neutral-800">{selectedTrip.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ca ăn &amp; Giờ hẹn:</span>
                  <span className="font-semibold text-neutral-900">{selectedTrip.shift} - {selectedTrip.deliveryTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="text-neutral-500">Tổng số suất:</div>
                  <div className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                    {selectedTrip.totalPortions}
                  </div>
                  <div className="text-[11px] text-emerald-700">Trong đó {selectedTrip.vegetarianPortions} suất chay</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="text-neutral-500">Nhiệt độ thùng giữ nóng:</div>
                  <div className="text-xl font-bold font-mono text-amber-900 tabular-nums">
                    {selectedTrip.hotBoxTemp}°C
                  </div>
                  <div className="text-[11px] text-amber-700">Cảm biến nhiệt tử số tự động</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-neutral-500">Tài xế phụ trách:</div>
                <div className="font-semibold text-neutral-900">{selectedTrip.driverName}</div>
                <div className="text-neutral-600 font-mono">Điện thoại: {selectedTrip.driverPhone}</div>
                <div className="text-neutral-500">Phương tiện: {selectedTrip.vehiclePlate}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-neutral-500">Mã tem niêm phong mẫu thực phẩm:</div>
                <div className="font-mono font-bold text-neutral-900 text-sm text-emerald-700">
                  {selectedTrip.sampleSealCode}
                </div>
                {selectedTrip.receivedBy && (
                  <div className="text-neutral-600 pt-1">
                    Người nhận: <strong>{selectedTrip.receivedBy}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTrip(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
