'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, setDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Menu, X, ChevronRight, ChevronLeft, BookOpen, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// --- Types ---
interface Lesson {
  id: string;
  title: string;
  order: number;
  content: string;
}

// --- Seed Data ---
const SEED_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    title: "บทที่ 1: ปูพื้นฐาน Grammar ไม่ต้องท่องจำ",
    order: 1,
    content: `
# ยินดีต้อนรับสู่บทแรกของการติว ก.พ. ภาษาอังกฤษครับน้องๆ!

บทนี้พี่จะพาทุกคนมาปูพื้นฐานเรื่องโครงสร้างประโยคกันใหม่แบบง่ายๆ ถอดสมองอ่านได้เลย

<div class="tip-box">
  <div class="tip-header">💡 ทริคเด็ด: Subject + Verb</div>
  <p>จำไว้เสมอว่า <strong>"ประโยคภาษาอังกฤษทุกประโยค ต้องมี ประธาน (Subject) และ กริยา (Verb) เสมอ!"</strong> ถ้าขาดตัวใดตัวหนึ่งไป มันจะไม่ใช่ประโยคครับ</p>
</div>

<div class="warning-box">
  <div class="warning-header">🚨 จุดควรระวัง!</div>
  <p>หลายคนชอบโดนหลอกด้วย "ส่วนขยาย" (Modifier) ยาวๆ ทำให้หา Verb แท้ไม่เจอ วิธีแก้คือเริ่มจากหา <strong>Verb แท้ก่อนเสมอ</strong> แล้วข้างหน้า Verb มักจะเป็น Subject</p>
</div>

มาลองดูตัวอย่างประกอบกัน:
- **The boy** (in the yellow shirt) **is** my brother.
- ในที่นี้ *in the yellow shirt* เป็นแค่ส่วนขยาย ส่วน **is** คือ Verb แท้

<details class="accordion-box">
  <summary>สรุป 12 Tenses ฉบับใช้งานจริง (คลิกเพื่อเปิดอ่าน)</summary>
  <div class="accordion-content">
    จริงๆแล้ว ก.พ. ไม่ได้ออกครบ 12 Tense หรอกครับ ที่ออกบ่อยๆ มีแค่:
    <br/><br/>
    1. <strong>Present Simple</strong> (บอกความจริง นิสัย)<br/>
    2. <strong>Past Simple</strong> (จบไปแล้ว มีเวลาในอดีตกำกับ)<br/>
    3. <strong>Present Perfect</strong> (อดีตส่งผลถึงปัจจุบัน)<br/>
    4. <strong>Future Simple</strong> (อนาคต)<br/><br/>
    แค่นี้พอเลยครับ! ไม่ต้องซีเรียส ท่องไปเผื่อหัวบวมเปล่าๆ
  </div>
</details>

เดี๋ยวในบทถัดไปเราจะไปเจาะเรื่องคำศัพท์ที่ต้องรู้กัน!
    `
  },
  {
    id: "lesson-2",
    title: "บทที่ 2: ศัพท์ 500 คำ ที่เจอบ่อยในห้องสอบ",
    order: 2,
    content: `
# มาลุยกันต่อที่พาร์ทคำศัพท์ (Vocabulary) กันเลย! 

หลายคนบอกว่า "ถ้าแปลไม่ออก ก็ทำไม่ได้" อันนี้จริงครึ่งเดียวครับ เพราะพี่มีวิธีเดาความหมายจากบริบท (Context Clues) และจากรากศัพท์ (Roots/Affixes) มาฝาก

<div class="tip-box">
  <div class="tip-header">💡 เดาศัพท์จาก Prefix</div>
  <ul>
    <li><strong>un-, in-, im-, dis-</strong> แปลว่า "ไม่" (เช่น unhappy = ไม่มีความสุข)</li>
    <li><strong>re-</strong> แปลว่า "ทำอีกครั้ง" (เช่น rewrite = เขียนใหม่)</li>
    <li><strong>pre-</strong> แปลว่า "ก่อน" (เช่น predict = ทำนาย)</li>
  </ul>
</div>

<div class="warning-box">
  <div class="warning-header">🚨 อย่าแปลตรงตัวทุกคำ</div>
  <p>สำนวน (Idiom) บางคำแปลตรงตัวไม่ได้เลย เช่น <strong>"piece of cake"</strong> ไม่ได้แปลว่าชิ้นเค้ก แต่แปลว่า "ง่ายมากๆ ปอกกล้วยเข้าปาก" ต้องระวังดีๆ!</p>
</div>

ลองฝึกมองหา Prefix และ Suffix ทุกครั้งที่เจอคำศัพท์ใหม่ๆ นะครับ! การเดาศัพท์จะช่วยลดการท่องจำได้เกิน 50% เลยทีเดียว
    `
  }
];

export default function CourseContentPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auth Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = localStorage.getItem('accessCode');
      if (!code) {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  // Fetch / Seed Lessons
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchLessons = async () => {
      try {
        const q = query(collection(db, 'lessons'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        
        let loadedLessons: Lesson[] = [];
        querySnapshot.forEach((docSnap) => {
          loadedLessons.push({ id: docSnap.id, ...docSnap.data() } as Lesson);
        });

        // Seed data if DB is empty
        if (loadedLessons.length === 0) {
          console.log("Seeding lessons data...");
          for (const item of SEED_LESSONS) {
            await setDoc(doc(db, 'lessons', item.id), {
              title: item.title,
              order: item.order,
              content: item.content
            });
          }
          loadedLessons = SEED_LESSONS.sort((a, b) => a.order - b.order);
        }

        setLessons(loadedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [isAuthorized]);

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">กำลังโหลดเนื้อหาบทเรียน...</p>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const hasNext = currentLessonIndex < lessons.length - 1;
  const hasPrev = currentLessonIndex > 0;

  const handleLogout = () => {
    localStorage.removeItem('accessCode');
    router.push('/');
  };

  const selectLesson = (index: number) => {
    setCurrentLessonIndex(index);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] font-sans text-gray-800 flex flex-col md:flex-row selection:bg-orange-200">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 font-bold text-lg text-blue-800">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <span>PASS<span className="text-orange-500">KORPOR</span></span>
        </div>
        <button className="p-2 text-gray-600 focus:outline-none" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="w-3/4 max-w-sm h-full bg-white shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="font-bold text-gray-900">รายการบทเรียน</div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {lessons.map((lesson, idx) => (
                  <button 
                    key={lesson.id}
                    onClick={() => selectLesson(idx)}
                    className={idx === currentLessonIndex ? 'w-full text-left px-6 py-3 transition-colors bg-orange-50 border-r-4 border-orange-500 text-orange-800 font-bold' : 'w-full text-left px-6 py-3 transition-colors text-gray-600 hover:bg-gray-50 font-medium'}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 w-full px-4 py-2 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 flex-col bg-white border-r border-gray-200 h-screen sticky top-0 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2 font-bold text-xl text-blue-800">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <span>PASS<span className="text-orange-500">KORPOR</span></span>
        </div>
        <div className="p-6 pb-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
          รายการบทเรียน
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {lessons.map((lesson, idx) => (
            <button 
              key={lesson.id}
              onClick={() => selectLesson(idx)}
              className={idx === currentLessonIndex ? 'w-full text-left px-6 py-3 transition-colors bg-orange-50 border-r-4 border-orange-500 text-orange-800 font-bold' : 'w-full text-left px-6 py-3 transition-colors text-gray-600 hover:bg-gray-50'}
            >
              {lesson.title}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100 content-end">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle className="w-10 h-10 text-gray-300" />
            <div>
              <div className="text-sm font-bold text-gray-900">นักเรียน ก.พ.</div>
              <div className="text-xs text-green-600 font-medium">Verified Access</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 w-full px-4 py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200">
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12">
          {currentLesson ? (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-orange-100/50 mb-8">
                <div className="markdown-body">
                  <ReactMarkdown 
                    rehypePlugins={[rehypeRaw]} 
                    remarkPlugins={[remarkGfm]}
                  >
                    {currentLesson.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between border-t border-orange-200/50 pt-8 mt-12 pb-12">
                {hasPrev ? (
                  <button 
                    onClick={() => selectLesson(currentLessonIndex - 1)}
                    className="flex items-center gap-2 text-orange-600 font-bold hover:bg-orange-50 px-5 py-3 rounded-2xl transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    บทก่อนหน้า
                  </button>
                ) : <div />}

                {hasNext ? (
                  <button 
                    onClick={() => selectLesson(currentLessonIndex + 1)}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-orange-500/20 transition-transform active:scale-95"
                  >
                    บทถัดไป
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    className="flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-green-500/20 cursor-default"
                  >
                    จบหลักสูตร 🎉
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              ไม่พบเนื้อหาบทเรียน
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
