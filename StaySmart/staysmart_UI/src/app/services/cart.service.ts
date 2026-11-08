import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  OrderCheckoutPayload,
  OrderEntryType,
  ProductSelectionItem,
  ProductCategory,
  Size,
  TShirtProduct,
  OrderSheetRow,
  CheckoutResponse
} from '../models/tshirt.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;
  private readonly STORAGE_KEY = 'duovia_cart_items';
  private readonly ORDER_WEBHOOK_URL = `${this.baseUrl}/orders`;

  readonly cartItems = signal<ProductSelectionItem[]>(this.loadFromStorage());

  addToCart(product: TShirtProduct, size: Size, imageUrl: string): ProductSelectionItem {
    const item: ProductSelectionItem = {
      itemUniqueId: this.generateItemId(product.id, size),
      productId: product.id,
      productName: product.name,
      category: (product.category ?? 'men') as ProductCategory,
      size,
      imageUrl,
      unitPrice: product.basePrice,
      quantity: 1,
      orderType: 'cart',
      addedAt: new Date().toISOString()
    };

    this.cartItems.update(current => {
      const existingIndex = current.findIndex(entry => entry.itemUniqueId === item.itemUniqueId);
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          addedAt: new Date().toISOString()
        };
        this.saveToStorage(updated);
        return updated;
      }

      const next = [...current, item];
      this.saveToStorage(next);
      return next;
    });

    return item;
  }

  removeFromCart(itemUniqueId: string): void {
    this.cartItems.update(current => {
      const next = current.filter(item => item.itemUniqueId !== itemUniqueId);
      this.saveToStorage(next);
      return next;
    });
  }

  updateCartQuantity(itemUniqueId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemUniqueId);
      return;
    }

    this.cartItems.update(current => {
      const next = current.map(item =>
        item.itemUniqueId === itemUniqueId ? { ...item, quantity } : item
      );
      this.saveToStorage(next);
      return next;
    });
  }

  getCartCount(): number {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartItems(): ProductSelectionItem[] {
    return this.cartItems();
  }

  createCheckoutPayload(customerName: string, mobile: string, email: string): OrderCheckoutPayload {
    const items = this.cartItems();
    const totalPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const rows: OrderSheetRow[] = items.map(item => ({
      customerName,
      mobile,
      email,
      orderType: 'checkout',
      itemCount: items.length,
      orderUniqueId: this.generateOrderId(),
      itemUniqueId: item.itemUniqueId,
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      size: item.size,
      imageUrl: item.imageUrl,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.unitPrice * item.quantity,
      orderedAt: new Date().toISOString()
    }));

    const orderUniqueId = rows[0]?.orderUniqueId ?? this.generateOrderId();

    return {
      customerName,
      mobile,
      email,
      orderType: 'checkout',
      itemCount: rows.length,
      orderUniqueId,
      totalPrice,
      rows: rows.map(row => ({
        ...row,
        orderUniqueId,
        itemCount: rows.length,
        orderType: 'checkout'
      }))
    };
  }

  submitCheckout(payload: OrderCheckoutPayload): Observable<CheckoutResponse> {
    const requestBody = {
      userSkSeq: this.getCurrentUserSkSeq(),
      userId: this.getCurrentUserId(),
      customerName: payload.customerName,
      email: payload.email,
      phone: payload.mobile,
      productName: payload.rows[0]?.productName ?? 'Multi-product order',
      quantity: payload.rows.reduce((sum, row) => sum + row.quantity, 0),
      totalPrice: payload.totalPrice,
      status: 'PENDING'
    };

    return this.http.post<CheckoutResponse>(this.ORDER_WEBHOOK_URL, requestBody).pipe(
      map(response => ({
        ...response,
        orderId: response.orderId ?? null,
        message: response.message ?? 'Order placed successfully.'
      })),
      catchError(error => {
        console.error('Checkout submission failed:', error);
        const message = error?.error?.message ?? 'We could not place your order right now. Please try again later.';
        const errorCode = error?.error?.errorCode ?? 'CHECKOUT_FAILED';
        const rootCause = error?.error?.rootCause ?? 'Unknown checkout failure';
        return of({
          success: false,
          orderId: null,
          message,
          errorCode,
          rootCause,
          timestamp: new Date().toISOString()
        } as CheckoutResponse & { timestamp: string });
      })
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveToStorage([]);
  }

  private generateItemId(productId: string, size: Size): string {
    return `${productId}-${size}-${Date.now().toString(36)}`;
  }

  private generateOrderId(): string {
    return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }

  private loadFromStorage(): ProductSelectionItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      return [];
    }
  }

  private saveToStorage(items: ProductSelectionItem[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }

  private getCurrentUserId(): string {
    const user = JSON.parse(localStorage.getItem('duovia_logged_in_user') ?? 'null');
    return user?.userId ?? '';
  }

  private getCurrentUserSkSeq(): number | null {
    const user = JSON.parse(localStorage.getItem('duovia_logged_in_user') ?? 'null');
    return user?.userSkSeq ?? null;
  }
}
