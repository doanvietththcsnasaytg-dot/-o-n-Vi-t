import React, { useState } from 'react';
import { ExamConfig, ExamData } from '../types';
import { generateExamData } from '../services/geminiService';
import { FileText, Loader2, Download, Play, BookOpen } from 'lucide-react';

interface ExamGeneratorProps {
  onStartExam: (data: ExamData) => void;
}

const ExamGenerator: React.FC<ExamGeneratorProps> = ({ onStartExam }) => {
  const [config, setConfig] = useState<ExamConfig>({
    grade: 'Khối 3',
    subject: 'Tin học',
    semester: 'Học kì I',
    book: 'Kết nối tri thức với cuộc sống'
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<ExamData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedExam(null);
    try {
      const data = await generateExamData(
        config.grade,
        config.subject,
        config.semester,
        config.book,
        files
      );
      setGeneratedExam(data);
    } catch (error) {
      alert("Lỗi khi tạo đề. Vui lòng kiểm tra API Key và thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadWord = () => {
    if (!generatedExam) return;
    // Simulation of Word download using a simple text blob for this demo
    // In a real app, use `docx` library.
    const content = `
      ĐỀ KIỂM TRA ${config.subject.toUpperCase()} - ${config.grade.toUpperCase()}
      Thời gian: ${generatedExam.durationMinutes} phút
      
      I. TRẮC NGHIỆM
      ${generatedExam.questions.filter(q => q.type === 'MULTIPLE_CHOICE').map((q: any, i) => 
        `Câu ${i+1}: ${q.text}\n${q.options.map((o: string, idx: number) => `   ${String.fromCharCode(65+idx)}. ${o}`).join('\n')}`
      ).join('\n\n')}

      II. TỰ LUẬN / NỐI
      ... (Chi tiết trong file hệ thống)
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `De_Kiem_Tra_${config.subject}_${new Date().getTime()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Tạo Đề & Ôn Tập</h2>
        <p className="text-slate-600 mt-2">Sinh đề tự động từ ma trận và đặc tả bằng Gemini AI</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Cấu hình đề thi
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Khối Lớp</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={config.grade}
                onChange={e => setConfig({...config, grade: e.target.value})}
              >
                <option>Khối 3</option>
                <option>Khối 4</option>
                <option>Khối 5</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Môn Học</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={config.subject}
                onChange={e => setConfig({...config, subject: e.target.value})}
              >
                <option>Tin học</option>
                <option>Công nghệ</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Học Kỳ</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={config.semester}
                onChange={e => setConfig({...config, semester: e.target.value})}
              >
                <option>Học kì I</option>
                <option>Cuối học kì II</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bộ Sách</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={config.book}
                onChange={e => setConfig({...config, book: e.target.value})}
              >
                <option>Kết nối tri thức với cuộc sống</option>
                <option>Chân trời sáng tạo</option>
                <option>Cánh diều</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Ma trận / Bản đặc tả (Word/Excel)</label>
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 flex items-center justify-between">
              <input 
                type="file" 
                multiple 
                accept=".doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <span className="text-xs text-slate-400">{files.length} file đã chọn</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
           {generatedExam ? (
             <>
                <button 
                  onClick={downloadWord}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải File Word
                </button>
                <button 
                  onClick={() => onStartExam(generatedExam)}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm shadow-green-200"
                >
                  <Play className="w-4 h-4" />
                  Thi Trực Tuyến Ngay
                </button>
             </>
           ) : (
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200 disabled:opacity-70"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              {isGenerating ? "Đang Sinh Đề..." : "Tạo Đề Kiểm Tra"}
            </button>
           )}
        </div>
      </div>
      
      {/* Helper Text */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
        <strong>Lưu ý:</strong> Hệ thống sẽ tự động sinh 16 câu trắc nghiệm và 2 câu dạng nối/điền từ dựa trên thông tin cấu hình và file upload.
      </div>
    </div>
  );
};

export default ExamGenerator;
