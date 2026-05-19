'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lock, LogOut, Plus, Edit, Trash2, KeyRound, Receipt, BookOpen, Save, X, Search, RotateCcw, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

function ConfirmModal({ isOpen, message, onConfirm, onCancel }: { isOpen: boolean, message: string, onConfirm: () => void, onCancel: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">ยืนยันการดำเนินการ</h3>
        <p className="text-gray-600 mb-6 whitespace-pre-wrap">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">ยกเลิก</button>
          <button onClick={() => { onConfirm(); onCancel(); }} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">ยืนยัน</button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Types ---
interface Lesson {
  id: string;
  title: string;
  order: number;
  content: string;
}

interface AccessCode {
  id: string;
  code: string;
  createdAt: any;
  status: 'unused' | 'used';
  assignedPhone?: string;
}

interface Payment {
  id: string;
  name: string;
  phone: string;
  createdAt: any;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'lessons' | 'codes' | 'payments' | 'reviews'>('lessons');

  // Login Gate
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth');
      if (auth === 'true') setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple login gate as requested
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminAuth', 'true');
      }
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูล</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="รหัสผ่าน..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-800">PASSKORPOR Admin</div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold flex-shrink-0 transition-colors ${activeTab === 'lessons' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            <BookOpen className="w-5 h-5" />
            เนื้อหาบทเรียน
          </button>
          <button 
            onClick={() => setActiveTab('codes')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold flex-shrink-0 transition-colors ${activeTab === 'codes' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            <KeyRound className="w-5 h-5" />
            Access Codes
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold flex-shrink-0 transition-colors ${activeTab === 'payments' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            <Receipt className="w-5 h-5" />
            รายการแจ้งโอน
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold flex-shrink-0 transition-colors ${activeTab === 'reviews' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            <MessageSquare className="w-5 h-5" />
            จัดการรีวิว
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 overflow-hidden">
          {activeTab === 'lessons' && <LessonsManager />}
          {activeTab === 'codes' && <CodesManager />}
          {activeTab === 'payments' && <PaymentsManager />}
          {activeTab === 'reviews' && <ReviewsManager />}
        </div>
      </main>
    </div>
  );
}

// --- Managers ---

function LessonsManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', order: 0, content: '' });
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'lessons'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(data);
    } catch (err: any) {
      console.error(err);
      alert(`Error fetching lessons: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'lessons', editingId), formData);
      } else {
        await addDoc(collection(db, 'lessons'), formData);
      }
      setEditingId(null);
      setFormData({ title: '', order: 0, content: '' });
      fetchLessons();
    } catch (err) {
      console.error("Error saving lesson:", err);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setFormData({ title: lesson.title, order: lesson.order, content: lesson.content });
    setEditingId(lesson.id);
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบบทเรียนนี้?',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'lessons', id));
          setLessons(prev => prev.filter(l => l.id !== id));
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">จัดการเนื้อหาบทเรียน</h2>
        {!editingId && (
          <button 
            onClick={() => setEditingId('')} // Empty string means "New"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> เพิ่มบทเรียนใหม่
          </button>
        )}
      </div>

      {editingId !== null ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">{editingId ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียนใหม่'}</h3>
            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อบทเรียน</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" placeholder="เช่น บทที่ 1: พื้นฐาน..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ลำดับ (Order)</label>
              <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เนื้อหา (รองรับ Markdown & HTML)</label>
            <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={10} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditingId(null)} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors">ยกเลิก</button>
            <button onClick={handleSave} className="px-5 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors">
              <Save className="w-4 h-4" /> บันทึก
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">กำลังโหลด...</div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">ยังไม่มีเนื้อหาบทเรียน</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl">ลำดับ</th>
                  <th className="px-4 py-3">หัวข้อ</th>
                  <th className="px-4 py-3 text-right rounded-tr-xl">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-4 font-medium">{lesson.order}</td>
                    <td className="px-4 py-4">{lesson.title}</td>
                    <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(lesson)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(lesson.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <ConfirmModal 
        isOpen={confirmDialog.isOpen} 
        message={confirmDialog.message} 
        onConfirm={confirmDialog.onConfirm} 
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}

function CodesManager() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'access_codes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccessCode));
      setCodes(data);
    } catch (err: any) {
      console.error(err);
      alert(`Error fetching codes: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const generateCode = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      await addDoc(collection(db, 'access_codes'), {
        code: code,
        status: 'unused',
        createdAt: serverTimestamp()
      });
      fetchCodes();
    } catch (err) {
      console.error("Error generating code:", err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('คัดลอก ' + text + ' แล้ว');
  };

  const voidCode = (id: string, code: string) => {
    setConfirmDialog({
      isOpen: true,
      message: `คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการใช้งาน Code: ${code}? \n\n(Code นี้จะกลับมาอยู่ในสถานะ 'UNUSED' และสามารถแจกจ่ายให้คนอื่นได้อีกครั้ง)`,
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, 'access_codes', id), {
            status: 'unused',
            assignedPhone: null,
            assignedAt: null
          });
          setCodes(prev => prev.map(c => c.id === id ? { ...c, status: 'unused', assignedPhone: undefined } as AccessCode : c));
        } catch (err) {
          console.error("Error voiding code:", err);
        }
      }
    });
  };

  const deleteCode = (id: string, code: string) => {
    setConfirmDialog({
      isOpen: true,
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบ Code: ${code} ถาวร?`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'access_codes', id));
          setCodes(prev => prev.filter(c => c.id !== id));
        } catch (err) {
          console.error("Error deleting code:", err);
        }
      }
    });
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">จัดการ Access Codes</h2>
        <button 
          onClick={generateCode}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> สร้าง Code ใหม่
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">กำลังโหลด...</div>
        ) : codes.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">ยังไม่มีข้อมูล Code</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Code</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3">เจ้าของ (เบอร์)</th>
                <th className="px-4 py-3">วันที่สร้าง</th>
                <th className="px-4 py-3 rounded-tr-xl">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-mono font-bold text-lg text-gray-900 tracking-widest">{c.code}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.status === 'unused' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-700">{c.assignedPhone || '-'}</td>
                  <td className="px-4 py-4 text-gray-500">{new Date(c.createdAt?.toDate?.() || Date.now()).toLocaleDateString('th-TH')}</td>
                  <td className="px-4 py-4 flex items-center gap-3">
                    <button onClick={() => copyToClipboard(c.code)} className="text-blue-600 hover:text-blue-800 font-medium">คัดลอก</button>
                    {c.status === 'used' && (
                      <button onClick={() => voidCode(c.id, c.code)} title="ยกเลิกการใช้งาน" className="text-orange-500 hover:text-orange-700">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteCode(c.id, c.code)} title="ลบ Code" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ConfirmModal 
        isOpen={confirmDialog.isOpen} 
        message={confirmDialog.message} 
        onConfirm={confirmDialog.onConfirm} 
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}

function PaymentsManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void }>({ isOpen: false, message: '', onConfirm: () => {} });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      setPayments(data);
    } catch (err: any) {
      console.error(err);
      alert(`Error fetching payments: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบรายการแจ้งโอนของคุณ ${name} ถาวร?`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'payments', id));
          setPayments(prev => prev.filter(p => p.id !== id));
          setViewingPayment(null);
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">รายการแจ้งโอน</h2>
        <button onClick={fetchPayments} className="text-sm text-blue-600 font-medium hover:underline">รีเฟรช</button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">กำลังโหลด...</div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">ยังไม่มีรายการแจ้งโอน</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">วันที่แจ้งโอน</th>
                <th className="px-4 py-3">ชื่อ - นามสกุล</th>
                <th className="px-4 py-3">เบอร์โทรศัพท์</th>
                <th className="px-4 py-3 text-right rounded-tr-xl">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4 text-gray-600">{new Date(p.createdAt?.toDate?.() || Date.now()).toLocaleString('th-TH')}</td>
                  <td className="px-4 py-4 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-4 text-gray-600">{p.phone}</td>
                  <td className="px-4 py-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => setViewingPayment(p)} title="ดูสลิปและข้อมูล" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)} title="ลบรายการ" className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {viewingPayment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl relative"
          >
            <button onClick={() => setViewingPayment(null)} className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-full text-gray-700 hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
            <div className="bg-gray-100 h-64 flex items-center justify-center relative border-b border-gray-200">
              <div className="text-gray-400 font-medium flex flex-col items-center">
                <Receipt className="w-12 h-12 mb-2 opacity-50" />
                <span>จำลองรูปสลิป</span>
                <span className="text-xs mt-1">(รอการอัปโหลดไฟล์จริง)</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 border-b border-gray-100 pb-2">ข้อมูลผู้ชำระเงิน</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ชื่อ-นามสกุล:</span>
                  <span className="font-medium text-gray-900">{viewingPayment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                  <span className="font-medium text-gray-900">{viewingPayment.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่แจ้งโอน:</span>
                  <span className="text-gray-900">{new Date(viewingPayment.createdAt?.toDate?.() || Date.now()).toLocaleString('th-TH')}</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => {
                    handleDelete(viewingPayment.id, viewingPayment.name);
                    setViewingPayment(null);
                  }}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> ลบรายการ
                </button>
                <button 
                  onClick={() => setViewingPayment(null)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-2.5 rounded-xl transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <ConfirmModal 
        isOpen={confirmDialog.isOpen} 
        message={confirmDialog.message} 
        onConfirm={confirmDialog.onConfirm} 
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}

function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(data);
    } catch (err: any) {
      console.error(err);
      alert(`Error fetching reviews: ${err.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status: newStatus });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
    } catch (err: any) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const deleteReview = async (id: string) => {
    if (confirm('ลบรีวิวนี้หรือไม่?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        setReviews(prev => prev.filter(r => r.id !== id));
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          จัดการรีวิว
        </h2>
        <button onClick={fetchReviews} className="text-gray-500 hover:text-purple-600 p-2 rounded-full hover:bg-purple-50 transition-colors">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-gray-400 font-medium animate-pulse">กำลังโหลดข้อมูล...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">ยังไม่มีรีวิว</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm">
                <th className="font-medium py-3 px-4 pl-0">ชื่อผู้รีวิว</th>
                <th className="font-medium py-3 px-4">คะแนน</th>
                <th className="font-medium py-3 px-4 text-center">เนื้อหา</th>
                <th className="font-medium py-3 px-4 text-center">สถานะ</th>
                <th className="font-medium py-3 px-4 text-right pr-0">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 pl-0 font-medium text-gray-900">{r.name}</td>
                  <td className="py-4 px-4 text-gray-600 font-mono text-sm">{r.rating} ดาว</td>
                  <td className="py-4 px-4 text-gray-600 max-w-[200px] truncate text-center">{r.text}</td>
                  <td className="py-4 px-4 text-center">
                    {r.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">รอตรวจสอบ</span>}
                    {r.status === 'approved' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">อนุมัติแล้ว</span>}
                    {r.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">ไม่อนุมัติ</span>}
                  </td>
                  <td className="py-4 px-4 pr-0 flex justify-end gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(r.id, 'approved')} className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors border border-green-200 bg-white shadow-sm" title="อนุมัติ">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(r.id, 'rejected')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-red-200 bg-white shadow-sm" title="ไม่อนุมัติ">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteReview(r.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
