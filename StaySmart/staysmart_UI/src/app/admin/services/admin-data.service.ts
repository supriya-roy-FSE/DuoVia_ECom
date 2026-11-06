import { Injectable } from '@angular/core';
import { AdminOrder, AdminReview } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly orders: AdminOrder[] = [
    {
      orderUniqueId: 'ORD-1001',
      customerName: 'Aarav S.',
      mobile: '+91 98989 11223',
      email: 'aarav@example.com',
      orderType: 'checkout',
      createdAt: '2026-11-05T10:30:00Z',
      status: 'shipped',
      itemCount: 2,
      totalAmount: 2890,
      paymentStatus: 'paid',
      items: [
        {
          itemUniqueId: 'ITM-1001',
          productId: 'TS-MEN-001',
          productName: 'Classic Black Crew Neck',
          category: 'men',
          size: 'M',
          imageUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
          quantity: 1,
          amount: 1290,
          status: 'shipped'
        },
        {
          itemUniqueId: 'ITM-1002',
          productId: 'TS-WOM-003',
          productName: 'Empowerment Graphic Tee',
          category: 'women',
          size: 'S',
          imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
          quantity: 1,
          amount: 1600,
          status: 'shipped'
        }
      ]
    },
    {
      orderUniqueId: 'ORD-1002',
      customerName: 'Nisha P.',
      mobile: '+91 98765 44321',
      email: 'nisha@example.com',
      orderType: 'wishlist',
      createdAt: '2026-11-04T08:45:00Z',
      status: 'packed',
      itemCount: 1,
      totalAmount: 1199,
      paymentStatus: 'paid',
      items: [
        {
          itemUniqueId: 'ITM-2001',
          productId: 'TS-WOM-001',
          productName: 'Fitted Pastel Pink',
          category: 'women',
          size: 'M',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
          quantity: 1,
          amount: 1199,
          status: 'packed'
        }
      ]
    },
    {
      orderUniqueId: 'ORD-1003',
      customerName: 'Rohan K.',
      mobile: '+91 99887 66554',
      email: 'rohan@example.com',
      orderType: 'cart',
      createdAt: '2026-11-03T16:20:00Z',
      status: 'confirmed',
      itemCount: 3,
      totalAmount: 3450,
      paymentStatus: 'pending',
      items: [
        {
          itemUniqueId: 'ITM-3001',
          productId: 'TS-KID-002',
          productName: 'Adventure Animal Prints',
          category: 'kids',
          size: 'L',
          imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
          quantity: 2,
          amount: 1800,
          status: 'confirmed'
        },
        {
          itemUniqueId: 'ITM-3002',
          productId: 'TS-MEN-002',
          productName: 'Monochrome Street Tee',
          category: 'men',
          size: 'XL',
          imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
          quantity: 1,
          amount: 1650,
          status: 'confirmed'
        }
      ]
    },
    {
      orderUniqueId: 'ORD-1004',
      customerName: 'Meher D.',
      mobile: '+91 98100 55334',
      email: 'meher@example.com',
      orderType: 'checkout',
      createdAt: '2026-11-02T13:00:00Z',
      status: 'delivered',
      itemCount: 1,
      totalAmount: 1490,
      paymentStatus: 'paid',
      items: [
        {
          itemUniqueId: 'ITM-4001',
          productId: 'TS-WOM-002',
          productName: 'Minimal Floral Oversized',
          category: 'women',
          size: 'L',
          imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
          quantity: 1,
          amount: 1490,
          status: 'delivered'
        }
      ]
    }
  ];

  private readonly reviews: AdminReview[] = [
    {
      reviewId: 'REV-101',
      customerName: 'Aarav S.',
      email: 'aarav@example.com',
      mobile: '+91 98989 11223',
      productId: 'TS-MEN-001',
      productName: 'Classic Black Crew Neck',
      productCategory: 'men',
      size: 'M',
      rating: 5,
      reviewText: 'The fabric is premium, the fit is right, and the quality feels much better than most brands in this price range.',
      photoUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      submittedAt: '2026-11-05T09:10:00Z',
      status: 'pending',
      publishOnHome: false
    },
    {
      reviewId: 'REV-102',
      customerName: 'Nisha P.',
      email: 'nisha@example.com',
      mobile: '+91 98765 44321',
      productId: 'TS-WOM-003',
      productName: 'Empowerment Graphic Tee',
      productCategory: 'women',
      size: 'S',
      rating: 5,
      reviewText: 'The print quality is excellent and the shirt feels very comfortable all day long. Definitely ordering again.',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      submittedAt: '2026-11-04T15:25:00Z',
      status: 'approved',
      publishOnHome: true,
      discountCode: 'LOVE5-2026',
      discountAmount: 5
    },
    {
      reviewId: 'REV-103',
      customerName: 'Rohan K.',
      email: 'rohan@example.com',
      mobile: '+91 99887 66554',
      productId: 'TS-KID-002',
      productName: 'Adventure Animal Prints',
      productCategory: 'kids',
      size: 'L',
      rating: 4,
      reviewText: 'My son loves the design and it is very soft to wear during the day. Great for casual use.',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      submittedAt: '2026-11-03T18:40:00Z',
      status: 'rejected',
      publishOnHome: false
    }
  ];

  getOrders(): AdminOrder[] {
    return this.orders;
  }

  getReviews(): AdminReview[] {
    return this.reviews;
  }

  updateReviewStatus(reviewId: string, status: AdminReview['status']): void {
    const review = this.reviews.find(item => item.reviewId === reviewId);
    if (!review) {
      return;
    }

    review.status = status;
    review.publishOnHome = status === 'approved';

    if (status === 'approved') {
      review.discountCode = 'LOVE5-2026';
      review.discountAmount = 5;
    }
  }
}
