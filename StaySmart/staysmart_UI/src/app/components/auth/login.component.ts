import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserLoginRequest } from '../../models/tshirt.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-stage">
      <div class="auth-panel">
        <div class="brand-panel">
          <div class="brand-pill">DUOVIA STYLES</div>
          <h1>Welcome back</h1>
          <p>
            Access your saved favourites, recent orders, and a faster checkout experience.
          </p>

          <ul class="feature-list">
            <li>Track every order in one place</li>
            <li>Keep wishlist essentials ready</li>
            <li>Checkout faster with saved details</li>
          </ul>
        </div>

        <div class="form-panel">
          <div class="form-header">
            <p class="eyebrow">Member login</p>
            <h2>Sign in</h2>
          </div>

          <form (ngSubmit)="submitLogin()" class="auth-form" novalidate>
            <label>
              <span>User ID</span>
              <input
                type="text"
                [(ngModel)]="form.userId"
                name="userId"
                placeholder="Enter your user ID"
                required
                minlength="3"
                #userIdCtrl="ngModel"
              />
              @if (userIdCtrl.touched && userIdCtrl.invalid) {
                <small class="field-error">User ID must contain at least 3 characters.</small>
              }
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                [(ngModel)]="form.password"
                name="password"
                placeholder="Enter your password"
                required
                minlength="6"
                #passwordCtrl="ngModel"
              />
              @if (passwordCtrl.touched && passwordCtrl.invalid) {
                <small class="field-error">Password must contain at least 6 characters.</small>
              }
            </label>

            @if (message()) {
              <p class="message" [class.error]="!isSuccess()">{{ message() }}</p>
            }

            <button type="submit" class="primary-btn" [disabled]="isSubmitting() || !isFormValid()">
              {{ isSubmitting() ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="auth-footer">
            New customer? <a routerLink="/register">Create an account</a>
          </p>
        </div>
      </div>
    </section>

    @if (showWelcomeModal()) {
      <div class="welcome-overlay" aria-live="polite" aria-atomic="true">
        <div class="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div class="welcome-icon">🎉</div>
          <h3 id="welcome-title">Welcome, {{ welcomeUser() }}  !</h3>
          <p>Your account is ready and you're signed in.</p>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .auth-stage {
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 52px 20px;
        background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%);
      }

      .auth-panel {
        width: min(1100px, 100%);
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        background: rgba(255,255,255,0.95);
        border: 1px solid #e5e7eb;
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 24px 60px rgba(15,23,42,0.12);
      }

      .brand-panel {
        background: linear-gradient(135deg, #111827 0%, #1f2937 55%, #374151 100%);
        color: #fff;
        padding: 48px 42px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .brand-pill {
        align-self: flex-start;
        background: rgba(245,158,11,0.1);
        color: #fbbf24;
        border: 1px solid rgba(245,158,11,0.3);
        border-radius: 999px;
        padding: 8px 14px;
        letter-spacing: 0.12em;
        font-size: 0.7rem;
        font-weight: 800;
      }

      .brand-panel h1 {
        margin: 18px 0 10px;
        font-size: clamp(2.2rem, 2.5vw, 3.1rem);
        line-height: 1.1;
      }

      .brand-panel p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(255,255,255,0.8);
        max-width: 500px;
      }

      .feature-list {
        list-style: none;
        padding: 0;
        margin: 26px 0 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .feature-list li {
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255,255,255,0.9);
        font-weight: 600;
      }

      .feature-list li::before {
        content: '✓';
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(245,158,11,0.18);
        color: #fbbf24;
        font-weight: 800;
      }

      .form-panel {
        padding: 42px 38px 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .form-header {
        margin-bottom: 18px;
      }

      .eyebrow {
        margin: 0 0 8px;
        color: #f59e0b;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-size: 0.72rem;
      }

      h2 {
        margin: 0;
        font-size: 2.2rem;
        color: #111827;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-weight: 700;
        color: #374151;
      }

      input {
        border: 1px solid #d1d5db;
        background: #f9fafb;
        border-radius: 14px;
        padding: 14px 16px;
        font-size: 1rem;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      input:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 4px rgba(245,158,11,0.12);
      }

      .message {
        margin: 0;
        border-radius: 12px;
        padding: 12px 14px;
        background: #ecfdf5;
        color: #065f46;
        font-size: 0.95rem;
        font-weight: 600;
      }

      .message.error {
        background: #fef2f2;
        color: #991b1b;
      }

      .primary-btn {
        margin-top: 4px;
        background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
        color: #fff;
        border: none;
        border-radius: 14px;
        padding: 15px 18px;
        font-size: 1rem;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      }

      .primary-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 14px 28px rgba(17,24,39,0.18);
      }

      .primary-btn:disabled {
        opacity: 0.72;
        cursor: not-allowed;
      }

      .auth-footer {
        margin: 20px 0 0;
        color: #4b5563;
        text-align: center;
        font-size: 0.96rem;
      }

      .auth-footer a {
        color: #111827;
        font-weight: 800;
        text-decoration: none;
      }

      .field-error {
        color: #b91c1c;
        font-size: 0.8rem;
        margin-top: -4px;
        font-weight: 600;
      }

      .welcome-overlay {
        position: fixed;
        inset: 0;
        background: rgba(17, 24, 39, 0.52);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        padding: 1rem;
      }

      .welcome-modal {
        width: min(440px, calc(100vw - 2rem));
        background: linear-gradient(135deg, #fff7ed 0%, #ecfeff 100%);
        border: 1px solid rgba(245, 158, 11, 0.45);
        border-radius: 24px;
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);
        text-align: center;
        padding: 2rem 1.5rem 1.5rem;
        animation: pop-in 0.25s ease-out;
      }

      .welcome-icon {
        font-size: 3rem;
        margin-bottom: 0.75rem;
      }

      .welcome-modal h3 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        color: #111827;
      }

      .welcome-modal p {
        margin: 0;
        font-size: 1rem;
        color: #374151;
      }

      @keyframes pop-in {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @media (max-width: 860px) {
        .auth-panel {
          grid-template-columns: 1fr;
        }

        .brand-panel {
          padding: 36px 28px;
        }

        .form-panel {
          padding: 28px 22px 32px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form: UserLoginRequest = { userId: '', password: '' };
  readonly isSubmitting = signal(false);
  readonly message = signal('');
  readonly isSuccess = signal(true);
  readonly showWelcomeModal = signal(false);
  readonly welcomeUser = signal('');

  isFormValid(): boolean {
    return !!(
      this.form.userId.trim() &&
      this.form.userId.trim().length >= 3 &&
      this.form.password.trim() &&
      this.form.password.trim().length >= 6
    );
  }

  submitLogin(): void {
    if (!this.form.userId.trim() || !this.form.password.trim()) {
      this.message.set('Please enter both user ID and password.');
      this.isSuccess.set(false);
      return;
    }

    this.isSubmitting.set(true);
    this.authService.login(this.form).subscribe({
      next: response => {
        this.isSubmitting.set(false);
        if (response.success && response.user) {
          const displayName = response.user.userName || response.user.userId || this.form.userId;
          this.welcomeUser.set(displayName);
          this.showWelcomeModal.set(true);
          this.message.set('');
          this.isSuccess.set(true);
          setTimeout(() => {
            this.showWelcomeModal.set(false);
            this.router.navigate(['/']);
          }, 5000);
          return;
        }

        this.message.set(response.message || 'Login failed.');
        this.isSuccess.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.message.set('Unable to login right now. Please try again.');
        this.isSuccess.set(false);
      }
    });
  }
}
