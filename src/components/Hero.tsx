import React from 'react';
import { ArrowLeft, ShieldCheck, Cpu, Zap, Truck } from 'lucide-react';
import { StoreSettings } from '../types';
import { STORE_CONTACT } from '../data/products';

interface HeroProps {
  onExploreClick: () => void;
  onLaptopsClick: () => void;
  settings?: StoreSettings;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onLaptopsClick, settings }) => {
  const info = settings || STORE_CONTACT;

  return (
    <div className="relative border-b border-slate-800 bg-gradient-to-b from-[#0e1422] to-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (in RTL: Right visual column) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Clean unboxed kicker with separators */}
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
              <span>عتاد النخبة لألعاب الكمبيوتر وصنّاع المحتوى</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">القاهرة والدقي</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">فحص وتجربة قبل الدفع</span>
            </div>

            {/* Main Title with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.25] text-balance">
              عالم الأجهزة الإلكترونية الاحترافية بين يديك في{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                {info.storeName}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              تصفح مواصفات أقوى أجهزة اللابتوب، الماوسات اللاسلكية بدقة تصل إلى 30,000 DPI، لوحات المفاتيح الميكانيكية وشاشات الألعاب مع طلب أونلاين فوري وضمان محلي معتمد.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0b0f17] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-lg shadow-cyan-950/50"
              >
                <span>تصفح المنتجات والأسعار</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onLaptopsClick}
                className="px-5 py-3 text-sm font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
              >
                عروض اللابتوب والألعاب
              </button>
            </div>

            {/* Quick trust notes */}
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-4">
              <span>✓ ضمان الوكيل سنتين</span>
              <span>✓ شحن لجميع محافظات مصر</span>
              <span>✓ إمكانية الدفع عند الاستلام</span>
            </div>
          </div>

          {/* Right Column (Hero Visual Asset) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_tech_store_1791962841873.jpg"
                alt="SR. Technology Setup"
                className="w-full h-[320px] sm:h-[400px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />
              
              {/* Overlay banner at bottom */}
              <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-semibold text-sm">مقر المحل متاح لاستقبالكم</div>
                  <div className="text-slate-400 text-xs mt-0.5 truncate max-w-[220px] sm:max-w-xs">{info.address}</div>
                </div>
                <div className="text-left font-mono-numbers shrink-0">
                  <div className="text-cyan-400 font-bold text-xs truncate max-w-[160px]">{info.workingHours}</div>
                  <div className="text-slate-500 text-[11px]">مفتوح للعملاء</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column Trust Strip Row below the hero split */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">ضمان واستبدال فوري</div>
              <div className="text-slate-400 text-xs mt-0.5">استبدال 14 يوم + ضمان سنتين معتمد</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">مواصفات حقيقية 100%</div>
              <div className="text-slate-400 text-xs mt-0.5">فحص البنشمارك والحرارة قبل الشراء</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">توصيل سريع وآمن</div>
              <div className="text-slate-400 text-xs mt-0.5">معاينة كاملة مع المندوب قبل السداد</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">طلب مباشر واتساب</div>
              <div className="text-slate-400 text-xs mt-0.5">تأكيد فوري ودعم فني على مدار الساعة</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
