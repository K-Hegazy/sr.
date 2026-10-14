import React, { useState } from 'react';
import { X, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  currentOwnerPassword?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentOwnerPassword = 'srtech2024',
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Validate credentials against current owner password (or default srtech2024)
      if (
        (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'owner' || username.trim().toLowerCase() === 'sr') &&
        (password === currentOwnerPassword || password === 'srtech2024')
      ) {
        onLoginSuccess(username.trim());
        setPassword('');
        setError('');
        onClose();
      } else {
        setError('بيانات تسجيل الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
      }
      setLoading(false);
    }, 400);
  };

  const handleUsePreset = () => {
    setUsername('admin');
    setPassword(currentOwnerPassword);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">تسجيل دخول مالك المحل</h3>
              <span className="text-[11px] text-slate-400">لوحة تحكم إدارة SR. Technology</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6 space-y-4">
          <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              هذه المنطقة مخصصة لمالك المتجر فقط لإضافة وتعديل وحذف المنتجات، وتعديل بيانات التواصل والمقر ومتابعة الطلبات.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">اسم المستخدم أو الحساب</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-mono-numbers"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">كلمة المرور السرية</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pr-3.5 pl-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-mono-numbers"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-xs"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'جارٍ التحقق...' : 'دخول لوحة تحكم المالك'}</span>
            </button>
          </form>

          {/* Quick preset helper for the store owner */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>بيانات المالك الافتراضية:</span>
            <button
              type="button"
              onClick={handleUsePreset}
              className="text-cyan-400 hover:underline hover:text-cyan-300 font-mono-numbers"
            >
              ملء الحساب تلقائياً (admin / {currentOwnerPassword})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
