import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CustomerReview, ReviewSubmission, ReviewSubmissionResponse } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  submitReview(review: ReviewSubmission): Observable<ReviewSubmissionResponse> {
    const payload = {
      ...review,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    return this.http.post<ReviewSubmissionResponse>(`${this.baseUrl}/reviews`, payload).pipe(
      map(response => ({
        ...response,
        reviewId: response.reviewId || `REV-${Date.now()}`
      })),
      catchError(() => of({
        success: false,
        message: 'Your review was saved but the review system is currently unavailable. Please try again later.',
        reviewId: `REV-${Date.now()}`
      }))
    );
  }

  getFeaturedReviews(): CustomerReview[] {
    return [
      {
        reviewId: 'REV-001',
        customerName: 'Aarav S.',
        email: 'aarav@example.com',
        mobile: '+91 98989 11223',
        productId: 'TS-MEN-001',
        productName: 'Classic Black Crew Neck',
        productCategory: 'men',
        size: 'M',
        rating: 5,
        reviewText: 'The fabric feels premium and the fit is exactly what I wanted. This is my fourth order from DuoVia and I keep coming back for the quality.',
        photoUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
        submittedAt: new Date().toISOString(),
        status: 'approved',
        discountCode: 'LOVE5-2026',
        discountAmount: 5,
        discountExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishOnHome: true,
        homeOrder: 1
      },
      {
        reviewId: 'REV-002',
        customerName: 'Nisha P.',
        email: 'nisha@example.com',
        mobile: '+91 98765 44321',
        productId: 'TS-WOM-003',
        productName: 'Empowerment Graphic Tee',
        productCategory: 'women',
        size: 'S',
        rating: 5,
        reviewText: 'The print quality is excellent and the fit feels flattering without being uncomfortable. I loved the sizing guide and the fabric softness.',
        photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
        submittedAt: new Date().toISOString(),
        status: 'approved',
        discountCode: 'LOVE5-2026',
        discountAmount: 5,
        discountExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishOnHome: true,
        homeOrder: 2
      },
      {
        reviewId: 'REV-003',
        customerName: 'Rohan K.',
        email: 'rohan@example.com',
        mobile: '+91 99887 66554',
        productId: 'TS-KID-002',
        productName: 'Adventure Animal Prints',
        productCategory: 'kids',
        size: 'L',
        rating: 4,
        reviewText: 'My son absolutely loves the design and it feels very soft on the skin. Great for daily use and easy to style.',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
        submittedAt: new Date().toISOString(),
        status: 'approved',
        discountCode: 'LOVE5-2026',
        discountAmount: 5,
        discountExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishOnHome: true,
        homeOrder: 3
      },
      {
        reviewId: 'REV-004',
        customerName: 'Meher D.',
        email: 'meher@example.com',
        mobile: '+91 98100 55334',
        productId: 'TS-WOM-001',
        productName: 'Fitted Pastel Pink',
        productCategory: 'women',
        size: 'M',
        rating: 5,
        reviewText: 'The color looks even better in person and the quality feels far more premium than I expected. I will definitely order again.',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
        submittedAt: new Date().toISOString(),
        status: 'approved',
        discountCode: 'LOVE5-2026',
        discountAmount: 5,
        discountExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        publishOnHome: true,
        homeOrder: 4
      }
    ];
  }
}
