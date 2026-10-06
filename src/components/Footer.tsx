import React from 'react';
import { Utensils, ShieldCheck, Phone, Mail, MapPin, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                HÓC MÔN <span className="text-emerald-400">CATERING</span>
              </span>
            </div>

            <p className="text-neutral-400 leading-relaxed">
              Hệ thống cung cấp suất ăn công nghiệp và học đường tiêu chuẩn quốc tế ISO 22000:2018 tại huyện Hóc Môn, Quận 12, Bình Tân và Củ Chi.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Bảo hiểm trách nhiệm 10 Tỷ VNĐ</span>
            </div>
          </div>

          {/* Col 2: Processing Center Address */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">Trung Tâm Chế Biến 1 Chiều</div>
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Số 45/2B Đường Nguyễn Văn Bứa, Xã Xuân Thới Sơn, Huyện Hóc Môn, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-white font-semibold">1900 6828 - 0908 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>kinhdoanh@suatanhocmon.com.vn</span>
              </div>
            </div>
          </div>

          {/* Col 3: Service Zones */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">Địa Bàn Phục Vụ Nòng Cốt</div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>• Khu Công Nghiệp Tân Thới Hiệp</li>
              <li>• Cụm Công Nghiệp Nhị Xuân Hóc Môn</li>
              <li>• Khu Công Nghiệp Bà Điểm</li>
              <li>• Khu Công Nghiệp Vĩnh Lộc</li>
              <li>• KCN Tân Phú Trung &amp; Tây Bắc Củ Chi</li>
              <li>• Hệ thống trường tiểu học, mầm non Hóc Môn</li>
            </ul>
          </div>

          {/* Col 4: Quality & Legal Standards */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm">Quy Chuẩn Chất Lượng</div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>• Hệ thống ISO 22000:2018</li>
              <li>• Chứng chỉ HACCP Codex Alimentarius 2020</li>
              <li>• Giấy chứng nhận ATTP Ban Quản Lý TP.HCM</li>
              <li>• Kiểm thực 3 bước theo Quyết định 1246/QĐ-BYT</li>
              <li>• 100% Thịt sạch CP &amp; Rau sạch VietGAP</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-neutral-500 gap-3">
          <div>
            © {new Date().getFullYear()} Công Ty TNHH Suất Ăn Công Nghiệp Hóc Môn. Bảo lưu mọi quyền.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>MSDN: 0314892102</span>
            <span>·</span>
            <span>Mã Vùng: 028-HCM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
