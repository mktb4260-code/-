
import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
  originalImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const onAreaClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full max-w-lg">
      <div 
        onClick={onAreaClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="relative w-full aspect-square border-2 border-dashed border-gray-600 rounded-2xl flex flex-col justify-center items-center text-center p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-800/50 transition-all duration-300"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files)}
          accept="image/*"
          className="hidden"
        />
        {originalImage ? (
          <img src={originalImage} alt="المعاينة الأصلية" className="max-h-full max-w-full object-contain rounded-lg" />
        ) : (
          <div className="text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <p className="mt-4 text-xl font-semibold">اختر صورة لتحسينها</p>
            <p className="mt-1 text-sm">أو اسحب الصورة وأفلتها هنا</p>
          </div>
        )}
      </div>
    </div>
  );
};
