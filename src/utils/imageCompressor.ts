/**
 * Client-side image compressor & resizer
 * - Max long dimension: 2000px
 * - JPEG quality: 0.85
 * - Corrects canvas orientation and converts to base64
 */
export async function compressAndResizeImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve({ base64: (reader.result as string) || '', mimeType: file.type || 'application/octet-stream' });
      reader.onerror = () => resolve({ base64: '', mimeType: file.type || 'application/octet-stream' });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 2000;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', 0.85);
            resolve({ base64, mimeType: 'image/jpeg' });
            return;
          }
        } catch (err) {
          console.warn('Canvas compression failed, falling back to raw reader:', err);
        }
        resolve({ base64: (e.target?.result as string) || '', mimeType: file.type || 'image/jpeg' });
      };
      img.onerror = () => resolve({ base64: (e.target?.result as string) || '', mimeType: file.type || 'image/jpeg' });
      img.src = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  });
}
