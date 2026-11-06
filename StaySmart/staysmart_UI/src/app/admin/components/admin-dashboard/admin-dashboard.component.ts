import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly adminDataService = inject(AdminDataService);

  readonly orders = this.adminDataService.getOrders();
  readonly reviews = this.adminDataService.getReviews();

  readonly totalRevenue = computed(() =>
    this.orders.reduce((sum, order) => sum + order.totalAmount, 0)
  );

  readonly pendingReviews = computed(() =>
    this.reviews.filter(review => review.status === 'pending').length
  );

  readonly approvedReviews = computed(() =>
    this.reviews.filter(review => review.status === 'approved').length
  );

  readonly deliveredOrders = computed(() =>
    this.orders.filter(order => order.status === 'delivered').length
  );

  readonly recentOrders = this.orders.slice(0, 4);

  logout(): void {
    this.authService.logout();
  }
}
