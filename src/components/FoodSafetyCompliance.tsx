import React, { useState } from 'react';
import { 
  ShieldCheck, Award, FileCheck2, Thermometer, 
  CheckCircle2, Clock, AlertCircle, Eye, Download, Search
} from 'lucide-react';
import { FOOD_SAFETY_SAMPLES_TODAY } from '../data/mockData';
import { FoodSafetySample } from '../types/catering';

export const FoodSafetyCompliance: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<FoodSafetySample | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Tiêu Chuẩn Bộ Y Tế &amp; Ban Quản Lý ATTP TP.HCM
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            Quy Trình Kiểm Thực 3 Bước &amp; Nhật Ký Lưu Mẫu 24H
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
            Tuân thủ nghiêm ngặt Quyết định 1246/QĐ-BYT. Từng ca sản xuất đều được bộ phận KCS đo nhiệt độ tâm món, lưu mẫu niêm phong và lưu giữ kết quả truy xuất nguồn gốc tối thiểu 2 năm.
          </p>
        </div>

        {/* View Certificates Action */}
        <button
          onClick={() => setShowCertificateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Xem Chứng Chỉ HACCP &amp; ISO 22000</span>
        </button>
      </div>

      {/* 3-Step Testing Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
              01
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Bước 1: Nhập Kho
            </span>
          </div>

          <h3 className="text-base font-bold text-neutral-900">
            Kiểm Tra Nguồn Gốc &amp; Độ Tươi Sống
          </h3>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Kiểm tra 100% hóa đơn chứng từ, tem thú y từ Chợ Đầu Mối Hóc Môn và Công ty CP. Rau củ quả phải đạt chứng nhận VietGAP, không dập nát, đo độ pH và dư lượng nitrat bằng máy đo chuyên dụng trước khi sơ chế.
          </p>

          <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Thịt heo CP có giấy kiểm dịch theo lô
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rau VietGAP HTX Củ Chi giao lúc 04h00
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
              02
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Bước 2: Chế Biến
            </span>
          </div>

          <h3 className="text-base font-bold text-neutral-900">
            Quy Trình Bếp 1 Chiều &amp; Nhiệt Độ Sôi
          </h3>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Nguyên tắc một chiều: Khu tiếp nhận ➔ Sơ chế ➔ Nấu chín ➔ Chia khay ➔ Vận chuyển. Dao thớt phân biệt màu sắc rõ ràng (Đỏ: thịt sống, Xanh: rau chín). Nhiệt độ tâm món kho/nấu luôn đạt &gt;100°C.
          </p>

          <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Khử trùng tia cực tím UV khay muỗng inox
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dầu ăn không tái sử dụng quá 1 lần
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
              03
            </span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Bước 3: Chia Suất &amp; Lưu Mẫu
            </span>
          </div>

          <h3 className="text-base font-bold text-neutral-900">
            Lưu Mẫu Niêm Phong 24H - 48H
          </h3>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Trước khi vận chuyển, lấy mẫu 150g cho từng món ăn vào thố inox vô trùng. Dán tem niêm phong ghi rõ ngày giờ, chữ ký chuyên viên KCS và lưu trong tủ mát 2°C - 8°C (24h cho nhà máy, 48h cho trường học).
          </p>

          <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tủ lạnh chuyên dụng khóa mật mã KCS
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Biên bản hủy mẫu an toàn sinh học
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Food Safety Sample Retention Ledger */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>Sổ Nhật Ký Lưu Mẫu Thức Ăn Hôm Nay</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Dữ liệu được cập nhật tự động từ tủ lưu mẫu kiểm nghiệm tại Trung tâm chế biến Hóc Môn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span>Nhiệt độ tủ mát: <strong>3.8°C</strong> (Đạt chuẩn 2°C - 8°C)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <th className="py-3 px-4">Mã Mẫu / Ngày Giờ</th>
                <th className="py-3 px-4">Ca Ăn</th>
                <th className="py-3 px-4">Chi Tiết Món Ăn Lưu Mẫu</th>
                <th className="py-3 px-4">Tủ Lưu &amp; Nhiệt Độ</th>
                <th className="py-3 px-4">Tem Niêm Phong</th>
                <th className="py-3 px-4">Kiểm Nghiệm Viên</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Biên Bản</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {FOOD_SAFETY_SAMPLES_TODAY.map((sample) => (
                <tr
                  key={sample.id}
                  className="hover:bg-neutral-50/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedSample(sample)}
                >
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-neutral-900">{sample.id}</div>
                    <div className="text-[11px] text-neutral-500">{sample.date}</div>
                  </td>

                  <td className="py-3 px-4 font-medium text-neutral-900">
                    {sample.mealShift}
                  </td>

                  <td className="py-3 px-4 max-w-xs text-xs text-neutral-800">
                    <div className="truncate font-medium">{sample.menuSummary}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{sample.supplierProof}</div>
                  </td>

                  <td className="py-3 px-4 text-xs">
                    <div className="font-medium text-neutral-800">{sample.storageCabinet}</div>
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">{sample.cabinetTemp}°C</div>
                  </td>

                  <td className="py-3 px-4 font-mono text-xs font-semibold text-neutral-900">
                    {sample.sealNumber}
                  </td>

                  <td className="py-3 px-4 text-xs text-neutral-700">
                    {sample.inspectorName}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium text-xs border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sample.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSample(sample);
                      }}
                      className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-neutral-100 rounded"
                      title="Xem biên bản mẫu"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Sample Detailed Inspection Report */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Biên Bản Kiểm Thực &amp; Lưu Mẫu 24H
                </h3>
                <span className="text-xs text-neutral-500 font-mono">Mã số: {selectedSample.id}</span>
              </div>
              <button
                onClick={() => setSelectedSample(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-neutral-500">Món ăn lưu mẫu:</div>
                <div className="font-bold text-neutral-900 text-sm">{selectedSample.menuSummary}</div>
                <div className="text-neutral-500 text-[11px] pt-1">
                  Định lượng lưu: 150g mỗi món trong thố inox tiệt trùng nhiệt độ cao.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-neutral-500">Nhiệt độ tủ mát:</div>
                  <div className="text-xl font-bold font-mono text-emerald-900 tabular-nums">
                    {selectedSample.cabinetTemp}°C
                  </div>
                  <div className="text-[11px] text-emerald-700">Ổn định tự động</div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="text-neutral-500">Thời gian lưu:</div>
                  <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
                    {selectedSample.retentionHours} Giờ
                  </div>
                  <div className="text-[11px] text-neutral-500">Theo chuẩn Bộ Y Tế</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-neutral-500">Tem niêm phong:</div>
                <div className="font-mono font-bold text-emerald-800 text-sm">{selectedSample.sealNumber}</div>
                <div className="text-neutral-500">Chứng từ nguồn nguyên liệu:</div>
                <div className="text-neutral-800">{selectedSample.supplierProof}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="text-neutral-500">Chuyên viên phụ trách kiểm định:</div>
                <div className="font-semibold text-neutral-900">{selectedSample.inspectorName}</div>
                <div className="text-neutral-600">{selectedSample.notes}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSample(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Certifications Showcase */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  Chứng Nhận Pháp Lý &amp; Chất Lượng An Toàn
                </h3>
                <span className="text-xs text-neutral-500">Hệ Thống Suất Ăn Công Nghiệp Hóc Môn</span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-950 text-sm">1. Tiêu chuẩn Quốc Tế ISO 22000:2018</strong>
                  <span className="font-mono text-emerald-800 font-semibold">Hiệu lực đến 2028</span>
                </div>
                <p className="text-emerald-900">
                  Chứng nhận Hệ thống Quản lý An toàn Thực phẩm cấp cho cơ sở chế biến thực phẩm công nghiệp quy mô lớn tại huyện Hóc Môn, TP. Hồ Chí Minh.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-blue-950 text-sm">2. Chứng nhận HACCP Codex Alimentarius 2020</strong>
                  <span className="font-mono text-blue-800 font-semibold">Tổ chức TUV Rheinland</span>
                </div>
                <p className="text-blue-900">
                  Hệ thống phân tích mối nguy và kiểm soát điểm tới hạn trong chuỗi tiếp nhận, chế biến nhiệt và phân phối suất ăn công nghiệp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-neutral-900 text-sm">3. Giấy Chứng Nhận Đủ Điều Kiện ATTP</strong>
                  <span className="font-mono text-neutral-600">Số: 4821/2024/ATTP-HCM</span>
                </div>
                <p className="text-neutral-700">
                  Do Ban Quản lý An toàn thực phẩm TP. Hồ Chí Minh thẩm định và cấp phép cho trung tâm chế biến tại đường Nguyễn Văn Bứa, Xuân Thới Sơn, Huyện Hóc Môn.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-950 text-sm">4. Hợp Đồng Bảo Hiểm Trách Nhiệm Sản Phẩm</strong>
                  <span className="font-mono text-amber-800 font-semibold">Mức bảo hiểm 10 Tỷ VNĐ</span>
                </div>
                <p className="text-amber-900">
                  Bảo hiểm Bảo Việt cam kết bảo vệ toàn diện quyền lợi và sức khỏe người tiêu dùng khi sử dụng suất ăn từ hệ thống Hóc Môn Catering.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800"
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
