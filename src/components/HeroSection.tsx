import React from 'react';
import { ShieldCheck, Truck, UtensilsCrossed, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onOpenAiAdvisor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenAiAdvisor }) => {
  return (
    <section className="relative bg-gradient-to-b from-emerald-50/60 via-white to-neutral-50 pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-800">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100/80 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Chứng nhận ISO 22000:2018 & HACCP Codex
              </span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">Bếp 1 chiều Hóc Môn</span>
              <span className="text-neutral-400">·</span>
              <span className="text-neutral-600">Bảo hiểm chất lượng 10 tỷ VNĐ</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight [text-wrap:balance]">
              Chuẩn Vị Cơm Nhà, <br />
              <span className="text-emerald-700">Đậm Đà Dinh Dưỡng</span> Cho Người Lao Động
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Hệ thống suất ăn công nghiệp &amp; học đường uy tín tại Hóc Môn. Chuyên cung cấp từ 
              <strong className="text-neutral-900 font-semibold"> 500 đến 35.000 suất/ngày</strong> cho các nhà máy, xí nghiệp may mặc, cơ khí và trường học bán trú tại KCN Tân Thới Hiệp, Cụm CN Nhị Xuân, KCN Bà Điểm, Vĩnh Lộc và Tây Bắc Củ Chi.
            </p>

            {/* Core Feature Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Thịt tươi CP & Rau củ VietGAP Củ Chi</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thùng giữ nhiệt điện tử đảm bảo &gt;68°C</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kiểm thực 3 bước & Lưu mẫu 24h chuẩn Y Tế</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cơm trắng dẻo và canh nóng tiếp thêm tự do</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('menu')}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm shadow-emerald-600/30 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Xem Thực Đơn Hôm Nay</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('quote')}
                className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm border border-neutral-300 shadow-xs flex items-center gap-2 transition-colors"
              >
                <span>Tạo Báo Giá Suất Ăn</span>
              </button>

              <button
                onClick={onOpenAiAdvisor}
                className="px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-sm border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Lập Thực Đơn AI</span>
              </button>
            </div>

            {/* Proof Metrics Adjacent to Claims */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                  35.000+
                </div>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">Suất ăn phục vụ / ngày</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  &gt;68°C
                </div>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">Giữ nóng khi đến bàn</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                  100%
                </div>
                <div className="text-xs text-neutral-500 font-medium mt-0.5">Mẫu kiểm thực 24h đạt</div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Kitchen Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-900 group">
              <img
                src="/src/assets/images/hero_catering_facility_1791218578563.jpg"
                alt="Trung tâm chế biến suất ăn công nghiệp Hóc Môn đạt chuẩn HACCP"
                className="w-full h-80 sm:h-96 lg:h-[430px] object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Measured Scrim Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent pointer-events-none" />

              {/* Bottom Card Annotation */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-neutral-900/85 backdrop-blur-md border border-neutral-700/60 text-white">
                <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Bếp Trung Tâm Hóc Môn #01
                  </span>
                  <span className="font-mono text-neutral-400">Ca Sáng 04:30 - 11:30</span>
                </div>
                <p className="text-xs text-neutral-200 leading-snug">
                  Hệ thống nồi hơi công nghiệp và dây chuyền chia suất khay inox 304 khép kín, tiệt trùng bằng tia cực tím UV.
                </p>
              </div>

              {/* Top Status Floating Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                Đang vận hành ca trưa 12.400 suất
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
