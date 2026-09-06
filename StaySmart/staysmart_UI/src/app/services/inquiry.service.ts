import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { OrderInquiry, OrderInquiryResponse } from '../models/tshirt.model';

/**
 * Inquiry Service
 * Handles order inquiry submissions to Google Apps Script webhook
 */
@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private readonly http = inject(HttpClient);
  
  /**
   * Replace with your actual Google Apps Script webhook URL
   * Format: https://script.google.com/macros/d/{SCRIPT_ID}/usercallback
   */
  private readonly WEBHOOK_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercallback';

  constructor() {}

  /**
   * Submit an order inquiry to the webhook and Google Sheets
   * @param inquiry - The order inquiry data
   * @returns Observable of the API response with reference code
   */
  submitInquiry(inquiry: OrderInquiry): Observable<OrderInquiryResponse> {
    // Add timestamp to inquiry
    const payload: OrderInquiry = {
      ...inquiry,
      timestamp: new Date().toISOString()
    };

    return this.http.post<OrderInquiryResponse>(this.WEBHOOK_URL, payload).pipe(
      map(response => ({
        ...response,
        timestamp: new Date().toISOString()
      })),
      catchError(error => {
        console.error('Inquiry submission failed:', error);
        
        // Fallback response in case of network failure
        // In production, implement proper error handling and retry logic
        return of({
          success: false,
          referenceCode: `ERR-${Date.now()}`,
          message: 'Failed to submit inquiry. Please try again.',
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Generate a mock reference code for testing
   * @returns - A mock order reference code
   */
  generateMockReferenceCode(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`.slice(0, 12);
  }

  /**
   * Check webhook connectivity
   * @returns Observable indicating webhook availability
   */
  checkWebhookStatus(): Observable<boolean> {
    return this.http.get<{ status: string }>(this.WEBHOOK_URL).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
