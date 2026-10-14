import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDrawer } from './components/AdminDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StoreInfoSection } from './components/StoreInfoSection';
import { Footer } from './components/Footer';
import { Product, ProductCategory, CartItem, CustomerOrder, ProductReview, StoreSettings } from './types';
import { INITIAL_PRODUCTS, STORE_CONTACT, DEFAULT_STORE_SETTINGS } from './data/products';
import { Search, Filter, Scale, X, Lock, EyeOff } from 'lucide-react';

export default function App() {
  // Store Settings (Address, Working Hours, Phone, WhatsApp, Announcement)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('sr_tech_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sr_tech_settings', JSON.stringify(storeSettings));
    } catch (e) {
      console.error(e);
    }
  }, [storeSettings]);

  // Owner Authentication State
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sr_tech_owner_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [ownerUsername, setOwnerUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('sr_tech_owner_user') || 'admin';
    } catch (e) {
      return 'admin';
    }
  });

  const [ownerPassword, setOwnerPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('sr_tech_owner_pass') || 'srtech2024';
    } catch (e) {
      return 'srtech2024';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Products state with localStorage persistence and migration safety
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sr_tech_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => {
          const init = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          return {
            ...p,
            hidden: p.hidden ?? false,
            maxStock: p.maxStock || init?.maxStock || 15,
            reviews: p.reviews && p.reviews.length > 0 ? p.reviews : (init?.reviews || []),
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sr_tech_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Orders state with localStorage persistence
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('sr_tech_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sr_tech_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sr_tech_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sr_tech_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Compare state
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [showBanner, setShowBanner] = useState(true);

  // Owner Authentication Handlers
  const handleLoginSuccess = (user: string) => {
    setIsOwnerLoggedIn(true);
    setOwnerUsername(user);
    try {
      localStorage.setItem('sr_tech_owner_logged_in', 'true');
      localStorage.setItem('sr_tech_owner_user', user);
    } catch (e) {
      console.error(e);
    }
    setIsAdminOpen(true);
  };

  const handleLogout = () => {
    setIsOwnerLoggedIn(false);
    try {
      localStorage.removeItem('sr_tech_owner_logged_in');
    } catch (e) {
      console.error(e);
    }
    setIsAdminOpen(false);
  };

  const handleChangePassword = (newPass: string) => {
    setOwnerPassword(newPass);
    try {
      localStorage.setItem('sr_tech_owner_pass', newPass);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdminClick = () => {
    if (isOwnerLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Cart Management Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSubmitOrder = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  // Compare Handlers
  const handleToggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('يمكنك مقارنة 3 أجهزة كحد أقصى في وقت واحد لتسهيل قراءة المواصفات');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
  };

  // Direct WhatsApp Order
  const handleDirectOrderWhatsApp = (product: Product, quantity = 1) => {
    const total = product.price * quantity;
    const msg = `مرحباً متجر ${storeSettings.storeName} 💻\nأود الاستفسار وطلب الجهاز التالي مباشرة:\n\n*المنتج:* ${product.name}\n*الكمية:* ${quantity}\n*السعر:* ${total.toLocaleString('en-US')} ج.م\n*الضمان:* ${product.warranty}\n\nهل المنتج متوفر حالياً للاستلام أو الشحن؟`;
    window.open(`https://wa.me/${storeSettings.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Reviews Handler
  const handleAddReview = (productId: string, review: ProductReview) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedReviews = [review, ...(p.reviews || [])];
        const newReviewsCount = updatedReviews.length;
        const newAverageRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewsCount;

        const updatedProd: Product = {
          ...p,
          reviews: updatedReviews,
          reviewsCount: newReviewsCount,
          rating: parseFloat(newAverageRating.toFixed(2)),
        };

        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(updatedProd);
        }

        return updatedProd;
      })
    );
  };

  // Owner Management Handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleToggleHideProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, hidden: !p.hidden } : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCompareItems((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Unique brands
  const brandsList = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['all', ...list];
  }, [products]);

  // Filtered and Sorted Products (Hidden products are filtered out for regular visitors)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // If not logged in as owner, do not show hidden products
        if (!isOwnerLoggedIn && p.hidden) {
          return false;
        }
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }
        // Stock filter
        if (onlyInStock && !p.inStock) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSpecs = Object.values(p.specs).some((val) =>
            val?.toLowerCase().includes(q)
          );
          if (!matchName && !matchBrand && !matchDesc && !matchSpecs) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, activeCategory, selectedBrand, onlyInStock, searchQuery, sortBy, isOwnerLoggedIn]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { id: 'all', name: 'جميع المعروضات' },
    { id: 'laptops', name: 'أجهزة اللابتوب' },
    { id: 'mice', name: 'ماوسات ألعاب' },
    { id: 'keyboards', name: 'لوحات مفاتيح' },
    { id: 'monitors', name: 'شاشات عرض' },
    { id: 'audio', name: 'سماعات وصوتيات' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      
      {/* Slim Dismissible Promotional Banner (Configured by Owner) */}
      {showBanner && (
        <div className="h-9 px-4 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-800/40 text-[12px] text-cyan-200 flex items-center justify-between">
          <div className="max-w-7xl mx-auto flex items-center gap-2 truncate">
            <span className="font-bold text-white">{storeSettings.storeName}:</span>
            <span>{storeSettings.announcementBanner}</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-cyan-400 hover:text-white p-1 shrink-0"
            title="إغلاق الإشعار"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header adhering to 3-zone contract with Owner Authentication */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        compareCount={compareItems.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        activeCategory={activeCategory}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onOpenAdmin={handleOpenAdminClick}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        ownerUsername={ownerUsername}
        onScrollToStoreInfo={() => {
          const el = document.getElementById('store-info');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <Hero
        settings={storeSettings}
        onExploreClick={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onLaptopsClick={() => {
          setActiveCategory('laptops');
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Catalog & Filter Section */}
      <main id="catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        
        {/* Owner View Notice if logged in */}
        {isOwnerLoggedIn && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-center justify-between text-xs text-cyan-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">وضع مالك المتجر نشط:</span>
              <span>يمكنك الآن التحكم بالمنتجات، وتعديل الأسعار والعنوان من لوحة المالك.</span>
            </div>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors text-xs"
            >
              فتح لوحة التحكم
            </button>
          </div>
        )}

        {/* Section Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <span>كتالوج الأجهزة والعتاد الفني</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono-numbers">{filteredProducts.length} منتج معروض</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              تصفح المواصفات والأسعار المحدثة
            </h2>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم، المعالج، السنسور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs & Interactive Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            
            {/* Functional Category Filter Segmented Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as ProductCategory)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Brand and Stock Filters */}
            <div className="flex items-center gap-3 text-xs">
              {/* Brand select */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">الماركة:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs"
                >
                  <option value="all">الكل</option>
                  {brandsList.filter((b) => b !== 'all').map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* In-stock toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>المتوفر بالمحل فقط</span>
              </label>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 text-xs font-mono-numbers"
              >
                <option value="featured">الأبرز أولاً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

          </div>

          {/* Comparison floating banner if items are selected */}
          {compareItems.length > 0 && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-200">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>
                  تم اختيار <strong className="text-white font-mono-numbers">{compareItems.length}</strong> أجهزة للمقارنة:
                </span>
                <span className="text-slate-300 truncate max-w-sm">
                  {compareItems.map((p) => p.name).join(' ، ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  عرض جدول المقارنة
                </button>
                <button
                  onClick={() => setCompareItems([])}
                  className="text-slate-400 hover:text-white px-2 py-1"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3-Column Desktop Grid for Featured Products */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">لم يتم العثور على أجهزة مطابقة للبحث</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جرب تغيير كلمات البحث أو مسح الفلاتر لعرض كافة المنتجات المتوفرة في {storeSettings.storeName}.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('all');
                setOnlyInStock(false);
                setActiveCategory('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                {product.hidden && isOwnerLoggedIn && (
                  <div className="absolute top-2 left-2 z-10 bg-amber-500/90 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    <span>مخفي عن الزوار</span>
                  </div>
                )}
                <ProductCard
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={compareItems.some((c) => c.id === product.id)}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Store Location, Hours, and Warranty Section */}
      <StoreInfoSection settings={storeSettings} />

      {/* Quiet Clean Footer */}
      <Footer
        settings={storeSettings}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onOpenAdmin={handleOpenAdminClick}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Product Details Sheet Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedProduct ? compareItems.some((c) => c.id === selectedProduct.id) : false}
        onDirectOrderWhatsApp={handleDirectOrderWhatsApp}
        onAddReview={handleAddReview}
        settings={storeSettings}
      />

      {/* Product Comparison Modal */}
      {isCompareOpen && (
        <ProductCompareModal
          products={compareItems}
          onClose={() => setIsCompareOpen(false)}
          onRemove={handleRemoveFromCompare}
          onAddToCart={(p) => {
            handleAddToCart(p, 1);
            setIsCompareOpen(false);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onSubmitOrder={handleSubmitOrder}
        settings={storeSettings}
      />

      {/* Store Manager / Admin Drawer */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        storeSettings={storeSettings}
        onUpdateStoreSettings={setStoreSettings}
        onAddProduct={handleAddProduct}
        onToggleStock={handleToggleStock}
        onToggleHideProduct={handleToggleHideProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdatePrice={handleUpdatePrice}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        ownerUsername={ownerUsername}
        onLogout={handleLogout}
        onChangePassword={handleChangePassword}
      />

      {/* Owner Authentication Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentOwnerPassword={ownerPassword}
      />

    </div>
  );
}
