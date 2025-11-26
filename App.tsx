import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageStudio from './components/ImageStudio';
import ExamGenerator from './components/ExamGenerator';
import OnlineExam from './components/OnlineExam';
import { AppSection, ExamData } from './types';
import { School, Sparkles, UserCheck } from 'lucide-react';

// Dummy exam data for direct access demo
const DUMMY_EXAM: ExamData = {
  title: "Đề Thi Demo Tin Học Lớp 3",
  durationMinutes: 35,
  questions: [
    {
      id: 1, type: "MULTIPLE_CHOICE", text: "Máy tính gồm mấy bộ phận chính?", 
      options: ["2 bộ phận", "3 bộ phận", "4 bộ phận", "5 bộ phận"], 
      correctAnswerIndex: 2 
    } as any,
    {
      id: 2, type: "MULTIPLE_CHOICE", text: "Phím Enter dùng để làm gì?", 
      options: ["Xóa ký tự", "Xuống dòng", "Cách một khoảng", "Viết hoa"], 
      correctAnswerIndex: 1 
    } as any
  ]
};

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);
  const [activeExam, setActiveExam] = useState<ExamData | null>(null);

  const startExam = (exam: ExamData) => {
    setActiveExam(exam);
    setCurrentSection(AppSection.ONLINE_TEST);
  };

  const renderContent = () => {
    switch (currentSection) {
      case AppSection.IMAGE_STUDIO:
        return <ImageStudio />;
      case AppSection.EXAM_GENERATOR:
        return <ExamGenerator onStartExam={startExam} />;
      case AppSection.ONLINE_TEST:
        return <OnlineExam examData={activeExam || DUMMY_EXAM} onExit={() => setCurrentSection(AppSection.HOME)} />;
      case AppSection.HOME:
      default:
        return (
          <div className="max-w-5xl mx-auto p-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl mb-12">
               <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
               <div className="relative z-10">
                 <h1 className="text-4xl font-bold mb-4">Chào mừng đến với EduHub</h1>
                 <h2 className="text-2xl font-light mb-8 opacity-90">Trường TH&THCS Nà Sáy</h2>
                 <p className="max-w-xl text-blue-100 text-lg leading-relaxed">
                   Nền tảng học tập thông minh tích hợp trí tuệ nhân tạo Gemini 2.5. 
                   Hỗ trợ tạo đề thi tự động, thi trực tuyến và sáng tạo hình ảnh nghề nghiệp cho học sinh.
                 </p>
                 <button 
                   onClick={() => setCurrentSection(AppSection.EXAM_GENERATOR)}
                   className="mt-8 px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg"
                 >
                   Bắt đầu ngay
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                onClick={() => setCurrentSection(AppSection.IMAGE_STUDIO)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Studio Nghề Nghiệp</h3>
                <p className="text-slate-500">Ghép ảnh học sinh vào các ngành nghề ước mơ như Công an, Bác sĩ, Giáo viên bằng AI.</p>
              </div>

              <div 
                onClick={() => setCurrentSection(AppSection.EXAM_GENERATOR)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ngân Hàng Đề Thi</h3>
                <p className="text-slate-500">Tự động sinh đề kiểm tra từ ma trận kiến thức cho các khối lớp 3, 4, 5.</p>
              </div>

              <div 
                onClick={() => setCurrentSection(AppSection.ONLINE_TEST)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Thi Trực Tuyến</h3>
                <p className="text-slate-500">Hệ thống thi online 35 phút với bộ đếm giờ và chấm điểm tự động ngay lập tức.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentSection={currentSection} onNavigate={setCurrentSection} />
      <main className="ml-64 flex-1 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
