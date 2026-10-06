import React, { useState } from 'react';
import { Star, MessageSquare, Check, ThumbsUp, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [tasteRating, setTasteRating] = useState<string>('Vừa miệng');
  const [tempRating, setTempRating] = useState<string>('Nóng sốt chuẩn');
  const [portionRating, setPortionRating] = useState<string>('No chắc bụng');
  const [comment, setComment] = useState<string>('');
  const [company, setCompany] = useState<string>('Công Ty May Mặc Tân Thới Hiệp');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-neutral-900">
              Đánh Giá Chất Lượng Bữa Ăn Hôm Nay
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2 text-emerald-800 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base">Cảm ơn Quý Khách Đã Góp Ý!</h4>
            <p className="text-xs text-neutral-600">
              Ý kiến của quý khách đã được chuyển trực tiếp tới Bếp Trưởng để điều chỉnh khẩu vị ngay trong ca sau.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Doanh nghiệp / Phân xưởng:
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1.5">
                Mức Độ Hài Lòng Chung:
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold font-mono text-neutral-800 ml-2">{rating} / 5 Sao</span>
              </div>
            </div>

            {/* Taste & Temp */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-neutral-600 mb-1">Vị món ăn:</label>
                <select
                  value={tasteRating}
                  onChange={(e) => setTasteRating(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white"
                >
                  <option value="Vừa miệng">Vừa miệng, đậm đà</option>
                  <option value="Hơi nhạt">Hơi nhạt một chút</option>
                  <option value="Hơi mặn">Hơi mặn</option>
                  <option value="Ngon xuất sắc">Ngon xuất sắc</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-600 mb-1">Độ nóng canh & cơm:</label>
                <select
                  value={tempRating}
                  onChange={(e) => setTempRating(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white"
                >
                  <option value="Nóng sốt chuẩn">Nóng hổi vừa ăn (&gt;65°C)</option>
                  <option value="Ấm vừa">Ấm vừa phải</option>
                  <option value="Cần nóng hơn">Cần giữ nóng hơn</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Góp ý cụ thể (Món nào công nhân thích nhất hoặc cần thay đổi):
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="VD: Món sườn ram hôm nay rất ngon, cơm dẻo. Lần sau xin thêm chút nước chấm mắm tỏi..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Đánh Giá</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
