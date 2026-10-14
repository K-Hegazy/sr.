import React from 'react';
import { ShoppingBag, Scale, SlidersHorizontal, Lock, UserCheck } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  activeCategory: ProductCategory;
  isOwnerLoggedIn: boolean;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  ownerUsername?: string;
  onScrollToStoreInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  compareCount,
  onOpenCompare,
  onSelectCategory,
  activeCategory,
  isOwnerLoggedIn,
  onOpenAdmin,
  onOpenLogin,
  ownerUsername,
  onScrollToStoreInfo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base group-hover:border-cyan-400 group-hover:bg-cyan-500/20 transition-all font-mono-numbers">
            SR
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            SR. Technology
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('all')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'all' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            كل المنتجات
          </button>
          <button
            onClick={() => onSelectCategory('laptops')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'laptops' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            أجهزة اللابتوب
          </button>
          <button
            onClick={() => onSelectCategory('mice')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'mice' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            الماوسات الاحترافية
          </button>
          <button
            onClick={() => onSelectCategory('keyboards')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeCategory === 'keyboards' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
            }`}
          >
            لوحات المفاتيح
          </button>
          <button
            onClick={onScrollToStoreInfo}
            className="hover:text-white text-slate-400 transition-colors whitespace-nowrap shrink-0"
          >
            مقر المحل والضمان
          </button>
        </nav>

        {/* Zone 3: Primary action cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Comparison button */}
          <button
            onClick={onOpenCompare}
            title="مقارنة المواصفات"
            className="relative p-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-[#0b0f17] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono-numbers">
                {compareCount}
              </span>
            )}
          </button>

          {/* Owner Login / Admin panel button */}
          {isOwnerLoggedIn ? (
            <button
              onClick={onOpenAdmin}
              title="لوحة تحكم مالك المتجر"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 rounded-lg border border-cyan-800/60 transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">لوحة المالك</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              title="تسجيل دخول مالك المحل فقط"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>دخول المالك</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0b0f17] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>السلة والطلب</span>
            {cartCount > 0 && (
              <span className="bg-[#0b0f17] text-cyan-300 text-xs px-1.5 py-0.2 rounded font-mono-numbers font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
