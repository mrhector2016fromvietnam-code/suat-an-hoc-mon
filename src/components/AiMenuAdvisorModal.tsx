import React, { useState } from 'react';
import { 
  Sparkles, Flame, ChefHat, Check, AlertCircle, 
  RefreshCw, Printer, Calendar, ArrowRight, ShieldCheck
} from 'lucide-react';

interface AiMenuAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMenu?: (menuData: any) => void;
}

interface MenuDayAi {
  day: string;
  mainDish: string;
  sideDish: string;
  soup: string;
  stirFry: string;
  dessert: string;
  kcal: number;
  highlight: string;
}

interface AiGeneratedMenuResponse {
  title: string;
  targetCalories: number;
  proteinAvgGrams: number;
  rationale: string;
  chefTips: string;
  menuDays: MenuDayAi[];
}

export const AiMenuAdvisorModal: React.FC<AiMenuAdvisorModalProps> = ({
  isOpen,
  onClose,
  onApplyMenu
}) => {
  const [budget, setBudget] = useState<number>(25000);
  const [audience, setAudience] = useState<string>('Công nhân may mặc nữ (KCN Tân Thới Hiệp)');
  const [dietaryNotes, setDietaryNotes] = useState<string>('Giàu sắt và canxi, không dầu mỡ ngấy, canh chua giải nhiệt ca làm việc nóng');
  const [daysCount, setDaysCount] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedMenu, setGeneratedMenu] = useState<AiGeneratedMenuResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/menu-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          audience,
          dietaryNotes,
          daysCount
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setGeneratedMenu(result.data);
      } else {
        setErrorMsg(result.error || 'Không thể tạo thực đơn từ AI lúc này');
      }
    } catch (err: any) {
      console.error('Fetch AI menu failed:', err);
      setErrorMsg('Lỗi kết nối tới máy chủ AI. Vui lòng thử lại sau giây lát.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border border-neutral-200 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Trợ Lý Dinh Dưỡng &amp; Lập Thực Đơn Gemini AI
              </h3>
              <p className="text-xs text-neutral-500">
                Tính toán ma trận dinh dưỡng theo Viện Dinh Dưỡng Quốc Gia và giá nguyên liệu Hóc Môn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Input Controls */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Target Budget */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Mức Giá Ngân Sách Dự Kiến:
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono font-semibold text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value={20000}>20.000 VNĐ / suất (Tiết kiệm)</option>
                <option value={22000}>22.000 VNĐ / suất (Công nhân tiêu chuẩn)</option>
                <option value={25000}>25.000 VNĐ / suất (Bán chạy)</option>
                <option value={28000}>28.000 VNĐ / suất (Lao động nặng / Ca đêm)</option>
                <option value={32000}>32.000 VNĐ / suất (Bán trú học đường)</option>
                <option value={35000}>35.000 VNĐ / suất (Văn phòng &amp; Kỹ sư)</option>
                <option value={50000}>50.000 VNĐ / suất (Chuyên gia / VIP)</option>
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Đối Tượng &amp; Ngành Nghề:
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Công nhân may mặc nữ (KCN Tân Thới Hiệp)">
                  Công nhân may mặc nữ (KCN Tân Thới Hiệp)
                </option>
                <option value="Thợ cơ khí, hàn xì & chế biến gỗ nặng (Cụm CN Nhị Xuân)">
                  Thợ cơ khí nặng &amp; chế biến gỗ (Cụm CN Nhị Xuân)
                </option>
                <option value="Nhân viên văn phòng & kỹ sư vi điện tử (KCN Vĩnh Lộc)">
                  Nhân viên văn phòng &amp; kỹ sư (KCN Vĩnh Lộc)
                </option>
                <option value="Học sinh mầm non & tiểu học bán trú Hóc Môn">
                  Học sinh tiểu học &amp; mầm non bán trú
                </option>
                <option value="Công nhân ăn chay định kỳ & thực dưỡng">
                  Công nhân ăn chay &amp; thực dưỡng
                </option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Yêu Cầu Dinh Dưỡng Đặc Thù:
            </label>
            <input
              type="text"
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              placeholder="VD: Không dùng bột ngọt, canh nhiều rau xanh giải nhiệt, nhiều cá bổ sung DHA..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-500 font-mono">
              Mô hình: Gemini 3.8 Flash (Server-Side @google/genai)
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Đang Phân Tích &amp; Lập Ma Trận...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tạo Thực Đơn Dinh Dưỡng</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AI Results Presentation */}
        {generatedMenu && (
          <div className="space-y-4 pt-3 border-t border-neutral-200">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-emerald-950 text-sm">{generatedMenu.title}</h4>
                <div className="flex items-center gap-3 text-xs font-mono font-bold">
                  <span className="text-amber-800 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    {generatedMenu.targetCalories} kcal TB
                  </span>
                  <span className="text-emerald-800">
                    Đạm: ~{generatedMenu.proteinAvgGrams}g / suất
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-900 leading-relaxed">
                {generatedMenu.rationale}
              </p>

              {generatedMenu.chefTips && (
                <div className="pt-2 border-t border-emerald-200/80 flex items-start gap-2 text-[11px] text-emerald-800">
                  <ChefHat className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Lời khuyên Bếp trưởng:</strong> {generatedMenu.chefTips}</span>
                </div>
              )}
            </div>

            {/* Menu Days Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-neutral-800">
                Thực Đơn Tuần Đề Xuất Chi Tiết:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {generatedMenu.menuDays.map((dayItem, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
                      <span className="font-bold text-neutral-900">{dayItem.day}</span>
                      <span className="font-mono text-amber-700 font-bold">{dayItem.kcal} kcal</span>
                    </div>

                    <div className="space-y-1">
                      <div>
                        <span className="font-semibold text-neutral-900">Món chính:</span>{' '}
                        <span className="text-emerald-800 font-medium">{dayItem.mainDish}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-700">Món phụ:</span>{' '}
                        <span className="text-neutral-700">{dayItem.sideDish}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-700">Canh:</span>{' '}
                        <span className="text-neutral-700">{dayItem.soup}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-700">Rau:</span>{' '}
                        <span className="text-neutral-700">{dayItem.stirFry}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-700">Tráng miệng:</span>{' '}
                        <span className="text-neutral-700">{dayItem.dessert}</span>
                      </div>
                    </div>

                    {dayItem.highlight && (
                      <div className="text-[11px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded font-medium mt-1">
                        ★ {dayItem.highlight}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-mono">
                Đã cân đối chi phí theo giá Chợ Đầu Mối Hóc Môn
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Thực Đơn Này</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
                >
                  Hoàn Tất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
