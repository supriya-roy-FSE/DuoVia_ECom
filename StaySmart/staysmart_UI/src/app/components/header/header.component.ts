import { Component, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

/**
 * Global site header
 * Displays only the DuoVia Styles logo (top-right, links home) and a
 * live wishlist counter. Rendered once in the app shell so it appears
 * consistently across every route.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  readonly logoPath = 'data/resources/Image/logo/Duovia_Styles_logo.jpg';
  readonly wishlistCount = computed(() => this.wishlistService.wishlisted().length);
  readonly cartCount = computed(() => this.cartService.getCartCount());
  readonly currentUser = this.authService.currentUser;

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
