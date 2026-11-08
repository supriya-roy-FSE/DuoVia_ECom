import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CustomerOrderRecord } from '../../models/tshirt.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-shell">
      <div class="page-head">
        <div>
          <h2>My Orders</h2>
          <p class="subhead">Track your recent purchases and current delivery status.</p>
        </div>
        <a routerLink="/" class="link-btn">Back to home</a>
      </div>

      @if (!authService.isLoggedIn()) {
        <div class="empty-state">
          <p>Please log in to view your orders.</p>
        </div>
      } @else if (isLoading()) {
        <div class="empty-state">
          <p>Loading your orders...</p>
        </div>
      } @else if (missingUserSkSeq()) {
        <div class="empty-state">
          <p>We could not identify your account session. Please log out and log in again.</p>
        </div>
      } @else if (hasFetchError()) {
        <div class="empty-state">
          <p>We could not load your orders right now. Please try again in a moment.</p>
        </div>
      } @else if (orders().length === 0) {
        <div class="empty-state">
          <p>No orders found for this account.</p>
        </div>
      } @else {
        <div class="summary-bar">
          <p><strong>{{ orders().length }}</strong> order(s) found</p>
        </div>

        <div class="orders-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id ?? order.productName) {
                <tr>
                  <td>{{ order.id ?? 'N/A' }}</td>
                  <td>{{ order.productName }}</td>
                  <td>{{ order.quantity }}</td>
                  <td>₹{{ formatAmount(order.totalPrice) }}</td>
                  <td><span class="status-badge" [class.pending]="isPending(order.status)" [class.completed]="isCompleted(order.status)">{{ order.status || 'PENDING' }}</span></td>
                  <td>{{ order.createdAt ? (order.createdAt | date:'mediumDate') : 'N/A' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .page-shell { max-width:1200px; margin:0 auto; padding:32px 20px 50px; }
      .page-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
      h2 { margin:0; font-size:2rem; }
      .subhead { margin:6px 0 0; color:#6b7280; }
      .link-btn { color:#111827; font-weight:700; text-decoration:none; }
      .empty-state { background:#fff; border:1px solid #eee; border-radius:20px; padding:32px; text-align:center; }
      .summary-bar { display:flex; justify-content:flex-end; margin-bottom:12px; color:#374151; }
      .orders-table-wrap { overflow:auto; background:#fff; border:1px solid #eee; border-radius:18px; }
      table { width:100%; border-collapse:collapse; }
      th, td { padding:14px 16px; border-bottom:1px solid #e5e7eb; text-align:left; }
      th { background:#f9fafb; }
      .status-badge { display:inline-block; padding:4px 10px; border-radius:999px; font-size:0.8rem; font-weight:700; background:#f3f4f6; color:#111827; text-transform:uppercase; }
      .status-badge.pending { background:#fff7ed; color:#9a3412; }
      .status-badge.completed { background:#ecfdf5; color:#166534; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyOrdersComponent {
  private readonly http = inject(HttpClient);
  readonly authService = inject(AuthService);
  readonly orders = signal<CustomerOrderRecord[]>([]);
  readonly isLoading = signal(false);
  readonly hasFetchError = signal(false);
  readonly missingUserSkSeq = signal(false);

  constructor() {
    const user = this.authService.getCurrentUser();
    const userSkSeq = user?.userSkSeq ?? null;
    if (this.authService.isLoggedIn() && userSkSeq == null) {
      this.missingUserSkSeq.set(true);
      return;
    }

    if (userSkSeq != null) {
      this.isLoading.set(true);
      this.hasFetchError.set(false);
      this.http.get<CustomerOrderRecord[]>(`http://localhost:8081/api/orders/user/${encodeURIComponent(String(userSkSeq))}`).subscribe({
        next: (data) => {
          this.orders.set(data ?? []);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasFetchError.set(true);
          this.orders.set([]);
          this.isLoading.set(false);
        }
      });
    }
  }

  formatAmount(value: number | string): string {
    const numericValue = typeof value === 'number' ? value : Number.parseFloat(String(value)) || 0;
    return numericValue.toLocaleString('en-IN');
  }

  isPending(status: string | undefined): boolean {
    return (status ?? '').toUpperCase() === 'PENDING';
  }

  isCompleted(status: string | undefined): boolean {
    return (status ?? '').toUpperCase() === 'COMPLETED';
  }
}
