import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminDataService } from '../../services/admin-data.service';
import { AdminOrder, AdminOrderStatus } from '../../models/admin.models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrdersComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly adminDataService = inject(AdminDataService);

  readonly search = signal('');
  readonly selectedStatus = signal<'all' | AdminOrderStatus>('all');
  readonly orders = this.adminDataService.getOrders();

  readonly filteredOrders = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.selectedStatus();

    return this.orders.filter(order => {
      const matchesText = !term ||
        order.orderUniqueId.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.mobile.toLowerCase().includes(term) ||
        order.items.some(item => item.productName.toLowerCase().includes(term));

      const matchesStatus = status === 'all' || order.status === status;
      return matchesText && matchesStatus;
    });
  });

  readonly statuses: Array<'all' | AdminOrderStatus> = ['all', 'new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

  logout(): void {
    this.authService.logout();
  }

  getStatusLabel(status: AdminOrderStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
