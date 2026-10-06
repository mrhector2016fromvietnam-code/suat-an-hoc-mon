import React, { useState } from 'react';
import { 
  Calculator, FileText, Check, Printer, 
  Send, Percent, Building2, Phone, Mail, MapPin, Sparkles, Award
} from 'lucide-react';
import { MEAL_PACKAGES } from '../data/mockData';

export const QuoteContractCalculator: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('Công Ty TNHH Sản Xuất May Mặc Quốc Tế');
  const [contactName, setContactName] = useState<string>('Anh Nguyễn Văn Tuấn');
  const [phone, setPhone] = useState<string>('0908 998 877');
  const [email, setEmail] = useState<string>('nhansu@maymacquocte.com.vn');
  const [zone, setZone] = useState<string>('KCN Tân Thới Hiệp');
  const [portionsPerDay, setPortionsPerDay] = useState<number>(650);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('cong-nhan-tiet-kiem');
  const [serviceType, setServiceType] = useState<string>('giao-khay');
  const [contractMonths, setContractMonths] = useState<number>(12);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(26);
  
  // Extra options
  const [addHerbalTea, setAddHerbalTea] = useState<boolean>(true);
  const [addSpecialFruit, setAddSpecialFruit] = useState<boolean>(false);
  const [addWetTowel, setAddWetTowel] = useState<boolean>(true);

  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isSentSuccess, setIsSentSuccess] = useState<boolean>(false);

  const currentPkg = MEAL_PACKAGES.find((p) => p.id === selectedPkgId) || MEAL_PACKAGES[0];

  // Calculate pricing
  let baseUnitPrice = currentPkg.price;
  if (addHerbalTea) baseUnitPrice += 2000;
  if (addSpecialFruit) baseUnitPrice += 3000;
  if (addWetTowel) baseUnitPrice += 1000;

  // Additional service fee or discount
  let serviceMultiplier = 1.0;
  if (serviceType === 'nau-tai-cho') {
    // If cooked on-site, savings on transport
    serviceMultiplier = 0.98;
  } else if (serviceType === 'buffet-nong') {
    // Buffet requires service staff
    serviceMultiplier = 1.04;
  }

  // Volume & Contract Discounts
  let discountRate = 0;
  if (portionsPerDay >= 500) discountRate += 0.03;
  if (portionsPerDay >= 1000) discountRate += 0.03;
  if (contractMonths >= 12) discountRate += 0.03;

  const adjustedUnitPrice = Math.round(baseUnitPrice * serviceMultiplier * (1 - discountRate));
  const dailyTotal = adjustedUnitPrice * portionsPerDay;
  const monthlyTotal = dailyTotal * daysPerMonth;
  const annualTotal = monthlyTotal * contractMonths;

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSentSuccess(true);
    setTimeout(() => setIsSentSuccess(false), 5000);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Công Cụ Dự Toán Ngân Sách Minh Bạch &amp; Nhanh Chóng
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
          Tính Báo Giá Suất Ăn &amp; Dự Thảo Hợp Đồng
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
          Tùy chỉnh số lượng công nhân, mức giá theo khẩu phần, hình thức phục vụ và nhận ngay bảng báo giá chi tiết có giá trị pháp lý trong 30 ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Calculator Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSendQuote} className="space-y-6">
            {/* Enterprise Information */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                1. Thông Tin Doanh Nghiệp Cần Báo Giá:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Tên Doanh Nghiệp / Nhà Máy:
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Khu Vực / KCN Đặt Nhà Máy:
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="KCN Tân Thới Hiệp">KCN Tân Thới Hiệp (Q.12 / Hóc Môn)</option>
                    <option value="Cụm CN Nhị Xuân">Cụm CN Nhị Xuân (Hóc Môn)</option>
                    <option value="KCN Bà Điểm">KCN Bà Điểm (Hóc Môn)</option>
                    <option value="KCN Vĩnh Lộc">KCN Vĩnh Lộc (Bình Chánh / Hóc Môn)</option>
                    <option value="Củ Chi / Tây Bắc">KCN Tây Bắc Củ Chi / Tân Phú Trung</option>
                    <option value="Khu Dân Cư & Trường Học Hóc Môn">Khu dân cư &amp; Trường học Hóc Môn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Người Liên Hệ (Họ &amp; Tên):
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    Số Điện Thoại / Zalo:
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Meal Package Selection */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                2. Chọn Gói Suất Ăn Mong Muốn:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MEAL_PACKAGES.map((pkg) => (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedPkgId === pkg.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <div className="text-[11px] font-mono text-emerald-700">{pkg.code}</div>
                    <div className="text-xs font-bold truncate mt-0.5">{pkg.name}</div>
                    <div className="text-xs font-mono font-bold text-neutral-900 mt-1">
                      {pkg.price.toLocaleString('vi-VN')} đ
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Count Slider & Duration */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  3. Số Lượng Suất Ăn Phục Vụ Hàng Ngày:
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-700 tabular-nums">
                  {portionsPerDay.toLocaleString('vi-VN')} suất / ngày
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="3000"
                step="25"
                value={portionsPerDay}
                onChange={(e) => setPortionsPerDay(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                <span>50 suất (Tối thiểu)</span>
                <span>500 suất (-3% CK)</span>
                <span>1.000 suất (-6% CK)</span>
                <span>3.000+ suất</span>
              </div>
            </div>

            {/* Serving Model Selection */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                4. Phương Thức Phục Vụ:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType('giao-khay')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    serviceType === 'giao-khay'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="font-bold">Giao Khay Inox Tận Nơi</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Khay 5 ngăn nắp kín ủ nhiệt &gt;68°C</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('nau-tai-cho')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    serviceType === 'nau-tai-cho'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="font-bold">Nấu Tại Căng Tin Xí Nghiệp</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Tiết kiệm chi phí, ăn nóng ngay</div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('buffet-nong')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    serviceType === 'buffet-nong'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="font-bold">Chia Quầy Buffet Nóng</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Có nhân viên tiếp thực phục vụ</div>
                </button>
              </div>
            </div>

            {/* Extras Selection */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                5. Tùy Chọn Bổ Sung Khẩu Phần:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={addHerbalTea}
                    onChange={(e) => setAddHerbalTea(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Nước sâm bí đao (+2.000đ)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={addSpecialFruit}
                    onChange={(e) => setAddSpecialFruit(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Trái cây tươi đặc biệt (+3.000đ)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={addWetTowel}
                    onChange={(e) => setAddWetTowel(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>Khăn ướt tiệt trùng (+1.000đ)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-semibold text-xs hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Xem Trước Hợp Đồng &amp; Báo Giá Mẫu</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Yêu Cầu Báo Giá Chính Thức</span>
              </button>
            </div>

            {isSentSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>
                  Yêu cầu báo giá đã được chuyển tới Phòng Kinh Doanh Hóc Môn Catering! Chuyên viên phụ trách khu vực {zone} sẽ liên hệ lại trong vòng 15 phút.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Pricing Breakdown Receipt */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  Bảng Dự Toán Chi Phí Suất Ăn
                </span>
                <span className="text-base font-bold text-white mt-0.5 block truncate max-w-[240px]">
                  {companyName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 font-mono">Khu vực:</span>
                <div className="text-xs font-medium text-neutral-200">{zone}</div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Gói thực đơn cơ bản ({currentPkg.name}):</span>
                <span className="font-mono font-bold text-white">{currentPkg.price.toLocaleString('vi-VN')} đ</span>
              </div>

              {(addHerbalTea || addSpecialFruit || addWetTowel) && (
                <div className="flex justify-between text-neutral-300">
                  <span>Dịch vụ cộng thêm (nước sâm, hoa quả...):</span>
                  <span className="font-mono text-emerald-400">
                    +{(baseUnitPrice - currentPkg.price).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}

              {discountRate > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5" /> Chiết khấu số lượng &amp; hợp đồng năm:
                  </span>
                  <span className="font-mono font-bold">-{(discountRate * 100).toFixed(0)}%</span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                <span className="text-neutral-300 font-medium">Đơn giá thực tế chốt theo suất:</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                  {adjustedUnitPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Aggregate Totals */}
            <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/80 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Chi phí 1 ngày ({portionsPerDay} suất):</span>
                <span className="font-mono font-bold text-white text-sm">
                  {dailyTotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-between text-neutral-300">
                <span>Dự toán 1 tháng ({daysPerMonth} ngày làm việc):</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">
                  {monthlyTotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex justify-between text-neutral-300 pt-2 border-t border-neutral-700">
                <span>Dự toán hợp đồng {contractMonths} tháng:</span>
                <span className="font-mono font-extrabold text-white text-base">
                  {annualTotal.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Free Extras Included */}
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase">Ưu đãi miễn phí đi kèm hợp đồng:</div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Miễn phí 100% chi phí vận chuyển nhiệt đến nhà máy</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tiếp thêm cơm trắng dẻo và canh nóng không giới hạn</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bảo hiểm trách nhiệm an toàn thực phẩm 10 tỷ đồng</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>In Báo Giá &amp; Hợp Đồng Mẫu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Official Legal Contract & Quote Letter Preview */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Dự Thảo Hợp Đồng Cung Cấp Suất Ăn Công Nghiệp
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  Mã văn bản: HD-HMC-{new Date().getFullYear()}-0942
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Contract Body Document */}
            <div className="space-y-4 text-xs text-neutral-700 leading-relaxed font-sans">
              <div className="text-center space-y-1 pb-3 border-b border-neutral-200">
                <div className="font-bold text-sm text-neutral-900 uppercase">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-xs text-neutral-600">Độc lập - Tự do - Hạnh phúc</div>
                <div className="font-bold text-neutral-900 pt-2 text-sm">
                  HỢP ĐỒNG CUNG ỨNG DỊCH VỤ SUẤT ĂN CA CÔNG NHÂN
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-neutral-900">BÊN A (BÊN SỬ DỤNG DỊCH VỤ):</div>
                <div className="pl-3 space-y-0.5">
                  <div><strong>Tên đơn vị:</strong> {companyName}</div>
                  <div><strong>Địa điểm giao hàng:</strong> {zone}, TP. Hồ Chí Minh</div>
                  <div><strong>Đại diện:</strong> {contactName} · <strong>Điện thoại:</strong> {phone}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-neutral-900">BÊN B (BÊN CUNG CẤP DỊCH VỤ):</div>
                <div className="pl-3 space-y-0.5">
                  <div><strong>CÔNG TY TNHH SUẤT ĂN CÔNG NGHIỆP HÓC MÔN (HOC MON CATERING)</strong></div>
                  <div><strong>Trụ sở chế biến:</strong> Đường Nguyễn Văn Bứa, Xã Xuân Thới Sơn, Huyện Hóc Môn, TP.HCM</div>
                  <div><strong>Chứng nhận:</strong> ISO 22000:2018 số TUV-VN-884192 / HACCP Codex 2020</div>
                  <div><strong>Đại diện pháp luật:</strong> Giám Đốc Điều Hành · <strong>Hotline:</strong> 1900 6828</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="font-bold text-neutral-900">ĐIỀU 1: NỘI DUNG VÀ ĐƠN GIÁ CUNG ỨNG</div>
                <div className="pl-3 space-y-1">
                  <div>• Gói thực đơn: <strong>{currentPkg.name}</strong> ({currentPkg.code}).</div>
                  <div>• Số lượng cam kết: <strong>{portionsPerDay} suất/ngày</strong> ({daysPerMonth} ngày/tháng).</div>
                  <div>• Đơn giá chốt: <strong>{adjustedUnitPrice.toLocaleString('vi-VN')} VNĐ / suất</strong> (Đã bao gồm chi phí vận chuyển nhiệt tận nơi và cơm canh thêm).</div>
                  <div>• Dự kiến chi phí hàng tháng: <strong>{monthlyTotal.toLocaleString('vi-VN')} VNĐ</strong>.</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <div className="font-bold text-neutral-900">ĐIỀU 2: CAM KẾT VỆ SINH AN TOÀN THỰC PHẨM</div>
                <div className="pl-3 space-y-1">
                  <div>• Bên B cam kết 100% nguyên liệu có nguồn gốc xuất xứ rõ ràng từ CP và VietGAP.</div>
                  <div>• Tuân thủ nghiêm ngặt chế độ kiểm thực 3 bước và lưu mẫu thức ăn 24 giờ tại tủ mát chuyên dụng.</div>
                  <div>• Duy trì nhiệt độ thùng chứa trên 65°C đến thời điểm phục vụ người lao động.</div>
                  <div>• Có gói bảo hiểm trách nhiệm pháp lý trị giá 10 tỷ đồng từ Tổng công ty Bảo hiểm Bảo Việt.</div>
                </div>
              </div>
            </div>

            {/* Print and Close Actions */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-500 font-mono">Bản thảo hợp đồng có giá trị 30 ngày</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-50"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-600" />
                  <span>In Bản Thảo PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
