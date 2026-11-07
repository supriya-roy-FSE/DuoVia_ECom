import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminDataService } from '../../services/admin-data.service';
import { AdminReview } from '../../models/admin.models';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReviewsComponent {
  private readonly authService = inject(AdminAuthService);
  private readonly adminDataService = inject(AdminDataService);

  readonly search = signal('');
  readonly filter = signal<'all' | AdminReview['status']>('all');
  readonly reviews = this.adminDataService.getReviews();

  readonly filteredReviews = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.filter();

    return this.reviews.filter(review => {
      const matchesText = !term ||
        review.customerName.toLowerCase().includes(term) ||
        review.productName.toLowerCase().includes(term) ||
        review.email.toLowerCase().includes(term) ||
        review.reviewText.toLowerCase().includes(term);

      const matchesStatus = status === 'all' || review.status === status;
      return matchesText && matchesStatus;
    });
  });

  readonly statuses: Array<'all' | AdminReview['status']> = ['all', 'pending', 'approved', 'rejected'];

  logout(): void {
    this.authService.logout();
  }

  approve(review: AdminReview): void {
    this.adminDataService.updateReviewStatus(review.reviewId, 'approved');
  }

  reject(review: AdminReview): void {
    this.adminDataService.updateReviewStatus(review.reviewId, 'rejected');
  }
}
