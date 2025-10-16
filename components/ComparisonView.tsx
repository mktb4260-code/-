
import React from 'react';

interface ComparisonViewProps {
  original: string;
  edited: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ original, edited }) => {
  return (
    <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-300">الصورة الأصلية</h2>
        <div className="w-full aspect-square bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
          <img src={original} alt="الأصلية" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">الصورة المعدّلة</h2>
        <div className="w-full aspect-square bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-500">
          <img src={edited} alt="المعدّلة" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};
