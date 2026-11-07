import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-shell">
      <div class="page-head">
        <div>
          <p class="eyebrow">Saved items</p>
          <h2>Wishlist</h2>
        </div>
        <a routerLink="/" class="link-btn">Continue shopping</a>
      </div>

      @if (items().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">♡</div>
          <h3>Your wishlist is empty</h3>
          <p>Save styles you love and revisit them later from here.</p>
          <a routerLink="/" class="primary-btn ghost-btn">Explore styles</a>
        </div>
      } @else {
        <div class="wishlist-grid">
          @for (item of items(); track item.itemUniqueId) {
            <div class="wishlist-card">
              <img [src]="item.imageUrl" [alt]="item.productName" />

              <div class="info">
                <h3>{{ item.productName }}</h3>
                <p>Size: {{ item.size }}</p>
                <p class="price">₹{{ item.unitPrice.toLocaleString('en-IN') }}</p>
              </div>

              <div class="card-actions">
                <a class="primary-btn secondary-btn" routerLink="/">Add to cart</a>
                <button type="button" class="remove-btn" (click)="remove(item.itemUniqueId)">Remove</button>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .page-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 20px 52px;
      }

      .page-head {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 16px;
        margin-bottom: 24px;
      }

      .eyebrow {
        margin: 0 0 8px;
        color: #f59e0b;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
        font-weight: 800;
      }

      h2 {
        margin: 0;
        font-size: clamp(2rem, 3vw, 2.8rem);
        color: #111827;
      }

      .link-btn {
        color: #111827;
        font-weight: 800;
        text-decoration: none;
      }

      .empty-state {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        padding: 48px 32px;
        text-align: center;
        box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
      }

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 10px;
      }

      .empty-state h3 {
        margin: 0 0 10px;
        font-size: 1.8rem;
        color: #111827;
      }

      .empty-state p {
        margin: 0;
        color: #4b5563;
      }

      .ghost-btn {
        display: inline-block;
        width: auto;
        margin-top: 20px;
      }

      .wishlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 20px;
      }

      .wishlist-card {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
      }

      .wishlist-card img {
        width: 100%;
        height: 240px;
        object-fit: cover;
        border-radius: 14px;
      }

      .info {
        margin-top: 16px;
      }

      .info h3 {
        margin: 0 0 8px;
        color: #111827;
        font-size: 1.15rem;
      }

      .info p {
        margin: 6px 0;
        color: #4b5563;
      }

      .price {
        color: #111827 !important;
        font-weight: 800;
      }

      .card-actions {
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }

      .primary-btn,
      .remove-btn {
        border: none;
        border-radius: 10px;
        padding: 10px 12px;
        font-weight: 700;
        cursor: pointer;
      }

      .secondary-btn {
        background: #111827;
        color: #fff;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }

      .remove-btn {
        background: #e5e7eb;
        color: #111827;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);

  readonly items = computed(() => this.wishlistService.getWishlistItems());

  remove(itemId: string): void {
    const filtered = this.items().filter(item => item.itemUniqueId !== itemId);
    this.wishlistService.wishlisted.set(filtered);
    localStorage.setItem('user_wishlist', JSON.stringify(filtered));
  }
}
