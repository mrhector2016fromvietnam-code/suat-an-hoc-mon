import React, { useState } from 'react';
import { 
  Building2, Users, Clock, Send, CheckCircle2, 
  AlertCircle, FileText, Printer, Calendar, Utensils
} from 'lucide-react';
import { CATERING_CLIENTS, INITIAL_ADJUSTMENTS, MEAL_PACKAGES } from '../data/mockData';
import { DailyMealAdjustment } from '../types/catering';

export const DailyMealCountPortal: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string>(CATERING_CLIENTS[0].id);
  const [targetDate, setTargetDate] = useState<string>('07/10/2026');
  const [lunchCount, setLunchCount] = useState<number>(850);
  const [dinnerCount, setDinnerCount] = useState<number>(420);
  const [nightCount, setNightCount] = useState<number>(90);
  const [vegCount, setVegCount] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');
  const [adjustmentsList, setAdjustmentsList] = useState<DailyMealAdjustment[]>(INITIAL_ADJUSTMENTS);
  const [submittedReceipt, setSubmittedReceipt] = useState<DailyMealAdjustment | null>(null);

  const currentClient = CATERING_CLIENTS.find((c) => c.id === selectedClientId) || CATERING_CLIENTS[0];
  const currentPackage = MEAL_PACKAGES.find((p) => p.id === currentClient.activePackageId) || MEAL_PACKAGES[0];

  // Handle client change to populate default counts
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = CATERING_CLIENTS.find((c) => c.id === clientId);
    if (client) {
      setLunchCount(client.standardPortions.lunch);
      setDinnerCount(client.standardPortions.dinner);
      setNightCount(client.standardPortions.night);
      setVegCount(client.standardPortions.vegetarian);
    }
  };

  const totalPortions = lunchCount + dinnerCount + nightCount;
  const unitPrice = currentPackage.price;
  const totalCost = totalPortions * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdjustment: DailyMealAdjustment = {
      id: `ADJ-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentClient.id,
      clientName: currentClient.name,
      date: targetDate,
      lunchCount,
      dinnerCount,
      nightCount,
      vegetarianCount: vegCount,
      specialDietNotes: notes || 'Tiêu chuẩn theo hợp đồng.',
      status: 'Đã xác nhận',
      submittedAt: 'Vừa xong (Trực tuyến)',
      totalEstimatedCost: totalCost
    };

    setAdjustmentsList([newAdjustment, ...adjustmentsList]);
    setSubmittedReceipt(newAdjustment);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Cổng B2B Tự Phục Vụ Doanh Nghiệp &amp; Nhà Trường
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
          Báo Số Lượng &amp; Điều Chỉnh Suất Ăn Hàng Ngày
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
          Quý khách vui lòng chốt số lượng trước <strong>09:00 sáng</strong> cho ca trưa và trước <strong>14:00 chiều</strong> cho ca chiều/tối để Bếp Hóc Môn đảm bảo chuẩn bị đủ nguyên liệu tươi trong ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Choose Client Company */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Chọn Doanh Nghiệp / Đơn Vị Của Bạn:
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-neutral-50/50"
              >
                {CATERING_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} — {client.zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Contract Info Summary Box */}
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-neutral-500">Gói đang áp dụng:</span>{' '}
                <strong className="text-neutral-900 font-semibold">{currentPackage.name}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Đơn giá:</span>{' '}
                <strong className="text-emerald-700 font-mono font-bold">{unitPrice.toLocaleString('vi-VN')} đ/suất</strong>
              </div>
              <div>
                <span className="text-neutral-500">Đại diện:</span>{' '}
                <span className="text-neutral-700">{currentClient.contactPerson}</span>
              </div>
            </div>

            {/* Target Delivery Date */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Ngày Áp Dụng Suất Ăn:
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Portion Adjustments Inputs */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-neutral-800">
                Nhập Số Lượng Suất Cần Phục Vụ Theo Ca:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lunch */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">Ca Trưa (11:30)</span>
                    <span className="text-[11px] text-neutral-500 font-mono">Bữa chính</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={lunchCount}
                    onChange={(e) => setLunchCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white font-mono font-bold text-base text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Dinner */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">Ca Chiều (16:30)</span>
                    <span className="text-[11px] text-neutral-500 font-mono">Tăng ca 1</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={dinnerCount}
                    onChange={(e) => setDinnerCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white font-mono font-bold text-base text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Night */}
                <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">Ca Đêm (21:30 - 23:00)</span>
                    <span className="text-[11px] text-neutral-500 font-mono">Tăng ca đêm</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={nightCount}
                    onChange={(e) => setNightCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 bg-white font-mono font-bold text-base text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Vegetarian */}
                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-amber-900">Suất Chay (Trong tổng số)</span>
                    <span className="text-[11px] text-amber-700 font-mono">Ăn chay</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={totalPortions}
                    value={vegCount}
                    onChange={(e) => setVegCount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white font-mono font-bold text-base text-amber-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions & Notes */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Ghi Chú Đặc Biệt Cho Bếp Trưởng Hóc Môn:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Tăng 20 suất cho chuyền may 3 làm thêm giờ, xin thêm nước sốt cay riêng, đóng thùng giữ nhiệt giao trước 11h15..."
                className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Summary & Submit Button */}
            <div className="pt-2 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs text-neutral-500">Tổng cộng ngày {targetDate}:</div>
                <div className="text-xl font-extrabold font-mono text-emerald-800 tabular-nums">
                  {totalPortions} suất · {totalCost.toLocaleString('vi-VN')} đ
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-700/30 transition-all hover:scale-101"
              >
                <Send className="w-4 h-4" />
                <span>Xác Nhận &amp; Báo Bếp Trưởng</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Historical Adjustment Feed & Receipt */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Receipt Preview if submitted */}
          {submittedReceipt && (
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-md space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Đã Gửi Bếp Thành Công!
                </span>
                <span className="font-mono text-xs text-neutral-500">{submittedReceipt.id}</span>
              </div>

              <div className="text-sm font-bold">{submittedReceipt.clientName}</div>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-emerald-200">
                <div>
                  <div className="text-emerald-700">Ca trưa:</div>
                  <div className="font-bold font-mono text-neutral-900">{submittedReceipt.lunchCount}</div>
                </div>
                <div>
                  <div className="text-emerald-700">Ca chiều:</div>
                  <div className="font-bold font-mono text-neutral-900">{submittedReceipt.dinnerCount}</div>
                </div>
                <div>
                  <div className="text-emerald-700">Suất chay:</div>
                  <div className="font-bold font-mono text-amber-800">{submittedReceipt.vegetarianCount}</div>
                </div>
              </div>

              <div className="text-xs text-neutral-600">
                <strong>Ghi chú:</strong> {submittedReceipt.specialDietNotes}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-500 font-mono">Bếp tiếp nhận lúc {submittedReceipt.submittedAt}</span>
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-xs text-emerald-800 font-medium flex items-center gap-1 hover:bg-emerald-100/50"
                >
                  <Printer className="w-3 h-3" /> In phiếu
                </button>
              </div>
            </div>
          )}

          {/* Adjustments History */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Nhật Ký Chốt Suất Ăn Gần Nhất</span>
              </h3>
              <span className="text-[11px] text-neutral-500 font-mono">Lưu trữ thời gian thực</span>
            </div>

            <div className="space-y-3">
              {adjustmentsList.map((adj) => (
                <div
                  key={adj.id}
                  className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{adj.clientName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {adj.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600 font-mono">
                    <span>Ngày {adj.date}</span>
                    <span className="font-bold text-neutral-900">
                      {(adj.lunchCount + adj.dinnerCount + adj.nightCount)} suất ({adj.vegetarianCount} chay)
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500 truncate">
                    {adj.specialDietNotes}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-200/60">
                    <span>{adj.id} · {adj.submittedAt}</span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      {adj.totalEstimatedCost.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
