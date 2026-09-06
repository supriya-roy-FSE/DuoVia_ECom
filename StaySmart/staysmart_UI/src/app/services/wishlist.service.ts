import { Injectable, signal } from '@angular/core';

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
  wishlisted = signal<string[]>(this.loadFromStorage());

  constructor() {}

  /**
   * Load wishlist from localStorage on service initialization
   */
  private loadFromStorage(): string[] {
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
  private saveToStorage(items: string[]): void {
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
   * @param productId - The product ID to toggle
   */
  toggleWishlist(productId: string): void {
    this.wishlisted.update(current => {
      const updated = current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId];
      
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Check if a product is in the wishlist
   * @param productId - The product ID to check
   * @returns - True if product is wishlisted
   */
  isWishlisted(productId: string): boolean {
    return this.wishlisted().includes(productId);
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
}
