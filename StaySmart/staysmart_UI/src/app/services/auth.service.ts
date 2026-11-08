import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserRegistrationPayload,
  UserRegistrationRequest,
  UserRegistrationResponse,
  UserSession
} from '../models/tshirt.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/users`;
  private readonly sessionKey = 'duovia_logged_in_user';

  readonly currentUser = signal<UserSession | null>(this.loadSession());

  register(request: UserRegistrationRequest): Observable<UserRegistrationResponse> {
    const registrationPayload: UserRegistrationPayload = {
      userName: request.userName.trim(),
      userEmail: request.userEmail.trim(),
      phone: request.phone.trim(),
      address: request.address.trim(),
      userId: request.userId.trim(),
      password: request.password,
      ID: this.generateUniqueRegistrationId(),
      User_Name: request.userName.trim(),
      User_Email: request.userEmail.trim(),
      Phone: request.phone.trim(),
      Address: request.address.trim(),
      UserId: request.userId.trim(),
      Password: request.password,
      Status: 'ACTIVE',
      Create_date: new Date().toISOString()
    };

    return this.http.post<UserLoginResponse>(`${this.baseUrl}/register`, registrationPayload).pipe(
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
            userSkSeq: response.user.userSkSeq ?? null,
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

  private generateUniqueRegistrationId(): string {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `USR-${timestampPart}-${randomPart}`;
  }
}
