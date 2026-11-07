import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserSession
} from '../models/tshirt.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8081/api/users';
  private readonly sessionKey = 'duovia_logged_in_user';

  readonly currentUser = signal<UserSession | null>(this.loadSession());

  register(request: UserRegistrationRequest): Observable<UserRegistrationResponse> {
    return this.http.post<UserLoginResponse>(`${this.baseUrl}/register`, request).pipe(
      map(response => ({
        success: response.success,
        message: response.message,
        userId: response.user?.userId,
        userEmail: response.user?.userEmail,
        userName: response.user?.userName
      })),
      catchError(error => of({
        success: false,
        message: error?.error?.message ?? 'Unable to create account right now.'
      }))
    );
  }

  login(request: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        if (response.success && response.user) {
          const session: UserSession = {
            userId: response.user.userId,
            name: response.user.userName,
            email: response.user.userEmail,
            phone: response.user.phone,
            address: response.user.address,
            status: response.user.status
          };
          this.currentUser.set(session);
          this.persistSession(session);
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.sessionKey);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  getCurrentUser(): UserSession | null {
    return this.currentUser();
  }

  private loadSession(): UserSession | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const value = localStorage.getItem(this.sessionKey);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as UserSession;
    } catch {
      return null;
    }
  }

  private persistSession(session: UserSession): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
  }
}
