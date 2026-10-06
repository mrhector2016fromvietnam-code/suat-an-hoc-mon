import React, { useState } from 'react';
import { Check, Flame, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { MEAL_PACKAGES } from '../data/mockData';
import { MealPackage } from '../types/catering';

interface MealPackagesSectionProps {
  onSelectPackageForQuote: (pkgId: string) => void;
  onOpenAiAdvisor: () => void;
}

export const MealPackagesSection: React.FC<MealPackagesSectionProps> = ({
  onSelectPackageForQuote,
  onOpenAiAdvisor
}) => {
  const [activeTier, setActiveTier] = useState<string>('all');

  const filteredPackages = MEAL_PACKAGES.filter((pkg) => {
    if (activeTier === 'all') return true;
    if (activeTier === 'worker') return pkg.id.includes('cong-nhan');
    if (activeTier === 'office') return pkg.id.includes('van-phong') || pkg.id.includes('chuyen-gia');
    if (activeTier === 'school') return pkg.id.includes('hoc-duong');
    if (activeTier === 'veg') return pkg.id.includes('chay');
    return true;
  });

  return (
    <div className="py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Đa Dạng Định Lượng &amp; Ngân Sách Linh Hoạt
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Các Gói Suất Ăn Công Nghiệp &amp; Học Đường
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Tất cả các gói đều cam kết phục vụ bằng khay inox 304 tiêu chuẩn, bảo đảm an toàn vệ sinh thực phẩm 100%, có mẫu thức ăn lưu 24h và miễn phí tiếp thêm cơm dẻo canh nóng.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-neutral-200 text-xs font-medium">
          <button
            onClick={() => setActiveTier('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTier === 'all' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Tất cả gói
          </button>
          <button
            onClick={() => setActiveTier('worker')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTier === 'worker' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Công nhân
          </button>
          <button
            onClick={() => setActiveTier('office')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTier === 'office' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Văn phòng / VIP
          </button>
          <button
            onClick={() => setActiveTier('school')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTier === 'school' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Học đường
          </button>
          <button
            onClick={() => setActiveTier('veg')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTier === 'veg' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Suất chay
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Header with Scrim */}
                <div className="relative h-44 bg-neutral-900 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

                  {/* Badge Text */}
                  {pkg.badgeText && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[11px] font-semibold backdrop-blur-xs">
                      {pkg.badgeText}
                    </div>
                  )}

                  {/* Code & Price on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <div className="text-[11px] font-mono text-emerald-300">{pkg.code}</div>
                      <div className="text-base font-bold">{pkg.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold font-mono text-emerald-400 tabular-nums">
                        {pkg.price.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="text-[10px] text-neutral-300">/ suất / bữa</div>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  {/* Calorie and Target Strip */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-neutral-200">
                    <span className="flex items-center gap-1 text-neutral-600">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {pkg.targetAudience}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-bold text-amber-700">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {pkg.caloriesTarget} kcal
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-semibold text-neutral-800">Khẩu phần bao gồm:</div>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectPackageForQuote(pkg.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Chọn Gói &amp; Tính Báo Giá</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Menu Callout */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold">
            Doanh nghiệp có mức ngân sách riêng hoặc yêu cầu đặc biệt?
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Chúng tôi nhận may đo thực đơn theo ngân sách từ 18.000đ đến 70.000đ, phục vụ ca đêm, suất ăn chuyên gia nước ngoài (Hàn Quốc, Đài Loan, Nhật Bản) và suất ăn ăn kiêng.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAiAdvisor}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tư Vấn Thực Đơn Bằng AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
