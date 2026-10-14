import React, { useState } from 'react';
import { 
  X, 
  PackagePlus, 
  ShoppingBag, 
  Check, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Settings, 
  LogOut, 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  KeyRound,
  AlertTriangle 
} from 'lucide-react';
import { Product, CustomerOrder, ProductCategory, StoreSettings } from '../types';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: CustomerOrder[];
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onAddProduct: (product: Product) => void;
  onToggleStock: (productId: string) => void;
  onToggleHideProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  ownerUsername: string;
  onLogout: () => void;
  onChangePassword: (newPass: string) => void;
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  storeSettings,
  onUpdateStoreSettings,
  onAddProduct,
  onToggleStock,
  onToggleHideProduct,
  onDeleteProduct,
  onUpdatePrice,
  onUpdateOrderStatus,
  onDeleteOrder,
  ownerUsername,
  onLogout,
  onChangePassword,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'add' | 'settings' | 'security'>('orders');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState<Exclude<ProductCategory, 'all'>>('laptops');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('5');
  const [newDescription, setNewDescription] = useState('');
  const [newSpecsSummary, setNewSpecsSummary] = useState('');
  const [newCpu, setNewCpu] = useState('');
  const [newGpu, setNewGpu] = useState('');
  const [newRam, setNewRam] = useState('');
  const [newStorage, setNewStorage] = useState('');
  const [newScreenOrSensor, setNewScreenOrSensor] = useState('');
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);

  // Quick edit price state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInputValue, setPriceInputValue] = useState('');

  // Store Settings Editable State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Synchronize settings form whenever storeSettings changes
  React.useEffect(() => {
    setSettingsForm({ ...storeSettings });
  }, [storeSettings]);

  if (!isOpen) return null;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) return;

    let defaultImg = '/src/assets/images/product_gaming_laptop_1791962842873.jpg';
    if (newCategory === 'mice') defaultImg = '/src/assets/images/product_wireless_mouse_1791962843015.jpg';
    if (newCategory === 'keyboards') defaultImg = '/src/assets/images/product_mech_keyboard_1791962842966.jpg';
    if (newCategory === 'monitors') defaultImg = '/src/assets/images/product_gaming_monitor_1791962862282.jpg';
    if (newCategory === 'audio') defaultImg = '/src/assets/images/product_pro_headset_1791962862166.jpg';

    const p: Product = {
      id: `p-${Date.now().toString().slice(-5)}`,
      name: newTitle.trim(),
      brand: newBrand.trim() || 'SR. Tech',
      category: newCategory,
      price: parseFloat(newPrice) || 0,
      inStock: parseInt(newStock, 10) > 0,
      stockCount: parseInt(newStock, 10) || 1,
      maxStock: (parseInt(newStock, 10) || 1) * 2,
      hidden: false,
      image: defaultImg,
      description: newDescription.trim() || 'جهاز إلكتروني عالي الأداء معتمد من متجر SR. Technology.',
      warranty: 'ضمان محلي معتمد من SR. Technology لمدة عامين',
      rating: 5.0,
      reviewsCount: 1,
      keySpecsSummary: newSpecsSummary ? newSpecsSummary.split(',').map((s) => s.trim()) : [newBrand, 'جديد'],
      specs: {
        processor: newCpu || undefined,
        gpu: newGpu || undefined,
        ram: newRam || undefined,
        storage: newStorage || undefined,
        screen: newCategory === 'laptops' || newCategory === 'monitors' ? newScreenOrSensor : undefined,
        sensor: newCategory === 'mice' ? newScreenOrSensor : undefined,
      },
    };

    onAddProduct(p);
    setShowSuccessBadge(true);
    setTimeout(() => {
      setShowSuccessBadge(false);
      setActiveTab('products');
    }, 1200);

    // Reset form
    setNewTitle('');
    setNewPrice('');
    setNewBrand('');
    setNewDescription('');
    setNewSpecsSummary('');
    setNewCpu('');
    setNewGpu('');
    setNewRam('');
    setNewStorage('');
    setNewScreenOrSensor('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (newPassword.length < 6) {
      setPassError('يجب أن تكون كلمة المرور 6 أحرف أو أرقام على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }
    onChangePassword(newPassword);
    setPassSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-3xl bg-[#0e1422] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono-numbers">
                  SR
                </div>
                <h2 className="text-base font-bold text-white">
                  لوحة تحكم مالك متجر SR. Technology
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  تم الدخول بحساب المالك ({ownerUsername})
                </span>
                <span className="text-slate-600">·</span>
                <button
                  onClick={onLogout}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px] hover:underline"
                >
                  <LogOut className="w-3 h-3" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-3 border-b border-slate-800 flex gap-1 bg-slate-900/40 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2.5 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2.5 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>إدارة المنتجات والمخزون ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-2.5 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'add'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>إضافة جهاز جديد</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-2.5 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>بيانات المحل والتواصل</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-2.5 font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                activeTab === 'security'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>أمان الحساب</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            
            {/* Tab 1: Incoming Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-600" />
                    <div>لا توجد طلبات جديدة مسجلة حالياً</div>
                    <p className="text-[11px] text-slate-500">
                      عندما يقوم العملاء بطلب جهاز أو ماوس من الموقع، ستظهر بياناتهم ورقم هاتفهم هنا فوراً.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono-numbers">#{order.id}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>

                        {/* Status switcher */}
                        <div className="flex items-center gap-1">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as CustomerOrder['status'])}
                            className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-[11px] focus:outline-none"
                          >
                            <option value="new">طلب جديد</option>
                            <option value="confirmed">تم التأكيد مع العميل</option>
                            <option value="delivered">تم التسليم بنجاح</option>
                            <option value="cancelled">ملغي</option>
                          </select>

                          <button
                            onClick={() => onDeleteOrder(order.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 block text-[10px]">العميل:</span>
                          <span className="text-white font-semibold">{order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">الهاتف:</span>
                          <a href={`tel:${order.customerPhone}`} className="text-cyan-400 font-mono-numbers hover:underline">
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-slate-800/50">
                          <span className="text-slate-500 block text-[10px]">العنوان والاستلام:</span>
                          <span className="text-slate-300">{order.city} - {order.address}</span>
                        </div>
                        {order.notes && (
                          <div className="col-span-2 text-amber-300 text-[11px]">
                            ملاحظة: {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="space-y-1 text-xs">
                        <span className="text-slate-400 text-[11px] block">المنتجات المطلوبة:</span>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300 font-mono-numbers">
                            <span>{it.quantity}x {it.productName}</span>
                            <span>{(it.price * it.quantity).toLocaleString('en-US')} ج.م</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-400">الإجمالي:</span>
                        <span className="text-cyan-400 font-bold text-sm font-mono-numbers">
                          {order.totalPrice.toLocaleString('en-US')} ج.م
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Products Inventory, Visibility (Hide/Show), Price, & Delete */}
            {activeTab === 'products' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <span>إجمالي منتجات المحل: <strong>{products.length}</strong> (المعروض: {products.filter(p => !p.hidden).length} | المخفي: {products.filter(p => p.hidden).length})</span>
                  <span className="text-slate-500 text-[11px]">المالك فقط يتحكم بالعرض والحذف</span>
                </div>

                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      p.hidden 
                        ? 'bg-slate-950/40 border-slate-800/50 opacity-75' 
                        : 'bg-slate-900/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-lg object-cover bg-slate-950"
                        />
                        {p.hidden && (
                          <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-amber-400 text-[10px] font-bold">
                            مخفي
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-cyan-400 font-semibold">{p.brand}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 text-[11px]">{p.category}</span>
                          {p.hidden && (
                            <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-300 px-1.5 py-0.2 rounded">
                              مخفي عن الزوار
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">{p.name}</h4>
                        
                        {/* Price display / edit */}
                        {editingPriceId === p.id ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="number"
                              value={priceInputValue}
                              onChange={(e) => setPriceInputValue(e.target.value)}
                              className="w-24 bg-slate-800 border border-cyan-400 text-white px-2 py-0.5 rounded text-xs font-mono-numbers"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                const np = parseFloat(priceInputValue);
                                if (!isNaN(np) && np > 0) {
                                  onUpdatePrice(p.id, np);
                                }
                                setEditingPriceId(null);
                              }}
                              className="px-2 py-0.5 bg-cyan-400 text-slate-950 rounded font-bold"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-cyan-400 font-bold font-mono-numbers">
                              {p.price.toLocaleString('en-US')} ج.م
                            </span>
                            <button
                              onClick={() => {
                                setEditingPriceId(p.id);
                                setPriceInputValue(p.price.toString());
                              }}
                              className="text-slate-500 hover:text-slate-300"
                              title="تعديل السعر"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <span className="text-slate-500">·</span>
                            <span className="text-slate-400 text-[11px] font-mono-numbers">
                              المخزون: {p.stockCount} قطعة
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Owner Action Buttons: Stock toggle, Hide/Show, Delete */}
                    <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      
                      {/* Stock toggle */}
                      <button
                        onClick={() => onToggleStock(p.id)}
                        title="تغيير حالة التوفر"
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                          p.inStock
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                        }`}
                      >
                        {p.inStock ? 'متوفر' : 'غير متوفر'}
                      </button>

                      {/* Hide / Show Toggle */}
                      <button
                        onClick={() => onToggleHideProduct(p.id)}
                        title={p.hidden ? 'إظهار المنتج في المتجر' : 'إخفاء المنتج مؤقتاً عن العملاء'}
                        className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[11px] ${
                          p.hidden
                            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {p.hidden ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>إظهار</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>إخفاء</span>
                          </>
                        )}
                      </button>

                      {/* Delete Product */}
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف المنتج "${p.name}" نهائياً من المتجر؟`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        title="حذف المنتج نهائياً"
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Add New Product */}
            {activeTab === 'add' && (
              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                {showSuccessBadge && (
                  <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>تمت إضافة الجهاز الجديد للمتجر بنجاح!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-slate-300 font-semibold block">اسم الجهاز أو الماوس بالكامل *</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: Lenovo Legion Slim 5"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-slate-300 font-semibold block">الماركة / Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="Lenovo, Logitech, Razer, ASUS..."
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">القسم</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="laptops">أجهزة لابتوب (Laptops)</option>
                      <option value="mice">ماوسات ألعاب (Mice)</option>
                      <option value="keyboards">لوحات مفاتيح (Keyboards)</option>
                      <option value="monitors">شاشات (Monitors)</option>
                      <option value="audio">سماعات (Headsets)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">السعر (ج.م) *</label>
                    <input
                      type="number"
                      required
                      placeholder="مثال: 55000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Specs input strip */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="text-slate-400 font-semibold text-xs">المواصفات الفنية:</div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="المعالج (مثال: Core i7-14700HX)"
                        value={newCpu}
                        onChange={(e) => setNewCpu(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="كارت الشاشة (مثال: RTX 4060 8GB)"
                        value={newGpu}
                        onChange={(e) => setNewGpu(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="الرام (مثال: 16GB DDR5)"
                        value={newRam}
                        onChange={(e) => setNewRam(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="التخزين (مثال: 1TB NVMe SSD)"
                        value={newStorage}
                        onChange={(e) => setNewStorage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="الشاشة أو السنسور (مثال: 165Hz IPS أو 26,000 DPI Sensor)"
                        value={newScreenOrSensor}
                        onChange={(e) => setNewScreenOrSensor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="علامات سريعة مفصولة بفاصلة (مثال: 144Hz, RTX 4060, 16GB)"
                        value={newSpecsSummary}
                        onChange={(e) => setNewSpecsSummary(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">وصف قصير</label>
                  <textarea
                    rows={2}
                    placeholder="وصف لحالة الجهاز والضمان ومميزاته"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <PackagePlus className="w-4 h-4" />
                  <span>نشر الجهاز في متجر SR. Technology</span>
                </button>
              </form>
            )}

            {/* Tab 4: Store Info & Direct Contact Channels (تعديل العنوان ومواعيد العمل وأرقام التواصل) */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-slate-300 text-xs flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    التعديل هنا يُحدّث بيانات المتجر، العنوان، رقم الواتساب، ورقم الهاتف فوراً عبر كامل صفحات الموقع.
                  </span>
                </div>

                {settingsSaved && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>تم حفظ وتحديث بيانات المتجر ومواعيد العمل بنجاح!</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>رقم هاتف المبيعات والاستفسار *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white font-mono-numbers focus:outline-none focus:border-cyan-400"
                        placeholder="010XXXXXXXX"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>رقم الواتساب لاستقبال الطلبات الفورية *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white font-mono-numbers focus:outline-none focus:border-cyan-400"
                        placeholder="2010XXXXXXXX (مع كود الدولة)"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>عنوان ومقر المحل بالكامل *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="العنوان التفصيلي للمحل"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>مواعيد العمل واستقبال العملاء *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.workingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-mono-numbers"
                      placeholder="مثال: يومياً من 12:00 ظهراً حتى 11:30 مساءً"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">
                      نص الشريط الإعلاني أعلى الموقع (Banner)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementBanner}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementBanner: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                      placeholder="عرض أو إعلان يظهر في أعلى الموقع للزوار"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>تحديث وحفظ بيانات المحل على الموقع</span>
                </button>
              </form>
            )}

            {/* Tab 5: Security & Owner Password */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs max-w-md">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 space-y-1">
                  <div className="font-semibold text-white">تغيير كلمة المرور الخاصة بالمالك:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    احرص على تعيين كلمة مرور قوية لمنع أي شخص غير مصرح له من تعديل أسعار أو منتجات المتجر.
                  </p>
                </div>

                {passError && (
                  <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{passError}</span>
                  </div>
                )}

                {passSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم تغيير كلمة المرور بنجاح وحفظها!</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>تأكيد وحفظ كلمة المرور الجديدة</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
