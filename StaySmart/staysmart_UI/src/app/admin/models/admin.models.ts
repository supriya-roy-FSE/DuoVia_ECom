export type AdminOrderStatus = 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type AdminReviewStatus = 'pending' | 'approved' | 'rejected';
export type AdminOrderType = 'cart' | 'wishlist' | 'checkout';

export interface AdminOrderItem {
  itemUniqueId: string;
  productId: string;
  productName: string;
  category: 'men' | 'women' | 'kids';
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  imageUrl: string;
  quantity: number;
  amount: number;
  status: AdminOrderStatus;
}

export interface AdminOrder {
  orderUniqueId: string;
  customerName: string;
  mobile: string;
  email: string;
  orderType: AdminOrderType;
  createdAt: string;
  status: AdminOrderStatus;
  itemCount: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  items: AdminOrderItem[];
}

export interface AdminReview {
  reviewId: string;
  customerName: string;
  email: string;
  mobile: string;
  productId: string;
  productName: string;
  productCategory: 'men' | 'women' | 'kids';
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  rating: number;
  reviewText: string;
  photoUrl: string;
  submittedAt: string;
  status: AdminReviewStatus;
  publishOnHome: boolean;
  discountCode?: string;
  discountAmount?: number;
}

export interface AdminBarMetric {
  label: string;
  value: number;
}
