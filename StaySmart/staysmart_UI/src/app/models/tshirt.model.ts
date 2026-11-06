/**
 * T-Shirt Product Model
 * Represents a single DTF apparel product with gallery and metadata
 */
export interface TShirtProduct {
  id: string;
  name: string;
  sku: string;
  category?: 'men' | 'women' | 'kids';
  uploadDate?: string;
  fabricSpecs: string;
  description: string;
  basePrice: number;
  thumbnailImages: string[];
  mainImageUrl: string;
  sizeOptions: Size[];
  tags: string[];
}

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProductCategory = 'men' | 'women' | 'kids';
export type OrderEntryType = 'cart' | 'wishlist' | 'checkout';

export interface ProductSelectionItem {
  itemUniqueId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  size: Size;
  imageUrl: string;
  quantity: number;
  orderType: 'cart' | 'wishlist';
  addedAt: string;
}

export interface OrderSheetRow {
  customerName: string;
  mobile: string;
  email: string;
  orderType: OrderEntryType;
  itemCount: number;
  orderUniqueId: string;
  itemUniqueId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  size: Size;
  imageUrl: string;
  orderedAt: string;
}

export interface OrderCheckoutPayload {
  customerName: string;
  mobile: string;
  email: string;
  orderType: OrderEntryType;
  itemCount: number;
  orderUniqueId: string;
  rows: OrderSheetRow[];
}

export interface ImageCatalogEntry {
  imageId: string;
  productId: string;
  productCategory: 'men' | 'women' | 'kids';
  imageName: string;
  imageDescription: string;
  path: string;
  isPrimary?: boolean;
}

export interface ProductCatalogEntry {
  productName: string;
  id: string;
  category: 'men' | 'women' | 'kids';
  size: Size[];
  uploadDate: string;
  price: number;
  imageFolderPath: string;
}

export interface FolderImageManifest {
  images: string[];
}

export interface ImageCatalogPayload {
  products?: ProductCatalogEntry[];
}

/**
 * Order inquiry payload sent to Google Apps Script webhook
 */
export interface OrderInquiry {
  userName: string;
  userEmail: string;
  userPhone: string;
  productId: string;
  productName: string;
  size: Size;
  imageUrl: string;
  timestamp?: string;
}

/**
 * API response from Google Apps Script webhook
 */
export interface OrderInquiryResponse {
  success: boolean;
  referenceCode: string;
  message: string;
  timestamp: string;
}

/**
 * Logged-in user session context
 */
export interface UserSession {
  name: string;
  email: string;
  phone: string;
}
