export type ProductCategory = 
  | 'all'
  | 'laptops'
  | 'mice'
  | 'keyboards'
  | 'monitors'
  | 'audio'
  | 'accessories';

export interface ProductSpecs {
  // Common / Laptop specs
  processor?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  screen?: string;
  battery?: string;
  weight?: string;
  os?: string;

  // Mouse specs
  sensor?: string;
  dpi?: string;
  connectivity?: string;
  switches?: string;
  pollingRate?: string;
  rgb?: string;

  // Keyboard specs
  switchType?: string;
  layout?: string;
  hotswappable?: string;
  keycaps?: string;
  backlight?: string;

  // Monitor specs
  panel?: string;
  resolution?: string;
  refreshRate?: string;
  responseTime?: string;
  curved?: string;
  ports?: string;

  // Audio specs
  driver?: string;
  frequency?: string;
  microphone?: string;
  spatialAudio?: string;
  
  [key: string]: string | undefined;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Exclude<ProductCategory, 'all'>;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  maxStock?: number;
  isFeatured?: boolean;
  hidden?: boolean;
  badge?: string;
  image: string;
  description: string;
  warranty: string;
  specs: ProductSpecs;
  keySpecsSummary: string[];
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
}

export interface StoreSettings {
  storeName: string;
  arabicName: string;
  phone: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  announcementBanner: string;
}

export interface OwnerAuth {
  isLoggedIn: boolean;
  username: string;
  loginTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  deliveryMethod: 'shipping' | 'pickup';
  paymentMethod: 'cod' | 'vodafone_cash' | 'card';
  notes?: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
}
