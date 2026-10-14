import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Scale, 
  Check, 
  MessageCircle, 
  MapPin, 
  Zap, 
  Star, 
  MessageSquareQuote, 
  UserCheck, 
  Send 
} from 'lucide-react';
import { Product, ProductReview, StoreSettings } from '../types';
import { STORE_CONTACT } from '../data/products';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onDirectOrderWhatsApp: (product: Product, quantity: number) => void;
  onAddReview?: (productId: string, review: ProductReview) => void;
  settings?: StoreSettings;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onDirectOrderWhatsApp,
  onAddReview,
  settings,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert('يرجى كتابة اسمك ورأيك في الجهاز');
      return;
    }

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: reviewName.trim(),
      rating: reviewRating,
      date: 'الآن (محدث)',
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    };

    if (onAddReview) {
      onAddReview(product.id, newReview);
    }

    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setTimeout(() => setReviewSuccess(false), 3500);
  };

  // Spec label mappings in clear Arabic
  const specLabels: Record<string, string> = {
    processor: 'المعالج (CPU)',
    gpu: 'كارت الشاشة (GPU)',
    ram: 'الذاكرة العشوائية (RAM)',
    storage: 'سعة التخزين (SSD)',
    screen: 'الشاشة والتردد (Display)',
    battery: 'البطارية وسرعة الشحن',
    weight: 'الوزن والتصميم',
    os: 'نظام التشغيل',
    sensor: 'المستشعر البصري (Sensor)',
    dpi: 'دقة الحساسية (DPI)',
    connectivity: 'طريقة الاتصال والتوصيل',
    switches: 'نوع السويتشات / المفاتيح',
    pollingRate: 'معدل الاستجابة (Polling Rate)',
    rgb: 'إضاءة RGB والتخصيص',
    switchType: 'طراز السويتش الميكانيكي',
    layout: 'التوزيع الحجمي للكيبورد',
    hotswappable: 'دعم التبديل السريع (Hot-Swap)',
    keycaps: 'خامة أغطية المفاتيح (Keycaps)',
    backlight: 'الإضاءة الخلفية والأنماط',
    panel: 'نوع اللوحة والتباين (Panel)',
    resolution: 'دقة العرض',
    refreshRate: 'معدل التحديث (Refresh Rate)',
    responseTime: 'زمن الاستجابة (Response Time)',
    curved: 'مستوى الانحناء',
    ports: 'المنافذ والتوصيلات',
    driver: 'حجم المشغلات الصوتية',
    frequency: 'الاستجابة الترددية',
    microphone: 'الميكروفون وتقنية العزل',
    spatialAudio: 'الصوت المحيطي والألعاب',
  };

  const reviewsList = product.reviews || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>كود المنتج: {product.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-8">
          
          {/* Top Overview: Image + Core Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Image Box */}
            <div className="md:col-span-5 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center aspect-[4/3] relative">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-3 right-3 text-xs font-semibold text-cyan-300 bg-[#0b0f17]/90 px-3 py-1 rounded border border-cyan-500/30">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Title, Pricing & Quick Buy */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <span className={product.inStock ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                  {product.inStock ? `● متوفر بالمحل (${product.stockCount} قطع)` : '● غير متوفر حالياً'}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300 flex items-center gap-1 font-mono-numbers">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <strong className="text-white font-bold">{product.rating.toFixed(1)}</strong>
                  <span className="text-slate-400">({product.reviewsCount} تقييم)</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {product.name}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Price display */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">السعر النهائي للقطعة</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                      {product.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-sm font-semibold text-cyan-400">جنيه مصري</span>
                  </div>
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-left font-mono-numbers">
                    <span className="text-xs text-emerald-400 font-semibold block">
                      وفر {(product.originalPrice - product.price).toLocaleString('en-US')} ج.م
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      {product.originalPrice.toLocaleString('en-US')} ج.م
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 font-mono-numbers">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-white text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount || 5, quantity + 1))}
                      className="px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                      added
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : product.inStock
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تمت إضافة {quantity} إلى السلة!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>إضافة إلى السلة ({((product.price * quantity)).toLocaleString('en-US')} ج.م)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp Order button */}
                <button
                  onClick={() => onDirectOrderWhatsApp(product, quantity)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>طلب مباشر عبر الواتساب مع خدمة عملاء المحل</span>
                </button>

                {/* Compare trigger */}
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-medium border transition-colors ${
                    isCompared
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'الجهاز مضاف لجدول المقارنة' : 'مقارنة مواصفات هذا الجهاز مع غيره'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Full Technical Specifications Sheet (المواصفات الفنية بالتفصيل) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>المواصفات الفنية التفصيلية (Technical Specifications)</span>
              </h3>
              <span className="text-xs text-slate-400">مفحوص ومضمون بالكامل</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specs).map(([key, value]) => {
                if (!value) return null;
                const label = specLabels[key] || key;
                return (
                  <div 
                    key={key} 
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <span className="text-xs font-medium text-slate-400 mb-1">{label}</span>
                    <span className="text-sm font-semibold text-slate-200 font-mono-numbers leading-snug">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Reviews & Feedback Section (تقييمات وآراء العملاء) */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-amber-400" />
                  <span>آراء وتقييمات العملاء (Reviews)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تجارب حقيقية لعملاء قاموا بشراء وفحص هذا الجهاز في متجر SR. Technology
                </p>
              </div>

              {/* Summary score chip */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto font-mono-numbers">
                <div className="text-2xl font-bold text-white">{product.rating.toFixed(1)}</div>
                <div className="border-r border-slate-700 pr-3 space-y-0.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {product.reviewsCount} تقييم مسجل
                  </div>
                </div>
              </div>
            </div>

            {/* Submit New Review Form */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="text-sm font-semibold text-white flex items-center justify-between">
                <span>أضف تقييمك ورأيك في الجهاز:</span>
                <span className="text-xs text-slate-400">شارك تجربتك مع زوار المحل</span>
              </div>

              {reviewSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>شكراً لك! تم نشر تقييمك وتحديث معدل النجوم بنجاح.</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                {/* Rating Stars Picker */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-medium">التقييم بالنجوم:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 text-slate-600 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= (hoverRating ?? reviewRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-amber-400 font-semibold font-mono-numbers">
                    ({hoverRating ?? reviewRating} من 5 نجوم)
                  </span>
                </div>

                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="اسمك الكريم (مثال: م. أحمد كمال)"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                {/* Comment Text Area */}
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="اكتب تجربتك مع الجهاز، أداء التبريد، الشاشة، سرعة الاستجابة أو جودة التغليف..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التقييم</span>
                </button>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {reviewsList.length === 0 ? (
                <div className="p-6 text-center rounded-xl bg-slate-900/30 border border-slate-800/60 text-slate-400 text-xs">
                  لا توجد تقييمات مكتوبة بعد لهذا الجهاز. كن أول من يشارك تجربته الفنية!
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                          {rev.userName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                <UserCheck className="w-3 h-3" />
                                <span>شراء موثق</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono-numbers">{rev.date}</span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pr-9">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Store Guarantee and Pickup Terms */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-start gap-3 text-xs text-cyan-200">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white text-sm block">ضمان معتمد من متجر {settings?.storeName || 'SR. Technology'}:</span>
              <p className="text-slate-300 leading-relaxed">
                {product.warranty}
              </p>
              <div className="flex items-center gap-2 text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>عنوان المحل للمعاينة والتجربة: {settings?.address || STORE_CONTACT.address}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
