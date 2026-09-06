import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TShirtProduct } from '../../models/tshirt.model';
import { ProductService, Category } from '../../services/product.service';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  // Current category from route
  category = signal<Category | null>(null);
  
  // Search and filter signals
  searchQuery = signal<string>('');
  selectedSort = signal<'price-asc' | 'price-desc' | 'newest'>('newest');

  // Compute filtered and sorted products
  allProducts = computed(() => {
    const cat = this.category();
    if (!cat) return [];
    return this.productService.getProductsByCategory(cat);
  });

  filteredProducts = computed(() => {
    const products = this.allProducts();
    const query = this.searchQuery().toLowerCase();

    if (!query) return products;

    return products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  sortedProducts = computed(() => {
    const products = [...this.filteredProducts()];
    const sortBy = this.selectedSort();

    switch (sortBy) {
      case 'price-asc':
        return products.sort((a, b) => a.basePrice - b.basePrice);
      case 'price-desc':
        return products.sort((a, b) => b.basePrice - a.basePrice);
      case 'newest':
      default:
        return products;
    }
  });

  resultsCount = computed(() => this.sortedProducts().length);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const cat = params['category'] as string;
      if (cat && this.productService.isValidCategory(cat)) {
        this.category.set(cat);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  selectProduct(product: TShirtProduct): void {
    this.router.navigate(['/products', this.category(), product.id]);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onSortChange(sort: 'price-asc' | 'price-desc' | 'newest'): void {
    this.selectedSort.set(sort);
  }

  handleSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onSortChange(target.value as 'price-asc' | 'price-desc' | 'newest');
  }

  formatPrice(price: number): string {
    return 'â‚¹' + price.toLocaleString('en-IN');
  }

  getCategoryLabel(): string {
    const labels: Record<Category, string> = {
      men: 'Men\'s Collection',
      women: 'Women\'s Collection',
      kids: 'Kids\' Collection'
    };
    return labels[this.category() || 'men'];
  }
}
