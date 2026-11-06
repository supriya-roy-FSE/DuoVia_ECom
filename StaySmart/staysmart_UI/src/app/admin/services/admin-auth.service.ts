import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  readonly isLoggedIn = signal(this.hasSession());

  login(username: string, password: string): boolean {
    const isValid = username === 'aDmIn' && password === 'AdMiN';

    if (isValid) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('duovia_admin_session', 'active');
      }
      this.isLoggedIn.set(true);
    }

    return isValid;
  }

  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('duovia_admin_session');
    }
    this.isLoggedIn.set(false);
  }

  canActivate(): boolean {
    const active = this.hasSession();
    this.isLoggedIn.set(active);
    return active;
  }

  private hasSession(): boolean {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('duovia_admin_session') === 'active';
  }
}
