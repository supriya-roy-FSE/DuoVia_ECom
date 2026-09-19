import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';

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
  readonly logoPath = 'data/resources/Image/logo/Duovia_Styles_logo.jpg';

  readonly wishlistCount = computed(() => this.wishlistService.wishlisted().length);

  constructor(private router: Router, private wishlistService: WishlistService) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}
