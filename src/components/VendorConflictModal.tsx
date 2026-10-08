import React from 'react';
import { AlertTriangle, Building2, CheckCircle, ArrowRight, X } from 'lucide-react';
import { VendorInfo } from '../utils/matchSupplier';

interface VendorConflictModalProps {
  isOpen: boolean;
  userSelected: VendorInfo;
  fileDetected: VendorInfo;
  onConfirm: (chosenVendorId: string) => void;
  onClose: () => void;
}

export const VendorConflictModal: React.FC<VendorConflictModalProps> = ({
  isOpen,
  userSelected,
  fileDetected,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-amber-300 overflow-hidden space-y-4">
        {/* Header */}
        <div className="px-5 py-4 bg-amber-500 text-white flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-100 animate-bounce" />
            <div>
              <h3 className="text-base font-black tracking-tight">XÁC NHẬN NHÀ CUNG CẤP TẢI LÊN</h3>
              <p className="text-xs text-amber-100">Phát hiện mâu thuẫn giữa thẻ chọn và nội dung tệp</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-600 text-amber-100 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
            <p className="font-medium text-sm">
              Tệp thực đơn này có vẻ thuộc về <strong className="text-amber-900 font-bold">{fileDetected.name} ({fileDetected.code})</strong>, nhưng bạn đang chọn thẻ <strong className="text-amber-900 font-bold">{userSelected.name} ({userSelected.code})</strong>.
            </p>
            <p className="text-amber-800 text-[11px]">
              Vui lòng chọn chính xác Nhà Cung Cấp muốn lưu để tránh làm lệch báo cáo thống kê:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Option 1: File Detected */}
            <button
              type="button"
              onClick={() => onConfirm(fileDetected.id)}
              className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-xs">Theo Tệp Thực Đơn:</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-mono text-[10px]">
                  {fileDetected.code}
                </span>
              </div>
              <div className="font-black text-sm text-emerald-900 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{fileDetected.name}</span>
              </div>
              <div className="text-[10px] text-emerald-700 mt-2 font-semibold flex items-center gap-1">
                <span>Đồng bộ vào {fileDetected.name}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Option 2: User Selected */}
            <button
              type="button"
              onClick={() => onConfirm(userSelected.id)}
              className="p-4 rounded-xl border-2 border-teal-500 bg-teal-50 hover:bg-teal-100 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-950 text-xs">Theo Thẻ Đang Chọn:</span>
                <span className="px-1.5 py-0.5 rounded bg-teal-700 text-white font-mono text-[10px]">
                  {userSelected.code}
                </span>
              </div>
              <div className="font-black text-sm text-teal-900 mt-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>{userSelected.name}</span>
              </div>
              <div className="text-[10px] text-teal-700 mt-2 font-semibold flex items-center gap-1">
                <span>Đồng bộ vào {userSelected.name}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs cursor-pointer"
          >
            Hủy thao tác
          </button>
        </div>
      </div>
    </div>
  );
};
