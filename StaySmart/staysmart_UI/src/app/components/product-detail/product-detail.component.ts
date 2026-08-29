import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TShirtProduct, Size, UserSession, OrderInquiry, OrderInquiryResponse } from '../../models/tshirt.model';
import { WishlistService } from '../../services/wishlist.service';
import { InquiryService } from '../../services/inquiry.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'product-detail-host'
  }
})
export class ProductDetailComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly inquiryService = inject(InquiryService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Category from route parameter
  category = signal<string | null>(null);

  // Computed back button label
  backButtonLabel = computed(() => {
    const cat = this.category();
    if (cat) {
      const labels: Record<string, string> = {
        men: "← Back to Men's",
        women: "← Back to Women's",
        kids: "← Back to Kids'"
      };
      return labels[cat] || '← Back';
    }
    return '← Back to Home';
  });

  // ============================================================================
  // SIGNALS: Product State Management
  // ============================================================================
  
  // Current product data
  product = signal<TShirtProduct>({
    id: 'TS-KOL-009',
    sku: 'TS-KOL-009',
    name: 'Oversized Minimalist DTF Graphic Tee',
    fabricSpecs: '240 GSM | 100% Super-Combed Cotton | DTF High-Density Pigment Print',
    description: 'Premium oversized graphic tee with cutting-edge DTF printing technology',
    basePrice: 2499,
    sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['oversized', 'minimalist', 'dtf', 'premium'],
    thumbnailImages: [
      'https://via.placeholder.com/400x400/1a1a2e/f59e0b?text=01',
      'https://via.placeholder.com/400x400/16213e/f59e0b?text=02',
      'https://via.placeholder.com/400x400/0f3460/f59e0b?text=03',
      'https://via.placeholder.com/400x400/533483/f59e0b?text=04',
      'https://via.placeholder.com/400x400/2a2a3e/f59e0b?text=05',
      'https://via.placeholder.com/400x400/1a1a3e/f59e0b?text=06',
      'https://via.placeholder.com/400x400/3a0f5c/f59e0b?text=07',
      'https://via.placeholder.com/400x400/121215/f59e0b?text=08',
      'https://via.placeholder.com/400x400/2e1a47/f59e0b?text=09',
      'https://via.placeholder.com/400x400/1f1f2e/f59e0b?text=10'
    ],
    mainImageUrl: 'https://via.placeholder.com/400x400/1a1a2e/f59e0b?text=01'
  });

  // UI State Signals
  selectedSize = signal<Size>('M');
  selectedImageIndex = signal<number>(0);
  isModalOpen = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  submissionResult = signal<{ success: boolean; message: string; referenceCode?: string } | null>(null);

  // User session (mock data - in production, fetch from auth service)
  userSession = signal<UserSession>({
    name: 'Supriya Roy',
    email: 'customer@example.com',
    phone: '+91 98300XXXXX'
  });

  // ============================================================================
  // COMPUTED: Derived State
  // ============================================================================

  currentImageUrl = computed(() => {
    const images = this.product().thumbnailImages;
    return images[this.selectedImageIndex()] || this.product().mainImageUrl;
  });

  isCurrentProductWishlisted = computed(() => {
    return this.wishlistService.isWishlisted(this.product().id);
  });

  wishlistButtonLabel = computed(() => {
    return this.isCurrentProductWishlisted() ? '💖 WISHLISTED' : '♡ WISHLIST';
  });

  getCurrentThumbnailIndex = computed(() => this.selectedImageIndex());

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================

  ngOnInit(): void {
    // Set initial main image from thumbnails
    this.selectedImageIndex.set(0);

    // Read category and productId from route parameters
    this.route.params.subscribe(params => {
      const cat = params['category'] as string;
      const productId = params['productId'] as string;

      if (cat) {
        this.category.set(cat);
      }

      if (cat && productId && this.productService.isValidCategory(cat)) {
        const found = this.productService.getProductById(cat, productId);
        if (found) {
          this.product.set(found);
          this.selectedImageIndex.set(0);
        } else {
          // Product not found — redirect back to listing
          this.router.navigate(['/products', cat]);
        }
      }
    });
  }

  // ============================================================================
  // USER INTERACTION HANDLERS
  // ============================================================================

  /**
   * Select a thumbnail and update main preview
   */
  selectThumbnail(index: number): void {
    this.selectedImageIndex.set(index);
  }

  /**
   * Update selected size
   */
  selectSize(size: Size): void {
    this.selectedSize.set(size);
  }

  /**
   * Toggle wishlist status for current product
   */
  toggleWishlist(): void {
    this.wishlistService.toggleWishlist(this.product().id);
  }

  /**
   * Open the order inquiry modal
   */
  openInquiryModal(): void {
    this.isModalOpen.set(true);
    this.submissionResult.set(null);
  }

  /**
   * Close the order inquiry modal
   */
  closeInquiryModal(): void {
    this.isModalOpen.set(false);
    this.submissionResult.set(null);
    this.isSubmitting.set(false);
  }

  /**
   * Submit order inquiry to Google Sheets webhook
   */
  submitOrderInquiry(): void {
    this.isSubmitting.set(true);

    const inquiry: OrderInquiry = {
      userName: this.userSession().name,
      userEmail: this.userSession().email,
      userPhone: this.userSession().phone,
      productId: this.product().id,
      productName: this.product().name,
      size: this.selectedSize(),
      imageUrl: this.currentImageUrl()
    };

    this.inquiryService.submitInquiry(inquiry).subscribe({
      next: (response: OrderInquiryResponse) => {
        this.isSubmitting.set(false);
        this.submissionResult.set({
          success: response.success,
          message: response.success
            ? `Order inquiry submitted! Reference: ${response.referenceCode}`
            : response.message,
          referenceCode: response.referenceCode
        });

        // Auto-close modal after 3 seconds on success
        if (response.success) {
          setTimeout(() => {
            this.closeInquiryModal();
          }, 3000);
        }
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.submissionResult.set({
          success: false,
          message: 'Failed to submit inquiry. Please try again later.'
        });
        console.error('Inquiry submission error:', error);
      }
    });
  }

  /**
   * Get index formatted to 2 digits (01, 02, etc.)
   */
  getFormattedIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  /**
   * Check if a size option is currently selected
   */
  isSizeSelected(size: Size): boolean {
    return this.selectedSize() === size;
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  /**
   * Navigate back to product listing or home
   */
  goBack(): void {
    const cat = this.category();
    if (cat) {
      this.router.navigate(['/products', cat]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
