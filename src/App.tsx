import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Home, 
  Layout, 
  Play, 
  Settings, 
  Trophy, 
  User, 
  Volume2, 
  ArrowLeft,
  Calendar,
  Flame,
  Target,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { roadmapData } from './data';
import { DayPlan, Lesson, Screen, ChatMessage } from './types';

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className="bg-blue-600 h-full rounded-full"
    />
  </div>
);

const Badge = ({ children, variant = 'primary' }: { children: React.ReactNode, variant?: 'primary' | 'success' | 'warning' }) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${variants[variant]}`}>
      {children}
    </span>
  );
};

// --- Screens ---

const Onboarding = ({ onComplete }: { onComplete: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-200"
    >
      <BookOpen className="w-12 h-12 text-white" />
    </motion.div>
    <h1 className="text-3xl font-bold text-slate-900 mb-4">WorkEnglish 90</h1>
    <p className="text-slate-500 mb-12 leading-relaxed">
      Lộ trình 90 ngày giúp nhân viên văn phòng tự tin giao tiếp tiếng Anh công sở.
    </p>
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-left">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">90 Ngày Lộ Trình</h3>
          <p className="text-xs text-slate-500">Mỗi ngày một chủ đề công việc thực tế</p>
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 text-left">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Bài Học Ngắn</h3>
          <p className="text-xs text-slate-500">Chỉ 30 phút mỗi ngày, học mọi lúc mọi nơi</p>
        </div>
      </div>
    </div>
    <button 
      onClick={onComplete}
      className="mt-12 w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform"
    >
      Bắt đầu ngay
    </button>
  </div>
);

const Dashboard = ({ 
  data, 
  onSelectLesson 
}: { 
  data: DayPlan[], 
  onSelectLesson: (lesson: Lesson, day: number) => void 
}) => {
  const currentDay = data.find(d => !d.completed) || data[0];
  const completedDays = data.filter(d => d.completed).length;
  const progress = (completedDays / 90) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white p-6 pb-8 rounded-b-[32px] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-slate-400 text-sm font-medium">Chào buổi sáng,</h2>
            <h1 className="text-2xl font-bold text-slate-900">Minh 👋</h1>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-amber-700 font-bold text-sm">7</span>
          </div>
        </div>

        <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-blue-100 text-xs font-medium uppercase tracking-wider">Tiến độ 90 ngày</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-blue-400/30 rounded-full h-2 mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-white h-full rounded-full"
            />
          </div>
          <p className="text-sm text-blue-50">Bạn đã hoàn thành {completedDays}/90 ngày học!</p>
        </div>
      </div>

      {/* Today's Lesson */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Bài học hôm nay</h3>
          <span className="text-blue-600 text-sm font-semibold">Ngày {currentDay.day}</span>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6">
          <h4 className="font-bold text-slate-900 mb-4">{currentDay.title}</h4>
          <div className="space-y-3">
            {currentDay.lessons.map((lesson) => (
              <button 
                key={lesson.id}
                onClick={() => onSelectLesson(lesson, currentDay.day)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lesson.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : <Play className="w-5 h-5 fill-blue-600" />}
                  </div>
                  <div className="text-left">
                    <h5 className="text-sm font-semibold text-slate-800">{lesson.title}</h5>
                    <div className="flex items-center gap-2">
                      <Badge variant={lesson.type === 'vocabulary' ? 'primary' : 'warning'}>{lesson.type}</Badge>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Roadmap Preview */}
        <h3 className="text-lg font-bold text-slate-800 mb-4">Lộ trình tiếp theo</h3>
        <div className="space-y-3">
          {data.slice(currentDay.day, currentDay.day + 3).map((day) => (
            <div key={day.day} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 opacity-60">
              <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 font-bold shrink-0">
                {day.day}
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 text-sm">{day.title}</h4>
                <p className="text-xs text-slate-400">Chưa mở khóa</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LessonScreen = ({ 
  lesson, 
  day, 
  onBack, 
  onComplete 
}: { 
  lesson: Lesson, 
  day: number, 
  onBack: () => void, 
  onComplete: () => void 
}) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFinish = () => {
    onComplete();
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-bottom border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Ngày {day}</p>
          <h2 className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{lesson.title}</h2>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <ProgressBar progress={((step + 1) / 3) * 100} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {lesson.type === 'vocabulary' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Từ vựng cần nhớ</h3>
            {lesson.content.vocabulary?.map((item, i) => (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-blue-600">{item.word}</h4>
                  <button className="p-2 bg-white rounded-full shadow-sm">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-800 font-medium mb-2">{item.meaning}</p>
                <p className="text-sm text-slate-500 italic">"{item.example}"</p>
              </motion.div>
            ))}
          </div>
        )}

        {lesson.type === 'listening' && (
          <div className="space-y-8">
            <div className="aspect-square w-full bg-blue-50 rounded-[40px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full border-[20px] border-blue-600 rounded-full scale-150 animate-pulse" />
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-200 active:scale-90 transition-transform z-10"
              >
                {isPlaying ? <div className="w-8 h-8 flex gap-2"><div className="w-2 h-full bg-white rounded-full" /><div className="w-2 h-full bg-white rounded-full" /></div> : <Play className="w-10 h-10 text-white fill-white ml-2" />}
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Transcript</h3>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-800 leading-relaxed mb-4">{lesson.content.transcript}</p>
                <div className="h-px bg-slate-200 mb-4" />
                <p className="text-slate-500 text-sm italic">{lesson.content.translation}</p>
              </div>
            </div>
          </div>
        )}

        {lesson.type === 'conversation' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Hội thoại thực tế</h3>
            <div className="space-y-4">
              {lesson.content.dialogue?.map((item, i) => (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  key={i} 
                  className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] font-bold text-slate-400 mb-1 px-2">{item.speaker}</span>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    i % 2 === 0 
                      ? 'bg-blue-600 text-white rounded-tl-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tr-none'
                  }`}>
                    <p className="text-sm font-medium mb-1">{item.text}</p>
                    <p className={`text-[10px] opacity-70 ${i % 2 === 0 ? 'text-blue-50' : 'text-slate-500'}`}>
                      {item.translation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-6">
        <button 
          onClick={handleFinish}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          Hoàn thành bài học
        </button>
      </div>
    </div>
  );
};

const ProgressTracker = ({ data }: { data: DayPlan[] }) => {
  const completedDays = data.filter(d => d.completed).length;
  
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">
      <div className="p-6 bg-white rounded-b-[32px] shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Tiến độ của bạn</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-blue-600">{completedDays}</h4>
            <p className="text-xs text-blue-500 font-medium">Ngày hoàn thành</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-emerald-600">7</h4>
            <p className="text-xs text-emerald-500 font-medium">Chuỗi streak</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Hành trình 90 ngày</h3>
        <div className="grid grid-cols-5 gap-3">
          {data.map((day) => (
            <div 
              key={day.day}
              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                day.completed 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                  : day.day === data.find(d => !d.completed)?.day
                    ? 'bg-white text-blue-600 border-blue-600 ring-2 ring-blue-100'
                    : 'bg-white text-slate-300 border-slate-100'
              }`}
            >
              {day.completed ? <CheckCircle className="w-4 h-4" /> : day.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Profile = ({ onOpenChat }: { onOpenChat: () => void }) => (
  <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">
    <div className="p-8 bg-white rounded-b-[32px] shadow-sm text-center mb-6">
      <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
        <img 
          src="https://picsum.photos/seed/user/200/200" 
          alt="Avatar" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Minh Nguyễn</h2>
      <p className="text-slate-500 text-sm mb-4">Marketing Specialist</p>
      <Badge variant="primary">Level 1: Beginner</Badge>
    </div>

    <div className="px-6 space-y-4">
      <button 
        onClick={onOpenChat}
        className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">Chat với trợ lý AI</span>
        </div>
        <ChevronRight className="w-5 h-5 text-white/50" />
      </button>

      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <span className="font-semibold text-slate-700">Thông tin cá nhân</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-500" />
            </div>
            <span className="font-semibold text-slate-700">Cài đặt</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-slate-500" />
            </div>
            <span className="font-semibold text-slate-700">Thành tích</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>
      
      <button className="w-full py-4 text-rose-500 font-bold bg-white rounded-2xl border border-rose-100 shadow-sm active:scale-95 transition-transform">
        Đăng xuất
      </button>
    </div>
  </div>
);

const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Xin chào! Tôi là trợ lý WorkEnglish 90. Tôi có thể giúp gì cho bạn trong việc học tiếng Anh công sở hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: "Bạn là một trợ lý học tiếng Anh chuyên nghiệp tên là WorkEnglish Assistant. Nhiệm vụ của bạn là giúp nhân viên văn phòng mất gốc tiếng Anh luyện tập giao tiếp trong môi trường công sở. Hãy trả lời ngắn gọn, thân thiện, sử dụng cả tiếng Anh và tiếng Việt để giải thích. Luôn khuyến khích người dùng thực hành các tình huống như họp hành, viết email, chào hỏi khách hàng.",
        },
      });

      // We need to pass the history to sendMessage if we want to maintain context, 
      // but the SDK's sendMessage only takes a string. 
      // For a real chat, we should use the history in chats.create.
      // However, for this MVP, we'll just send the message.
      const response = await chat.sendMessage({ message: userMessage });
      const aiText = response.text;

      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Xin lỗi, tôi đang gặp chút trục trặc kỹ thuật. Bạn vui lòng thử lại sau nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Trợ lý WorkEnglish</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đang trực tuyến</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100 pb-28">
        <div className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [data, setData] = useState<DayPlan[]>(roadmapData);
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: Lesson, day: number } | null>(null);

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;

    const newData = data.map(day => {
      if (day.day === selectedLesson.day) {
        const newLessons = day.lessons.map(l => 
          l.id === selectedLesson.lesson.id ? { ...l, completed: true } : l
        );
        const allCompleted = newLessons.every(l => l.completed);
        return { ...day, lessons: newLessons, completed: allCompleted };
      }
      return day;
    });

    setData(newData);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setScreen('dashboard')} />;
      case 'dashboard':
        return (
          <Dashboard 
            data={data} 
            onSelectLesson={(lesson, day) => {
              setSelectedLesson({ lesson, day });
              setScreen('lesson');
            }} 
          />
        );
      case 'lesson':
        return selectedLesson ? (
          <LessonScreen 
            lesson={selectedLesson.lesson} 
            day={selectedLesson.day}
            onBack={() => setScreen('dashboard')}
            onComplete={handleCompleteLesson}
          />
        ) : null;
      case 'progress':
        return <ProgressTracker data={data} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <Profile onOpenChat={() => setScreen('chat')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[844px] bg-white sm:rounded-[48px] overflow-hidden shadow-2xl relative border-[8px] border-slate-800">
        
        {/* Screen Content */}
        <div className="h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {screen !== 'onboarding' && screen !== 'lesson' && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-4 pb-8 flex justify-between items-center z-50"
          >
            <button 
              onClick={() => setScreen('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${screen === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Home className={`w-6 h-6 ${screen === 'dashboard' ? 'fill-blue-600/10' : ''}`} />
              <span className="text-[10px] font-bold">Học tập</span>
            </button>
            <button 
              onClick={() => setScreen('progress')}
              className={`flex flex-col items-center gap-1 transition-colors ${screen === 'progress' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Layout className={`w-6 h-6 ${screen === 'progress' ? 'fill-blue-600/10' : ''}`} />
              <span className="text-[10px] font-bold">Tiến độ</span>
            </button>
            <button 
              onClick={() => setScreen('chat')}
              className={`flex flex-col items-center gap-1 transition-colors ${screen === 'chat' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <MessageSquare className={`w-6 h-6 ${screen === 'chat' ? 'fill-blue-600/10' : ''}`} />
              <span className="text-[10px] font-bold">Trợ lý AI</span>
            </button>
            <button 
              onClick={() => setScreen('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${screen === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <User className={`w-6 h-6 ${screen === 'profile' ? 'fill-blue-600/10' : ''}`} />
              <span className="text-[10px] font-bold">Cá nhân</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
