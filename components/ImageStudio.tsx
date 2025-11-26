import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { Camera, Upload, Wand2, Loader2, Download } from 'lucide-react';

const CAREER_PROMPTS = [
  { label: "Giáo viên", prompt: "Transform the person in the photo into a professional teacher in a classroom setting, wearing formal attire." },
  { label: "Công an", prompt: "Transform the person in the photo into a Vietnamese police officer wearing the official green uniform." },
  { label: "Bác sĩ", prompt: "Transform the person in the photo into a doctor wearing a white coat and a stethoscope in a hospital." },
  { label: "Cứu hoả", prompt: "Transform the person in the photo into a firefighter wearing protective gear with a fire truck background." },
  { label: "Đầu bếp", prompt: "Transform the person in the photo into a chef wearing a white chef's hat and apron in a kitchen." },
];

const ImageStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
    }
  };

  const handleGenerate = async () => {
    if (!previewUrl && !prompt) return;
    
    setIsLoading(true);
    try {
      const result = await editImage(selectedFile, prompt);
      setResultUrl(result);
    } catch (error) {
      alert("Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyCareer = (careerPrompt: string) => {
    setPrompt(careerPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Ghép Ảnh Nghề Nghiệp & Chỉnh Sửa AI</h2>
        <p className="text-slate-600">Sử dụng Gemini 2.5 Flash Image để biến đổi hình ảnh theo ý muốn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors min-h-[300px]"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <div className="text-center text-slate-400">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p>Nhấn để tải ảnh lên</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Chọn nghề nghiệp mẫu</label>
              <div className="flex flex-wrap gap-2">
                {CAREER_PROMPTS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => applyCareer(c.prompt)}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hoặc nhập yêu cầu (Prompt)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: Thêm bộ lọc màu cổ điển, xoá người phía sau..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || (!selectedFile && !prompt)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isLoading ? "Đang xử lý..." : "Tạo Hình Ảnh"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px] relative">
            <h3 className="absolute top-6 left-6 text-white font-medium opacity-50">Kết Quả</h3>
            {isLoading ? (
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
                    <p className="text-blue-200 animate-pulse">Gemini đang vẽ...</p>
                </div>
            ) : resultUrl ? (
                <div className="relative w-full h-full flex items-center justify-center group">
                    <img src={resultUrl} alt="Generated" className="max-w-full max-h-[450px] rounded-lg shadow-2xl" />
                    <a 
                      href={resultUrl} 
                      download="gemini-edit.png"
                      className="absolute bottom-4 right-4 bg-white text-slate-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                    >
                      <Download className="w-6 h-6" />
                    </a>
                </div>
            ) : (
                <div className="text-slate-600 text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-20 text-white" />
                    <p className="text-slate-500">Kết quả sẽ hiển thị tại đây</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
