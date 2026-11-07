import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAnalyticsComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly adminDataService = inject(AdminDataService);

  readonly orders = this.adminDataService.getOrders();
  readonly reviews = this.adminDataService.getReviews();

  readonly totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  readonly totalOrders = this.orders.length;
  readonly approvalRate = Math.round((this.reviews.filter(review => review.status === 'approved').length / this.reviews.length) * 100);

  readonly categorySummary = [
    { label: 'Men', value: this.orders.filter(order => order.items.some(item => item.category === 'men')).length },
    { label: 'Women', value: this.orders.filter(order => order.items.some(item => item.category === 'women')).length },
    { label: 'Kids', value: this.orders.filter(order => order.items.some(item => item.category === 'kids')).length }
  ];

  logout(): void {
    this.authService.logout();
  }
}
