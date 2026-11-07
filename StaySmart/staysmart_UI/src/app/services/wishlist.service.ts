import { Injectable, signal } from '@angular/core';
import { ProductSelectionItem, ProductCategory, Size, TShirtProduct } from '../models/tshirt.model';

/**
 * Wishlist Service
 * Manages local wishlist persistence using Angular Signals with localStorage sync
 */
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'user_wishlist';
  
  // Signal to hold the current wishlist
  wishlisted = signal<ProductSelectionItem[]>(this.loadFromStorage());

  constructor() {}

  /**
   * Load wishlist from localStorage on service initialization
   */
  private loadFromStorage(): ProductSelectionItem[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load wishlist from localStorage:', error);
      return [];
    }
  }

  /**
   * Save wishlist to localStorage whenever it changes
   */
  private saveToStorage(items: ProductSelectionItem[]): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }

  /**
   * Toggle product in wishlist and persist to localStorage
   * @param product - The product to toggle
   * @param size - The size of the product
   * @param imageUrl - The image URL of the product
   * @returns - The toggled product selection item or null if removed
   */
  toggleWishlist(product: TShirtProduct, size: Size, imageUrl: string): ProductSelectionItem | null {
    const item: ProductSelectionItem = {
      itemUniqueId: this.buildItemUniqueId(product.id, size),
      productId: product.id,
      productName: product.name,
      category: (product.category ?? 'men') as ProductCategory,
      size,
      imageUrl,
      unitPrice: product.basePrice,
      quantity: 1,
      orderType: 'wishlist',
      addedAt: new Date().toISOString()
    };

    const current = this.wishlisted();
    const exists = current.some(entry => entry.itemUniqueId === item.itemUniqueId);

    const updated = exists
      ? current.filter(entry => entry.itemUniqueId !== item.itemUniqueId)
      : [...current, item];

    this.wishlisted.set(updated);
    this.saveToStorage(updated);

    return exists ? null : item;
  }

  /**
   * Check if a product is in the wishlist
   * @param productId - The product ID to check
   * @param size - The size to check
   * @returns - True if product is wishlisted
   */
  isWishlisted(productId: string, size: Size): boolean {
    return this.wishlisted().some(entry => entry.productId === productId && entry.size === size);
  }

  /**
   * Get all items in the wishlist
   * @returns - Array of wishlisted product selection items
   */
  getWishlistItems(): ProductSelectionItem[] {
    return this.wishlisted();
  }

  /**
   * Clear all wishlisted items
   */
  clearWishlist(): void {
    this.wishlisted.set([]);
    this.saveToStorage([]);
  }

  /**
   * Get the count of wishlisted items
   * @returns - Current count of wishlisted items
   */
  getWishlistCount(): number {
    return this.wishlisted().length;
  }

  /**
   * Build a unique ID for a wishlist item based on product ID and size
   * @param productId - The product ID
   * @param size - The size
   * @returns - A unique identifier string
   */
  private buildItemUniqueId(productId: string, size: Size): string {
    return `${productId}-${size}-${Date.now().toString(36)}`;
  }
}
