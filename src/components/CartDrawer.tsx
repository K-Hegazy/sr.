import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, CheckCircle, Truck, Store, ArrowLeft, ShieldCheck } from 'lucide-react';
import { CartItem, CustomerOrder, StoreSettings } from '../types';
import { STORE_CONTACT } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (order: CustomerOrder) => void;
  settings?: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  settings,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('القاهرة والجيزة');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vodafone_cash' | 'card'>('cod');
  const [notes, setNotes] = useState('');
  const [lastOrderId, setLastOrderId] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = deliveryMethod === 'shipping' ? (subtotal > 20000 ? 0 : 100) : 0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف للتواصل وتأكيد الطلب');
      return;
    }

    const orderId = `SR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CustomerOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      city,
      address: deliveryMethod === 'pickup' ? 'استلام من فرع المحل بالدقي' : address,
      deliveryMethod,
      paymentMethod,
      notes,
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalPrice: grandTotal,
      status: 'new',
    };

    onSubmitOrder(newOrder);
    setLastOrderId(orderId);
    setStep('success');
  };

  const handleSendWhatsApp = () => {
    if (items.length === 0) return;

    const itemsSummary = items
      .map((item, idx) => `${idx + 1}. ${item.product.name} (عدد: ${item.quantity}) - ${item.product.price.toLocaleString('en-US')} ج.م`)
      .join('\n');

    const storeName = settings?.storeName || 'SR. Technology';
    const whatsappNum = settings?.whatsapp || STORE_CONTACT.whatsapp;

    const msg = `مرحباً ${storeName} 💻\nأود تأكيد طلب جديد من خلال موقع المحل:\n\n*المنتجات المطلوبة:*\n${itemsSummary}\n\n*إجمالي المبلغ:* ${grandTotal.toLocaleString('en-US')} ج.م\n*طريقة الاستلام:* ${deliveryMethod === 'pickup' ? 'استلام من فرع المحل بالدقي' : 'توصيل للمنزل'}\n${customerName ? `*اسم العميل:* ${customerName}\n` : ''}${customerPhone ? `*رقم الهاتف:* ${customerPhone}\n` : ''}${address && deliveryMethod === 'shipping' ? `*العنوان:* ${city} - ${address}\n` : ''}\nبرجاء تأكيد توافر المنتجات وتجهيز الفحص. شكراً!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${whatsappNum}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-[#0e1422] border-r border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                {step === 'cart' && `سلة المشتريات (${items.length})`}
                {step === 'checkout' && 'إتمام طلب الشراء'}
                {step === 'success' && 'تم تأكيد طلبك بنجاح'}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            
            {/* Step 1: Cart Items */}
            {step === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-white">سلة المشتريات فارغة</div>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      تصفح أجهزة اللابتوب والماوسات والإكسسوارات وأضف ما يناسبك للمتابعة.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex gap-3 items-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-cyan-400 font-bold font-mono-numbers mt-1">
                            {item.product.price.toLocaleString('en-US')} ج.م
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 text-xs font-mono-numbers">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="px-1.5 text-slate-400 hover:text-white"
                              >
                                -
                              </button>
                              <span className="px-2 text-white font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="px-1.5 text-slate-400 hover:text-white"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Checkout Form */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                {/* Delivery Method Picker */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">طريقة الاستلام</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('shipping')}
                      className={`p-3 rounded-xl border text-right transition-colors flex items-center gap-2 ${
                        deliveryMethod === 'shipping'
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold text-xs">توصيل للمنزل</div>
                        <div className="text-[10px] text-slate-500">شحن آمن مع المعاينة</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-xl border text-right transition-colors flex items-center gap-2 ${
                        deliveryMethod === 'pickup'
                          ? 'border-cyan-500 bg-cyan-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400'
                      }`}
                    >
                      <Store className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold text-xs">استلام من الفرع</div>
                        <div className="text-[10px] text-emerald-400">فحص مجاني بالدقي</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">الاسم بالكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمد"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">رقم الهاتف (للتأكيد والواتساب) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs font-mono-numbers"
                  />
                </div>

                {/* City & Address (if shipping) */}
                {deliveryMethod === 'shipping' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold block">المحافظة / المدينة</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs"
                      >
                        <option value="القاهرة والجيزة">القاهرة والجيزة</option>
                        <option value="الإسكندرية">الإسكندرية</option>
                        <option value="الدلتا والقناة">محافظات الدلتا والقناة</option>
                        <option value="الصعيد">محافظات الصعيد</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold block">العنوان بالتفصيل</label>
                      <input
                        type="text"
                        required
                        placeholder="اسم الشارع، رقم العمارة، الشقة، علامة مميزة"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                      />
                    </div>
                  </>
                )}

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">طريقة الدفع</label>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-cyan-500"
                      />
                      <span className="text-white font-medium">الدفع عند الاستلام (COD) بعد فحص الجهاز</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'vodafone_cash'}
                        onChange={() => setPaymentMethod('vodafone_cash')}
                        className="text-cyan-500"
                      />
                      <span className="text-white font-medium">محفظة إلكترونية (فودافون كاش / إنستاباي)</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">ملاحظات إضافية (اختياري)</label>
                  <input
                    type="text"
                    placeholder="طلب ترقية رام، تثبيت ويندوز معين، موعد مفضل للتوصيل"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>
              </form>
            )}

            {/* Step 3: Success Screen */}
            {step === 'success' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white">تم استلام طلبك بنجاح!</h3>
                  <div className="text-xs text-cyan-400 font-mono-numbers mt-1 font-semibold">
                    رقم الطلب: #{lastOrderId}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-right text-xs space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>العميل:</span>
                    <span className="text-white font-semibold">{customerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>الهاتف:</span>
                    <span className="text-white font-mono-numbers">{customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>الإجمالي:</span>
                    <span className="text-cyan-400 font-bold font-mono-numbers">{grandTotal.toLocaleString('en-US')} ج.م</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>الاستلام:</span>
                    <span className="text-slate-300">
                      {deliveryMethod === 'pickup' ? 'استلام من مقر المحل بالدقي' : `شحن إلى ${city}`}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-lg text-slate-300 text-xs flex items-center gap-2 text-right">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>سيقوم فريق مبيعات SR. Technology بالاتصال بك خلال دقائق لتأكيد الموعد والتسليم.</span>
                </div>

                <button
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>إرسال نسخة من الفاتورة إلى واتساب المحل</span>
                </button>

                <button
                  onClick={() => {
                    onClearCart();
                    setStep('cart');
                    onClose();
                  }}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  متابعة التسوق
                </button>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          {items.length > 0 && step !== 'success' && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-3">
              {/* Financial summary */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400 font-mono-numbers">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal.toLocaleString('en-US')} ج.م</span>
                </div>
                {deliveryMethod === 'shipping' && (
                  <div className="flex justify-between text-slate-400 font-mono-numbers">
                    <span>مصاريف التوصيل:</span>
                    <span>{shippingFee === 0 ? 'مجاناً للطلبات فوق 20,000 ج.م' : `${shippingFee} ج.م`}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800 font-mono-numbers">
                  <span>المبلغ الإجمالي:</span>
                  <span className="text-cyan-400">{grandTotal.toLocaleString('en-US')} ج.م</span>
                </div>
              </div>

              {/* Action buttons */}
              {step === 'cart' ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>متابعة إتمام الطلب أونلاين</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full py-2.5 bg-emerald-950/50 hover:bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>طلب مباشر عبر الواتساب بنقرة واحدة</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    رجوع للسلة
                  </button>

                  <button
                    type="submit"
                    form="checkout-form"
                    className="flex-1 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأكيد الطلب الآن</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
