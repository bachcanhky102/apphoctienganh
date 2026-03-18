import { DayPlan } from './types';

export const roadmapData: DayPlan[] = [
  {
    day: 1,
    title: "Greeting Clients & Colleagues",
    completed: false,
    lessons: [
      {
        id: "d1-l1",
        title: "Essential Greetings",
        type: "vocabulary",
        duration: "5 min",
        completed: false,
        content: {
          vocabulary: [
            { word: "Good morning", meaning: "Chào buổi sáng", example: "Good morning, everyone." },
            { word: "Nice to meet you", meaning: "Rất vui được gặp bạn", example: "Nice to meet you, Mr. Smith." },
            { word: "How are you?", meaning: "Bạn khỏe không?", example: "How are you doing today?" },
          ]
        }
      },
      {
        id: "d1-l2",
        title: "Listening: First Meeting",
        type: "listening",
        duration: "8 min",
        completed: false,
        content: {
          transcript: "A: Hello, I'm Minh from Marketing. B: Hi Minh, I'm Sarah. Nice to meet you.",
          translation: "A: Xin chào, tôi là Minh từ phòng Marketing. B: Chào Minh, tôi là Sarah. Rất vui được gặp bạn.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }
      },
      {
        id: "d1-l3",
        title: "Speaking: Self-Introduction",
        type: "speaking",
        duration: "10 min",
        completed: false,
        content: {
          transcript: "Hello, my name is Minh. I work as a Sales Executive at ABC Company.",
          translation: "Xin chào, tên tôi là Minh. Tôi làm việc ở vị trí Nhân viên kinh doanh tại công ty ABC."
        }
      }
    ]
  },
  {
    day: 2,
    title: "Simple Work Exchange",
    completed: false,
    lessons: [
      {
        id: "d2-l1",
        title: "Office Supplies & Tasks",
        type: "vocabulary",
        duration: "6 min",
        completed: false,
        content: {
          vocabulary: [
            { word: "Report", meaning: "Báo cáo", example: "I need the monthly report by Friday." },
            { word: "Meeting", meaning: "Cuộc họp", example: "We have a meeting at 2 PM." },
            { word: "Deadline", meaning: "Hạn chót", example: "The deadline is approaching." },
          ]
        }
      },
      {
        id: "d2-l2",
        title: "Conversation: Asking for Help",
        type: "conversation",
        duration: "12 min",
        completed: false,
        content: {
          dialogue: [
            { speaker: "Minh", text: "Excuse me, Sarah. Could you help me with this report?", translation: "Xin lỗi Sarah. Bạn có thể giúp tôi làm báo cáo này không?" },
            { speaker: "Sarah", text: "Sure, Minh. What do you need?", translation: "Chắc chắn rồi Minh. Bạn cần gì?" },
            { speaker: "Minh", text: "I'm not sure how to format this table.", translation: "Tôi không chắc cách định dạng bảng này." }
          ]
        }
      }
    ]
  },
  // More days would be added here in a real app
];

for (let i = 3; i <= 90; i++) {
  roadmapData.push({
    day: i,
    title: `Day ${i} Topic`,
    completed: false,
    lessons: []
  });
}
