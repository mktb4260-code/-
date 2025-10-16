
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ComparisonView } from './components/ComparisonView';
import { Spinner } from './components/Spinner';
import { editImageWithGemini } from './services/geminiService';
import { GithubIcon } from './components/GithubIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (base64Image: string) => {
    setOriginalImage(base64Image);
    setEditedImage(null);
    setError(null);
  };

  const handleApplyEdits = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const prompt = `Professionally edit this portrait. 
      1. Change the outfit to an elegant formal suit or a formal shirt, ensuring it blends seamlessly with the person's body.
      2. Naturally lighten the skin tone slightly, maintaining all facial features and identity.
      3. Enhance the lighting on the face to make it brighter and more vibrant, in a realistic way.
      4. Upscale the image resolution, improve sharpness, and remove any noise or artifacts for a high-quality result.`;
      
      const result = await editImageWithGemini(originalImage, prompt);
      setEditedImage(result);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          محسّن الصور الشخصية
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          حوّل صورك العادية إلى صور احترافية بلمسة زر
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        {!editedImage && (
           <ImageUploader onImageUpload={handleImageUpload} originalImage={originalImage} />
        )}
       
        {originalImage && !isLoading && !editedImage && (
          <button
            onClick={handleApplyEdits}
            disabled={isLoading}
            className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            تطبيق التعديلات
          </button>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <Spinner />
            <p className="mt-4 text-lg text-gray-300 animate-pulse">
              جاري المعالجة، قد يستغرق هذا بعض الوقت...
            </p>
          </div>
        )}

        {error && <p className="mt-8 text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        
        {editedImage && originalImage && (
           <div className="w-full">
            <ComparisonView original={originalImage} edited={editedImage} />
            <div className="flex justify-center mt-8 space-x-4 space-x-reverse">
                 <button
                    onClick={() => {
                        setOriginalImage(null);
                        setEditedImage(null);
                    }}
                    className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
                >
                    البدء من جديد
                </button>
            </div>
           </div>
        )}
      </main>

       <footer className="w-full max-w-5xl mt-auto pt-8 text-center text-gray-500">
        <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-gray-400 transition-colors">
            <GithubIcon className="w-5 h-5 ml-2" />
            <span>Powered by Gemini API</span>
        </a>
      </footer>
    </div>
  );
};

export default App;
