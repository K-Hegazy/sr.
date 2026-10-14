import React from 'react';
import { SlidersHorizontal, ShieldCheck, Lock } from 'lucide-react';
import { STORE_CONTACT } from '../data/products';
import { StoreSettings } from '../types';

interface FooterProps {
  onOpenAdmin: () => void;
  onScrollToTop: () => void;
  settings?: StoreSettings;
  isOwnerLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenAdmin, 
  onScrollToTop, 
  settings, 
  isOwnerLoggedIn 
}) => {
  const info = settings || STORE_CONTACT;

  return (
    <footer className="bg-[#080c14] border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Col 1: Store Wordmark & Intro */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm font-mono-numbers">
                SR
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {info.storeName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              المتجر المتخصص في توفير أحدث أجهزة اللابتوب للألعاب والأعمال، الماوسات الاحترافية، وإكسسوارات الهاردوير في مصر مع فحص دقيق وضمان معتمد.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>محل مرخص وسجل تجاري معتمد · خدمة عملاء متواصلة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-white font-semibold text-xs mb-3">أقسام المحل</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onScrollToTop} className="hover:text-cyan-400 transition-colors">
                  أجهزة اللابتوب Gaming & Workstation
                </button>
              </li>
              <li>
                <button onClick={onScrollToTop} className="hover:text-cyan-400 transition-colors">
                  ماوسات ألعاب لاسلكية وبصرية
                </button>
              </li>
              <li>
                <button onClick={onScrollToTop} className="hover:text-cyan-400 transition-colors">
                  لوحات المفاتيح الميكانيكية المخصصة
                </button>
              </li>
              <li>
                <button onClick={onScrollToTop} className="hover:text-cyan-400 transition-colors">
                  شاشات وسماعات المحترفين
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Channels */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-white font-semibold text-xs mb-3">خدمة العملاء والتواصل</h4>
            <div className="space-y-1.5 text-slate-400">
              <div>الهاتف: <span className="text-white font-mono-numbers">{info.phone}</span></div>
              <div>الواتساب: <span className="text-emerald-400 font-mono-numbers">{info.whatsapp}</span></div>
              <div className="text-slate-500 text-[11px] pt-1 truncate">{info.address}</div>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمتجر {info.storeName}.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 hover:text-slate-300 transition-colors text-slate-400"
            >
              {isOwnerLoggedIn ? (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>لوحة تحكم المالك</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>تسجيل دخول المالك</span>
                </>
              )}
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button onClick={onScrollToTop} className="hover:text-slate-300 transition-colors">
              الرجوع لأعلى الصفحة ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
