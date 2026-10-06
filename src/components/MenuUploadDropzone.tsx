import React, { useRef, useState } from 'react';
import { CheckCircle2, Upload, History, FileImage, Sparkles, Check } from 'lucide-react';

interface MenuUploadDropzoneProps {
  currentMenuName: string;
  onImageUploaded?: (file: File) => void;
  onOpenHistory?: () => void;
}

export const MenuUploadDropzone: React.FC<MenuUploadDropzoneProps> = ({
  currentMenuName,
  onImageUploaded,
  onOpenHistory
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (onImageUploaded) {
      onImageUploaded(file);
    }
    setUploadSuccessMsg(`Đã nhận diện thực đơn: "${file.name}"`);
    setTimeout(() => setUploadSuccessMsg(null), 4000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-1.5">
            1. Tải ảnh thực đơn
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            PNG, JPG hoặc WEBP · ảnh là căn cứ để điền nội dung
          </p>
        </div>
        <div className="text-emerald-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-teal-500 bg-teal-50/50'
            : 'border-teal-200/80 bg-white hover:bg-neutral-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Upload className="w-5 h-5" />
        </div>

        <div className="text-xs font-bold text-neutral-800">
          Kéo thả ảnh vào đây hoặc chọn tệp
        </div>
        <div className="text-[11px] text-neutral-400 mt-1">
          Nhận diện nhà cung cấp, ngày và nội dung theo thực đơn
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Current Active Menu Status */}
      <div className="px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-neutral-200/70 flex items-center gap-2 text-xs text-neutral-600">
        <span className="text-neutral-400">🕒</span>
        <span className="font-medium truncate">{currentMenuName || 'Chưa có menu đang dùng'}</span>
      </div>

      {/* History Card Below */}
      <div
        onClick={onOpenHistory}
        className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors"
      >
        <div>
          <div className="font-semibold text-neutral-800">Lịch sử menu đã tải</div>
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Xem lại, khôi phục hoặc xóa menu tải nhầm.
          </div>
        </div>
        <History className="w-4 h-4 text-neutral-400 shrink-0" />
      </div>
    </div>
  );
};
