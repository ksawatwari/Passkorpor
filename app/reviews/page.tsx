'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: any;
}

const predefinedReviews = [
  { id: '1', name: 'K. แบงค์', text: 'ตอนแรกกลัวพาร์ท Grammar มาก แต่พี่สรุปเข้าใจง่ายจริงๆ เรียนจบไวมากครับ', rating: 5 },
  { id: '2', name: 'K. มะลิ', text: 'ราคา 199 บาทแต่เนื้อหาแน่นเกินคาด พาร์ท Conversation ช่วยได้เยอะมาก', rating: 5 },
  { id: '3', name: 'K. อาร์ท', text: 'เหมาะสำหรับคนไม่มีเวลาเตรียมตัวแบบเรา สรุปมาให้แต่เน้นๆ ตรงจุด', rating: 4.5 },
  { id: '4', name: 'K. ส้ม', text: 'โอนปุ๊บได้รหัสเข้าเรียนทันที ระบบอัตโนมัติสะดวกมาก ไม่ต้องรอแอดมินเลยค่ะ', rating: 5 },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(predefinedReviews as any[]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        if (fetchedReviews.length > 0) {
          // Merge with predefined if we want or just show fetched
          setReviews([...fetchedReviews, ...predefinedReviews as any[]]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'reviews'), {
        name,
        rating,
        text,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setName('');
      setText('');
      setRating(5);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการส่งรีวิว โปรดลองอีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">กลับไปหน้าหลัก</span>
          </Link>
          <div className="font-bold text-xl text-blue-800 tracking-tight">
            PASS<span className="text-orange-500">KORPOR</span>
          </div>
          <div className="w-24"></div> {/* spacer */}
        </div>
      </header>

      <main className="flex-grow py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">รีวิวจากผู้เรียนจริง</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            เสียงตอบรับจากนักเรียนที่พิชิตข้อสอบ ก.พ. ไปด้วยกัน
          </p>
        </div>

        {/* Write Review Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-blue-900/5 border border-blue-50 mb-16">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">เขียนรีวิวของคุณ</h2>
          </div>
          
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-bold mb-2">ขอบคุณสำหรับรีวิว!</h3>
              <p>รีวิวของคุณถูกส่งเรียบร้อยแล้ว และจะแสดงผลหลังจากผู้ดูแลระบบตรวจสอบ</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-green-600 font-bold underline hover:text-green-800">
                เขียนรีวิวอีกครั้ง
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">คะแนน (ดาว)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-transform hover:scale-110 p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">ชื่อของคุณ</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น K. แบงค์"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">ความประทับใจ</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="เล่าประสบการณ์ หรือความประทับใจจากการเรียน..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งรีวิว'}
              </button>
            </form>
          )}
        </div>

        {/* Display Reviews */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={review.id}
              className="bg-white p-4 sm:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-3 sm:mb-4 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  if (i < Math.floor(review.rating)) {
                    return <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />;
                  } else if (i < review.rating) {
                    // Half star representation (simplified to filled with opacity)
                    return <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current opacity-50" />;
                  }
                  return <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200" />;
                })}
              </div>
              <p className="text-gray-700 text-sm md:text-xl leading-relaxed mb-4 sm:mb-6 flex-grow font-medium">"{review.text}"</p>
              <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
                  {review.name.replace('K. ', '')[0] || '?'}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm sm:text-base truncate">{review.name}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 truncate">ผู้เข้าร่วมคอร์ส</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
