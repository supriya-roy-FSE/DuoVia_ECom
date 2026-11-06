export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ReviewCategory = 'men' | 'women' | 'kids';

export interface CustomerReview {
  reviewId: string;
  customerName: string;
  email: string;
  mobile: string;
  productId: string;
  productName: string;
  productCategory: ReviewCategory;
  size: string;
  rating: number;
  reviewText: string;
  photoUrl: string;
  submittedAt: string;
  status: ReviewStatus;
  discountCode?: string;
  discountAmount?: number;
  discountExpiry?: string;
  publishOnHome: boolean;
  homeOrder: number;
}

export interface ReviewSubmission {
  customerName: string;
  email: string;
  mobile: string;
  productId: string;
  productName: string;
  productCategory: ReviewCategory;
  size: string;
  rating: number;
  reviewText: string;
  photoUrl?: string;
  submittedAt?: string;
}

export interface ReviewSubmissionResponse {
  success: boolean;
  message: string;
  reviewId: string;
  discountCode?: string;
  discountAmount?: number;
}
