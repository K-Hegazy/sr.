import React, { useState } from 'react';
import { ShoppingBag, Eye, Scale, Check, Laptop, MousePointer, Keyboard, Monitor, Headphones } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleCompare,
  isCompared,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'laptops':
        return <Laptop className="w-8 h-8 text-slate-500" />;
      case 'mice':
        return <MousePointer className="w-8 h-8 text-slate-500" />;
      case 'keyboards':
        return <Keyboard className="w-8 h-8 text-slate-500" />;
      case 'monitors':
        return <Monitor className="w-8 h-8 text-slate-500" />;
      case 'audio':
        return <Headphones className="w-8 h-8 text-slate-500" />;
      default:
        return <Laptop className="w-8 h-8 text-slate-500" />;
    }
  };

  const getCategoryArabic = (cat: string) => {
    switch (cat) {
      case 'laptops': return 'لابتوب';
      case 'mice': return 'ماوس ألعاب';
      case 'keyboards': return 'كيبورد ميكانيكي';
      case 'monitors': return 'شاشة';
      case 'audio': return 'سماعات';
      default: return 'إلكترونيات';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(product);
  };

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Top Image Showcase */}
      <div className="relative w-full aspect-[4/3] bg-[#0d121c] flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900 text-center">
            {getCategoryIcon()}
            <span className="text-xs text-slate-400 mt-2">{product.name}</span>
          </div>
        )}

        {/* Subtle top tag (No colored pill sandwich) */}
        {product.badge && (
          <div className="absolute top-3 right-3 text-[11px] font-medium tracking-wide text-cyan-300 bg-[#0b0f17]/85 backdrop-blur-sm px-2.5 py-1 rounded border border-cyan-500/30">
            {product.badge}
          </div>
        )}

        {/* Compare quick button on image */}
        <button
          onClick={handleToggleCompare}
          title={isCompared ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}
          className={`absolute top-3 left-3 p-1.5 rounded-md text-xs font-medium backdrop-blur-md transition-colors ${
            isCompared
              ? 'bg-cyan-500 text-[#0b0f17] shadow-sm'
              : 'bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Clean unboxed metadata with separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{getCategoryArabic(product.category)}</span>
            <span aria-hidden="true">·</span>
            <span className={product.inStock ? 'text-emerald-400' : 'text-rose-400'}>
              {product.inStock ? `متوفر بالمحل (${product.stockCount})` : 'نفد'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Visual Stock Progress Indicator & Counter */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono-numbers">
              <span className="flex items-center gap-1">
                {product.inStock && product.stockCount > 0 ? (
                  product.stockCount <= 4 ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      متبقي {product.stockCount} قطع فقط!
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      متبقي <strong className="text-emerald-400 font-bold">{product.stockCount}</strong> قطع بالمخزون
                    </span>
                  )
                ) : (
                  <span className="text-rose-400 font-semibold">غير متوفر حالياً</span>
                )}
              </span>

              {/* Star Rating snippet */}
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <span className="text-amber-400 font-bold">★ {product.rating.toFixed(1)}</span>
                <span className="text-slate-500">({product.reviewsCount})</span>
              </span>
            </div>

            {/* Visual Progress Bar Gauge */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  !product.inStock || product.stockCount === 0
                    ? 'w-0 bg-slate-700'
                    : product.stockCount <= 4
                      ? 'bg-gradient-to-r from-amber-500 to-rose-400'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                }`}
                style={{
                  width: `${
                    !product.inStock || product.stockCount === 0
                      ? 0
                      : Math.min(100, Math.max(12, (product.stockCount / (product.maxStock || 15)) * 100))
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Hardware Key Specs Snippet (Clean unboxed tags) */}
          <div className="mt-2.5 pt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-400 font-mono-numbers">
            {product.keySpecsSummary.map((spec, i) => (
              <span key={i} className="text-slate-300 bg-slate-800/70 px-2 py-0.5 rounded text-[11px]">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action Strip */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white font-mono-numbers">
                {product.price.toLocaleString('en-US')}
              </span>
              <span className="text-xs text-cyan-400 font-medium">ج.م</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-500 line-through font-mono-numbers">
                {product.originalPrice.toLocaleString('en-US')} ج.م
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              title="عرض المواصفات الفنية بالتفصيل"
              className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isAdded 
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : product.inStock
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تمت الإضافة</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>أضف للسلة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
