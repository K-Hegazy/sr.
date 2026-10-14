import React from 'react';
import { X, Scale, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCompareModalProps {
  products: Product[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  products,
  onClose,
  onRemove,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-lg bg-[#0e1422] border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-cyan-400">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">قائمة المقارنة فارغة</h3>
          <p className="text-sm text-slate-400">
            اضغط على أيقونة الميزان في كارت أي جهاز أو لابتوب أو ماوس لإضافته إلى جدول مقارنة المواصفات الفنية هنا.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
          >
            العودة للتصفح
          </button>
        </div>
      </div>
    );
  }

  // Spec rows to compare
  const comparisonRows: { key: string; label: string; getter: (p: Product) => string }[] = [
    { key: 'category', label: 'القسم والنوع', getter: (p) => p.category },
    { key: 'price', label: 'السعر (ج.م)', getter: (p) => `${p.price.toLocaleString('en-US')} ج.م` },
    { key: 'processor', label: 'المعالج (CPU)', getter: (p) => p.specs.processor || 'غير متوفر' },
    { key: 'gpu', label: 'كارت الشاشة (GPU)', getter: (p) => p.specs.gpu || 'غير متوفر' },
    { key: 'ram', label: 'الرامات (RAM)', getter: (p) => p.specs.ram || 'غير متوفر' },
    { key: 'storage', label: 'التخزين (SSD)', getter: (p) => p.specs.storage || 'غير متوفر' },
    { key: 'screen', label: 'الشاشة / التردد', getter: (p) => p.specs.screen || 'غير متوفر' },
    { key: 'sensor', label: 'المستشعر (Sensor)', getter: (p) => p.specs.sensor || p.specs.switchType || 'غير متوفر' },
    { key: 'dpi', label: 'الدقة / التوصيل', getter: (p) => p.specs.dpi || p.specs.connectivity || 'غير متوفر' },
    { key: 'battery', label: 'البطارية / الاستخدام', getter: (p) => p.specs.battery || p.specs.batteryLife || 'غير متوفر' },
    { key: 'weight', label: 'الوزن', getter: (p) => p.specs.weight || 'غير محدد' },
    { key: 'warranty', label: 'الضمان', getter: (p) => p.warranty },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              مقارنة المواصفات الفنية جنباً إلى جنب ({products.length} أجهزة)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto max-h-[75vh]">
          <div className="min-w-[650px]">
            {/* Products Header Row */}
            <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-800 items-start">
              <div className="col-span-3 text-xs font-semibold text-slate-400 pt-4">
                الجهاز والبيانات الأساسية
              </div>

              {products.map((p) => (
                <div key={p.id} className={`${products.length === 2 ? 'col-span-4' : 'col-span-3'} space-y-3`}>
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3]">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemove(p.id)}
                      title="إزالة من المقارنة"
                      className="absolute top-2 left-2 p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] text-cyan-400 font-medium">{p.brand}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5 leading-snug">
                      {p.name}
                    </h4>
                    <div className="text-base font-bold text-white mt-1 font-mono-numbers">
                      {p.price.toLocaleString('en-US')} <span className="text-xs text-cyan-400">ج.م</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>طلب هذا الجهاز</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="divide-y divide-slate-800/60 text-xs">
              {comparisonRows.map((row) => (
                <div key={row.key} className="grid grid-cols-12 gap-4 py-3.5 hover:bg-slate-900/30 transition-colors items-center">
                  <div className="col-span-3 font-semibold text-slate-400">
                    {row.label}
                  </div>

                  {products.map((p) => {
                    const val = row.getter(p);
                    const isAvailable = val !== 'غير متوفر';
                    return (
                      <div 
                        key={p.id} 
                        className={`${products.length === 2 ? 'col-span-4' : 'col-span-3'} font-mono-numbers ${
                          isAvailable ? 'text-slate-200' : 'text-slate-600'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
