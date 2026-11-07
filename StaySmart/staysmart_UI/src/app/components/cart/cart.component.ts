import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-shell">
      <div class="page-head">
        <div>
          <p class="eyebrow">Shopping bag</p>
          <h2>Your Cart</h2>
        </div>
        <a routerLink="/" class="link-btn">Continue shopping</a>
      </div>

      @if (items().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🛍️</div>
          <h3>Your cart is empty</h3>
          <p>Add a few statement pieces and they’ll appear here for checkout.</p>
          <a routerLink="/" class="primary-btn ghost-btn">Browse collection</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-list">
            @for (item of items(); track item.itemUniqueId) {
              <div class="cart-item">
                <img [src]="item.imageUrl" [alt]="item.productName" />

                <div class="meta">
                  <h3>{{ item.productName }}</h3>
                  <p>Size: {{ item.size }}</p>
                  <p>Price: ₹{{ item.unitPrice.toLocaleString('en-IN') }}</p>
                </div>

                <div class="controls">
                  <button type="button" (click)="decrease(item.itemUniqueId)" aria-label="Decrease quantity">-</button>
                  <span>{{ item.quantity }}</span>
                  <button type="button" (click)="increase(item.itemUniqueId)" aria-label="Increase quantity">+</button>
                </div>

                <button type="button" class="remove-btn" (click)="remove(item.itemUniqueId)">Remove</button>
              </div>
            }
          </div>

          <aside class="summary-box">
            <h3>Order Summary</h3>
            <div class="row"><span>Items</span><strong>{{ totalItems() }}</strong></div>
            <div class="row"><span>Subtotal</span><strong>₹{{ subtotal().toLocaleString('en-IN') }}</strong></div>
            <div class="row total-row"><span>Total</span><strong>₹{{ subtotal().toLocaleString('en-IN') }}</strong></div>
            @if (authService.isLoggedIn()) {
              <button type="button" class="primary-btn" (click)="checkout()">Checkout</button>
            } @else {
              <a routerLink="/login" class="primary-btn login-link">Login to checkout</a>
            }
          </aside>
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

      .cart-layout {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 24px;
      }

      .cart-list {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .cart-item {
        display: grid;
        grid-template-columns: 110px 1fr auto auto;
        gap: 14px;
        align-items: center;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #e5e7eb;
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
      }

      .cart-item img {
        width: 110px;
        height: 110px;
        object-fit: cover;
        border-radius: 14px;
      }

      .meta h3 {
        margin: 0 0 8px;
        font-size: 1.15rem;
        color: #111827;
      }

      .meta p {
        margin: 4px 0;
        color: #4b5563;
      }

      .controls {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #f3f4f6;
        border-radius: 999px;
        padding: 6px 8px;
      }

      .controls button,
      .remove-btn,
      .primary-btn {
        border: none;
        border-radius: 10px;
        background: #111827;
        color: #fff;
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 700;
      }

      .controls button {
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .controls span {
        min-width: 22px;
        text-align: center;
        font-weight: 700;
        color: #111827;
      }

      .remove-btn {
        background: #e5e7eb;
        color: #111827;
      }

      .summary-box {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid #e5e7eb;
        border-radius: 22px;
        padding: 24px 22px;
        height: max-content;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
      }

      .summary-box h3 {
        margin-top: 0;
        margin-bottom: 18px;
        font-size: 1.5rem;
      }

      .row {
        display: flex;
        justify-content: space-between;
        margin: 12px 0;
        color: #374151;
      }

      .total-row {
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        font-size: 1.1rem;
        color: #111827;
      }

      .primary-btn,
      .login-link {
        display: inline-block;
        width: 100%;
        text-align: center;
        text-decoration: none;
        margin-top: 18px;
        font-size: 0.98rem;
      }

      .login-link {
        background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
        color: #111827;
      }

      @media (max-width: 860px) {
        .cart-layout {
          grid-template-columns: 1fr;
        }

        .cart-item {
          grid-template-columns: 90px 1fr;
        }

        .controls {
          grid-column: 2;
          justify-self: start;
        }

        .remove-btn {
          grid-column: 2;
          justify-self: start;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);

  readonly items = computed(() => this.cartService.getCartItems());
  readonly totalItems = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));

  increase(itemId: string): void {
    const current = this.cartService.getCartItems().find(item => item.itemUniqueId === itemId);
    if (current) {
      this.cartService.updateCartQuantity(itemId, current.quantity + 1);
    }
  }

  decrease(itemId: string): void {
    const current = this.cartService.getCartItems().find(item => item.itemUniqueId === itemId);
    if (current) {
      this.cartService.updateCartQuantity(itemId, current.quantity - 1);
    }
  }

  remove(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  checkout(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    const payload = this.cartService.createCheckoutPayload(user.name, user.phone, user.email);
    if (!payload.rows.length) {
      return;
    }

    this.cartService.submitCheckout(payload).subscribe({
      next: response => {
        if (response.success) {
          this.cartService.clearCart();
          window.alert(`${response.message}${response.orderId ? ` Order ID: ${response.orderId}` : ''}`);
        } else {
          window.alert(response.message || 'Unable to place order.');
        }
      },
      error: () => window.alert('Unable to place order right now.')
    });
  }
}
