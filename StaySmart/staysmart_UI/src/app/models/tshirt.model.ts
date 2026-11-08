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
  unitPrice: number;
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
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  orderedAt: string;
}

export interface OrderCheckoutPayload {
  customerName: string;
  mobile: string;
  email: string;
  orderType: OrderEntryType;
  itemCount: number;
  orderUniqueId: string;
  totalPrice: number;
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
  userId: string;
  userSkSeq?: number | null;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status?: string;
}

export interface UserLoginRequest {
  userId: string;
  password: string;
}

export interface UserRegistrationRequest {
  userName: string;
  userEmail: string;
  phone: string;
  address: string;
  userId: string;
  password: string;
}

export interface UserSheetRegistrationRow {
  ID: string;
  User_Name: string;
  User_Email: string;
  Phone: string;
  Address: string;
  UserId: string;
  Password: string;
  Status: string;
  Create_date: string;
}

export interface UserRegistrationPayload extends UserRegistrationRequest, UserSheetRegistrationRow {}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export interface CustomerOrderRecord {
  id?: number | string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  quantity: number;
  totalPrice: number | string;
  status: string;
  createdAt?: string;
}

export interface LoggedInUser {
  userId: string;
  userSkSeq?: number | null;
  userName: string;
  userEmail: string;
  phone: string;
  address: string;
  status: string;
}

export interface UserLoginResponse {
  success: boolean;
  message: string;
  user: LoggedInUser;
}

export interface UserRegistrationResponse {
  success: boolean;
  message: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string | null;
  message: string;
  errorCode?: string | null;
  rootCause?: string | null;
  timestamp?: string;
}
