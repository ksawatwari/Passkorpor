'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  BookOpen, 
  Target, 
  PlayCircle,
  Menu,
  X,
  Lock,
  Unlock,
  QrCode,
  Star
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Components ---

function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState(3600 * 24 * 7);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-red-600 text-white text-center py-2 px-4 shadow-sm z-50 relative sticky top-0 font-medium text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-all">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 animate-pulse" />
        <span>ราคาโปรโมชั่นลด 50% เหลือเวลาอีก</span>
      </div>
      <div className="flex gap-1 items-center bg-red-700/50 px-3 py-1 rounded-md font-bold tracking-wider">
        <span className="w-8 text-center">{hours.toString().padStart(2, '0')}</span>:
        <span className="w-8 text-center">{minutes.toString().padStart(2, '0')}</span>:
        <span className="w-8 text-center">{seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-[auto] sm:top-12 z-40 border-b border-gray-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-800 tracking-tight">
          <BookOpen className="w-7 h-7 text-orange-500" />
          <span>PASS<span className="text-orange-500">KORPOR</span></span>
        </div>

        <nav className="hidden md:flex gap-8 items-center font-medium text-gray-600">
          <button onClick={() => scrollTo('details')} className="hover:text-blue-600 transition-colors">รายละเอียด</button>
          <Link href="/reviews" className="hover:text-blue-600 transition-colors">รีวิว</Link>
          <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition-colors">ติดต่อ</button>
          <button 
            onClick={() => scrollTo('pricing')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-500/30 transition-transform active:scale-95"
          >
            สมัครเลย
          </button>
        </nav>

        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4 font-medium text-gray-600">
              <button onClick={() => scrollTo('details')} className="text-left py-2 border-b border-gray-50">รายละเอียด</button>
              <Link href="/reviews" className="text-left py-2 border-b border-gray-50 block">รีวิว</Link>
              <button onClick={() => scrollTo('contact')} className="text-left py-2 border-b border-gray-50">ติดต่อ</button>
              <button 
                onClick={() => scrollTo('pricing')}
                className="bg-orange-500 text-white py-3 rounded-xl font-bold w-full mt-2"
              >
                สมัครเลย
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-blue-50 to-white rounded-[100%] -z-10 blur-3xl opacity-50"></div>
      
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 border border-blue-200">
            เข้าใจง่าย
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.2] tracking-tight mb-6">
            สอบผ่านภาษาอังกฤษ ก.พ. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ฉบับรวบรัด</span> <br />
            อ่านน้อยแต่สอบผ่านชัวร์!
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            ไม่ต้องท่องจำจนปวดหัว เราคัดมาให้แล้ว ทริคเด็ด สูตรลัด เน้นจุดที่ข้อสอบชอบออก 
            เรียนจบพร้อมใช้สอบได้ทันที!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/20 transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              สมัครเลย
            </button>
            <p className="sm:hidden text-sm text-gray-500 mt-2">*รับประกันความพอใจ</p>
          </div>

          <div className="mt-14 pt-10 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto opacity-80">
            <div>
              <div className="text-xl font-bold text-gray-900 mb-1 mt-1.5">ตรงจุด</div>
              <div className="text-sm text-gray-600">เนื้อหาเน้นจุดออกสอบจริง</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 mb-1 mt-1.5">ครบถ้วน</div>
              <div className="text-sm text-gray-600">สรุปครบ จบในที่เดียว</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 mb-1 mt-1.5">เข้าใจง่าย</div>
              <div className="text-sm text-gray-600">เนื้อหาสรุปกระชับ</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 mb-1 mt-1.5">พร้อมดูแล</div>
              <div className="text-sm text-gray-600">ปรึกษาพี่ติวเตอร์ได้ตลอด<br />(ตอบกลับภายใน 24 ชม.)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PainPoints() {
  const points = [
    { title: "เบื่อไหม? อ่านเท่าไหร่ก็จำไม่ได้", desc: "ท่องศัพท์จนตาแฉะ พอเจอข้อสอบจริงกลับแปลไม่ออก ลืมหมดเกลี้ยง" },
    { title: "โครงสร้างประโยครวนไปหมด", desc: "Subject, Verb, Object ตีกันยุ่งเหยิง ไม่รู้จะเริ่มแปลจากตรงไหน" },
    { title: "ทำข้อสอบไม่ทันเวลา", desc: "มัวแต่งมอยู่ที่ข้อเดิมๆ สุดท้ายต้องดิ่งเดาช้อยส์พลาดคะแนนไปอย่างน่าเสียดาย" }
  ];

  return (
    <section id="details" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">ถ้าคุณกำลังเจอปัญหาเหล่านี้... <br className="sm:hidden"/>คุณมาถูกที่แล้ว!</h2>
          <p className="text-lg text-gray-600">หยุดเสียเวลากับการอ่านแบบผิดวิธี พี่เข้าใจเพราะพี่เคยผ่านมาแล้ว</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {points.map((point, i) => (
            <div 
              key={i}
              className="bg-red-50/50 rounded-3xl p-8 border border-red-100 hover:border-red-200 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold">
                {i+1}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseContent() {
  const contents = [
    { 
      title: "บทที่ 1: ทำความรู้จักอังกฤษ ก.พ.", 
      desc: "พาไปทำความรู้จักกับธรรมชาติของข้อสอบ ปรับมายเซ็ตใหม่ให้ภาษาอังกฤษไม่ใช่เรื่องน่ากลัว",
      details: ["ภาพรวมข้อสอบและสัดส่วนคะแนน", "เจาะลึก 4 พาร์ทที่ต้องเจอ", "เทคนิคการวางแผนเตรียมตัว"]
    },
    { 
      title: "บทที่ 2: พาร์ท Conversation (การสนทนา)", 
      desc: "เจาะลึกการเก็บคะแนนจากบทสนทนา เน้นสถานการณ์ที่ออกสอบบ่อยที่สุด",
      details: ["สำนวนที่ใช้บ่อยในข้อสอบ", "การเลือกตอบให้ตรงบริบท", "คีย์เวิร์ดช่วยตัดช้อยส์ลวง"]
    },
    { 
      title: "บทที่ 3: ปราบมาร Grammar", 
      desc: "ปูพื้นฐานแกรมม่าที่ออกข้อสอบบ่อยที่สุด สอนทริคการจำ Tense แบบไม่ต้องท่อง ตัดช้อยส์ได้ใน 10 วินาที",
      details: ["สรุป 12 Tenses ฉบับย่อ", "If-clause และโครงสร้างประโยคซับซ้อน", "เทคนิคหา Subject-Verb Agreement"]
    },
    { 
      title: "บทที่ 4: ศัพท์ที่ ก.พ. ออกบ่อยที่สุด", 
      desc: "ไม่ตัองท่องศัพท์เป็นพันคำ เราคัดศัพท์ 500 คำที่พบบ่อยในข้อสอบย้อนหลัง 10 ปี พร้อมวิธีจำจากรากศัพท์ (Root Words)",
      details: ["Vocab 500 คำต้องรู้", "Prefix & Suffix ช่วยเดาความหมาย", "สำนวน (Idioms) ที่ห้ามพลาด"]
    },
    { 
      title: "บทที่ 5: เทคนิคพิชิต Reading", 
      desc: "เคล็ดลับการอ่านจับใจความ หา Main Idea ทันทีโดยไม่ต้องแปลหมดทั้งเล่ม ประหยัดเวลาทำข้อสอบได้ 50%",
      details: ["Skimming & Scanning", "หา Keyword เพื่อตอบคำถาม", "การตีความและสรุปความ"]
    },
    { 
      title: "บทที่ 6: ตะลุยโจทย์จริง (ข้อสอบเก่า)", 
      desc: "พาทำข้อสอบจริงย้อนหลัง อธิบายละเอียดทุกข้อ ชี้จุดหลอกที่คนส่วนใหญ่พลาด",
      details: ["ข้อสอบ Conversation", "ข้อสอบ Grammar & Vocab", "ข้อสอบ Reading Comprehension"]
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">เนื้อหากระชับ ตรงจุด ไม่ออกทะเล</h2>
          <p className="text-lg text-gray-600">เรียนจบสอบได้เลย ไม่ต้องหาอ่านที่ไหนเพิ่ม</p>
        </div>

        <div className="space-y-4">
          {contents.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between bg-white focus:outline-none"
              >
                <div className="flex items-center gap-4 text-left">
                  <PlayCircle className={`w-6 h-6 flex-shrink-0 ${openIndex === i ? 'text-orange-500' : 'text-blue-600'}`} />
                  <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 mt-2">
                      <p className="text-gray-600 mb-4">{item.desc}</p>
                      <ul className="space-y-2">
                        {item.details.map((detail, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentReviews() {
  const predefinedReviews = [
    { id: '1', name: 'K. แบงค์', text: 'ตอนแรกกลัวพาร์ท Grammar มาก แต่พี่สรุปเข้าใจง่ายจริงๆ เรียนจบไวมากครับ', rating: 5 },
    { id: '2', name: 'K. มะลิ', text: 'ราคา 199 บาทแต่เนื้อหาแน่นเกินคาด พาร์ท Conversation ช่วยได้เยอะมาก', rating: 5 },
    { id: '3', name: 'K. อาร์ท', text: 'เหมาะสำหรับคนไม่มีเวลาเตรียมตัวแบบเรา สรุปมาให้แต่เน้นๆ ตรงจุด', rating: 5 },
    { id: '4', name: 'K. ส้ม', text: 'โอนปุ๊บได้รหัสเข้าเรียนทันที ระบบอัตโนมัติสะดวกมาก ไม่ต้องรอแอดมินเลยค่ะ', rating: 5 },
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">รีวิวจากผู้เรียนจริง</h2>
          <p className="text-lg text-gray-600">ความประทับใจจากนักเรียนที่พิชิตข้อสอบ ก.พ. ไปด้วยกัน</p>
        </div>
        
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {predefinedReviews.map((review, idx) => (
            <div key={idx} className="snap-center shrink-0 w-80 md:w-96 bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow font-medium">"{review.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-lg">
                  {review.name.replace('K. ', '')[0] || '?'}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-500">ผู้เข้าร่วมคอร์ส</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Link href="/reviews" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
            ดูรีวิวทั้งหมด <ChevronDown className="w-4 h-4 -rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PricingPayment() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedCode, setAssignedCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp, query, where, limit, getDocs, updateDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      // 1. Save payment details for audit
      await addDoc(collection(db, 'payments'), {
        name,
        phone,
        createdAt: serverTimestamp()
      });

      // 2. Query for an available code
      const q = query(
        collection(db, 'access_codes'),
        where('status', '==', 'unused'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      let newCode = '';

      if (!querySnapshot.empty) {
        const codeDoc = querySnapshot.docs[0];
        newCode = codeDoc.data().code;
        // 3. Mark it as used and link to phone
        await updateDoc(doc(db, 'access_codes', codeDoc.id), {
          status: 'used',
          assignedPhone: phone,
          assignedAt: serverTimestamp()
        });
      } else {
        // Fallback: auto-generate a code if none available in the pool
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
          newCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        await addDoc(collection(db, 'access_codes'), {
          code: newCode,
          status: 'used',
          assignedPhone: phone,
          assignedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        });
      }

      setAssignedCode(newCode);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(assignedCode);
    alert('คัดลอก Access Code แล้ว');
  };

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -left-20 top-20 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>

      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              ลงทุนกับอนาคต <br/>ในราคาสุดคุ้ม!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              คอร์สเต็ม เนื้อหาจัดเต็ม ไม่มีกั๊ก ปกติ 1,990 บาท
            </p>
            
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                ลด 50% รับจำนวนจำกัด
              </div>
              
              <div className="line-through text-blue-300 text-xl mb-1">ราคาปกติ 1,990.-</div>
              <div className="flex items-baseline gap-2 justify-center lg:justify-start mb-6">
                <span className="text-5xl font-extrabold text-orange-400">199</span>
                <span className="text-xl">บาท</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-blue-100 text-left w-fit mx-auto lg:mx-0">
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0"/> <span>อายุสิทธิ์เข้าเรียน ตลอดชีพ</span></li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0"/> <span>ไฟล์ PDF สรุปเนื้อหา + ข้อสอบ</span></li>
                <li className="flex items-center gap-3 text-sm md:text-base"><CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0"/> <span>ปรึกษาพี่ติวเตอร์ได้ตลอด (ตอบกลับภายใน 24 ชม.)</span></li>
              </ul>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">ชำระเงิน / แจ้งโอน</h3>
            
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">ได้รับข้อมูลและมอบอัปเกรดสำเร็จ!</h4>
                <p className="text-gray-600 mb-6 text-sm">นี่คือ Access Code ของคุณ สามารถใช้เข้าสู่ระบบได้ทันที</p>
                
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6">
                  <span className="block text-sm text-orange-600 font-bold mb-2">Access Code ของคุณ</span>
                  <div className="text-3xl font-mono tracking-widest font-extrabold text-gray-900">{assignedCode}</div>
                </div>

                <div className="space-y-3">
                  <button onClick={copyCode} className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                    คัดลอก Access Code
                  </button>
                  <button onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('accessCode', assignedCode);
                      window.location.href = '/course-content';
                    }
                  }} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-transform active:scale-95">
                    เข้าเรียนเลยทันที
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-300 transition-colors cursor-pointer group">
                  <QrCode className="w-16 h-16 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="font-medium text-sm">สแกน QR Code เพื่อชำระเงิน 199 บาท</p>
                  <p className="text-xs mt-1">(พร้อมเพย์ / PromptPay)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ - นามสกุล</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="ป้อนชื่อของคุณ"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ (ใช้เป็นข้อมูลอ้างอิง)</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="08X-XXX-XXXX"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หลักฐานการโอนเงิน</label>
                    <input type="file" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95">
                  {submitting ? 'กำลังตรวจสอบและออก Code...' : 'ยื่นหลักฐานรับ Code อัตโนมัติ'}
                 </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function UnlockAccess() {
  const [mode, setMode] = useState<'login' | 'check'>('login');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrievedCode, setRetrievedCode] = useState('');
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      setLoading(true);
      try {
        const { collection, query, where, getDocs, updateDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        
        const q = query(
          collection(db, 'access_codes'), 
          where('code', '==', code.toUpperCase())
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          // Mark code as used if it's unused
          if (docSnap.data().status === 'unused') {
            await updateDoc(doc(db, 'access_codes', docSnap.id), {
              status: 'used'
            });
          }
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessCode', code.toUpperCase());
          }
          router.push('/course-content');
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 9) {
      setLoading(true);
      setError(false);
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        
        const q = query(
          collection(db, 'access_codes'), 
          where('assignedPhone', '==', phone)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Sort by latest if multiple, but just grabbing the first one is usually fine
          const docSnap = querySnapshot.docs[querySnapshot.docs.length - 1]; // get latest or first
          setRetrievedCode(docSnap.data().code);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  return (
    <section className="py-20 bg-gray-900 text-white text-center">
      <div className="max-w-2xl mx-auto px-4">
        <Lock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4 sm:mb-6" />
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">เข้าสู่ระบบ / ตรวจสอบ Access Code</h2>
        
        <div className="flex justify-center gap-4 mb-6 sm:mb-8">
          <button 
            onClick={() => { setMode('login'); setError(false); setRetrievedCode(''); }}
            className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition-colors ${mode === 'login' ? 'border-orange-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            มี Access Code แล้ว
          </button>
          <button 
            onClick={() => { setMode('check'); setError(false); setRetrievedCode(''); }}
            className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition-colors ${mode === 'check' ? 'border-orange-500 text-white' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            ลืมรหัส / ตรวจสอบรหัส
          </button>
        </div>

        {mode === 'login' && (
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3 sm:gap-4" onSubmit={handleUnlock}>
             <div className="flex-1 text-left relative">
              <input 
                type="text" 
                placeholder="รหัส 6 หลัก..." 
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(false);
                }}
                className={`w-full px-4 py-3 sm:px-6 sm:py-4 bg-white/10 rounded-xl text-center sm:text-left text-white placeholder-gray-400 text-base sm:text-lg font-[family-name:var(--font-anuphan)] focus:ring-4 outline-none transition-colors ${error ? 'border-2 border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white/20'}`}
               />
              {error && <p className="text-red-400 text-sm mt-2 absolute w-full">รหัสไม่ถูกต้อง หรือถูกใช้งานไปแล้ว</p>}
            </div>
            <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-500/20">
              <Unlock className="w-5 h-5" />
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าเรียนเลย'}
            </button>
          </form>
        )}

        {mode === 'check' && (
          <div className="max-w-md mx-auto">
            {retrievedCode ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <p className="text-gray-300 mb-2">Access Code ของคุณคือ</p>
                <div className="text-4xl font-mono tracking-widest font-extrabold text-orange-400 mb-6">{retrievedCode}</div>
                <button 
                  onClick={() => {
                    setCode(retrievedCode);
                    setMode('login');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full"
                >
                  ใช้รหัสนี้เข้าสู่ระบบ
                </button>
              </motion.div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-4" onSubmit={handleCheckCode}>
                <div className="flex-1 text-left relative">
                  <input 
                    type="tel" 
                    placeholder="เบอร์โทรศัพท์ที่ใช้แจ้งโอน..." 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError(false);
                    }}
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 bg-white/10 rounded-xl text-center sm:text-left text-white placeholder-gray-400 text-base sm:text-lg font-[family-name:var(--font-anuphan)] focus:ring-4 outline-none transition-colors ${error ? 'border-2 border-red-500 focus:ring-red-500' : 'border border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 focus:bg-white/20'}`}
                   />
                  {error && <p className="text-red-400 text-sm mt-2 absolute w-full">ไม่พบข้อมูล หรือเบอร์โทรไม่ถูกต้อง</p>}
                </div>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95">
                  {loading ? 'กำลังค้นหา...' : 'ค้นหารหัส'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100 py-12 text-center text-gray-500 text-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 font-bold text-xl text-blue-800 tracking-tight mb-4">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <span>PASS<span className="text-orange-500">KORPOR</span></span>
        </div>
        <p className="mb-4">สงวนลิขสิทธิ์ © 2569 PassKorpor.com ทุกประการ</p>
        <div className="space-x-4">
          <a href="#" className="hover:text-blue-600">นโยบายความเป็นส่วนตัว</a>
          <a href="#" className="hover:text-blue-600">ข้อกำหนดและเงื่อนไข</a>
          <a href="#" className="hover:text-blue-600">ติดต่อแอดมิน (Line: @passkorpor)</a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-200">
      <UrgencyBar />
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <CourseContent />
        <StudentReviews />
        <PricingPayment />
        <UnlockAccess />
      </main>
      <Footer />
    </div>
  );
}
