import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';
import { STORE_CONTACT } from '../data/products';
import { StoreSettings } from '../types';

interface StoreInfoSectionProps {
  settings?: StoreSettings;
}

export const StoreInfoSection: React.FC<StoreInfoSectionProps> = ({ settings }) => {
  const info = settings || STORE_CONTACT;

  return (
    <section id="store-info" className="py-16 bg-[#0b0f17] border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-cyan-400 mb-2">المقر الرسمي لمتجر {info.storeName}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
            زورنا في المحل أو اطلب أونلاين بنفس راحة البال والضمان
          </h2>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            نحن نؤمن بأن شراء لابتوب أو ماوس احترافي يتطلب الثقة الكاملة. لذلك نوفر لك إمكانية فحص جهازك ومقارنة البنشمارك على أرض الواقع.
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Branch & Contact Info Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">عنوان ومقر المحل</h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {info.address}
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">موقع متميز وسهل الوصول - فحص وتجربة على أرض الواقع</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">مواعيد العمل واستقبال العملاء</h3>
                  <p className="text-sm text-slate-300 mt-1 font-mono-numbers">
                    {info.workingHours}
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">فريق الدعم الفني متواجد أيضاً على الواتساب على مدار الساعة</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">التواصل المباشر مع المبيعات</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-mono-numbers">
                    <a 
                      href={`tel:${info.phone}`} 
                      className="text-white hover:text-cyan-400 font-bold transition-colors"
                    >
                      {info.phone}
                    </a>
                    <span className="text-slate-600">·</span>
                    <a 
                      href={`https://wa.me/${info.whatsapp}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>محادثة واتساب سريعة</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action strip */}
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <a
                href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent('السلام عليكم، كنت حابب أستفسر عن الأجهزة المتوفرة في ' + info.storeName)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل معنا على الواتساب</span>
              </a>

              <a
                href={`tel:${info.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>اتصال هاتفياً</span>
              </a>
            </div>
          </div>

          {/* Guarantees and Branch Perks */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>مزايا الشراء من {info.storeName}</span>
              </h3>

              <div className="space-y-4 text-xs">
                {STORE_CONTACT.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-bold text-xs">{feat.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-center gap-3 text-xs text-slate-300">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                نوفر خدمة تركيب وتحديث ويندوز 11 الأصلي وتثبيت برامج الجرافيكس والألعاب الأساسية مجاناً مع أي لابتوب يتم شراؤه!
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
