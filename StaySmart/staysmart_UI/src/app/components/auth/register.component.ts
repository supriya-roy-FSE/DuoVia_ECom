import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegistrationRequest } from '../../models/tshirt.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-stage">
      <div class="auth-panel">
        <div class="brand-panel">
          <div class="brand-pill">DUOVIA STYLES</div>
          <h1>Create your account</h1>
          <p>
            Join to save your wishlist, manage your orders, and enjoy frictionless shopping with every visit.
          </p>

          <ul class="feature-list">
            <li>Save your favourites instantly</li>
            <li>Track orders and delivery updates</li>
            <li>Use a faster checkout on repeat purchases</li>
          </ul>
        </div>

        <div class="form-panel">
          <div class="form-header">
            <p class="eyebrow">New customer</p>
            <h2>Register</h2>
          </div>

          <form (ngSubmit)="submitRegister()" class="auth-form" novalidate>
            <label>
              <span>Full Name</span>
              <input
                type="text"
                [(ngModel)]="form.userName"
                name="userName"
                placeholder="Your full name"
                required
                minlength="2"
                #userNameCtrl="ngModel"
              />
              @if (userNameCtrl.touched && userNameCtrl.invalid) {
                <small class="field-error">Full name must have at least 2 characters.</small>
              }
            </label>

            <div class="two-column">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  [(ngModel)]="form.userEmail"
                  name="userEmail"
                  placeholder="your@email.com"
                  required
                  email
                  #userEmailCtrl="ngModel"
                />
                @if (userEmailCtrl.touched && userEmailCtrl.invalid) {
                  <small class="field-error">Enter a valid email address.</small>
                }
              </label>

              <label>
                <span>Phone</span>
                <input
                  type="tel"
                  [(ngModel)]="form.phone"
                  name="phone"
                  placeholder="Phone number"
                  required
                  pattern="^[0-9]{10}$"
                  #phoneCtrl="ngModel"
                />
                @if (phoneCtrl.touched && phoneCtrl.invalid) {
                  <small class="field-error">Phone number must be exactly 10 digits.</small>
                }
              </label>
            </div>

            <label>
              <span>Address</span>
              <textarea
                [(ngModel)]="form.address"
                name="address"
                rows="3"
                placeholder="Your shipping address"
                required
                minlength="10"
                #addressCtrl="ngModel"
              ></textarea>
              @if (addressCtrl.touched && addressCtrl.invalid) {
                <small class="field-error">Address must contain at least 10 characters.</small>
              }
            </label>

            <div class="two-column">
              <label>
                <span>User ID</span>
                <input
                  type="text"
                  [(ngModel)]="form.userId"
                  name="userId"
                  placeholder="Choose user ID"
                  required
                  minlength="4"
                  #userIdCtrl="ngModel"
                />
                @if (userIdCtrl.touched && userIdCtrl.invalid) {
                  <small class="field-error">User ID must contain at least 4 characters.</small>
                }
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  [(ngModel)]="form.password"
                  name="password"
                  placeholder="Create password"
                  required
                  minlength="6"
                  #passwordCtrl="ngModel"
                />
                @if (passwordCtrl.touched && passwordCtrl.invalid) {
                  <small class="field-error">Password must contain at least 6 characters.</small>
                }
              </label>
            </div>

            @if (message()) {
              <p class="message" [class.error]="!isSuccess()">{{ message() }}</p>
            }

            <button
              type="submit"
              class="primary-btn"
              [disabled]="isSubmitting() || !isFormValid()"
            >
              {{ isSubmitting() ? 'Creating account...' : 'Register' }}
            </button>
          </form>

          <p class="auth-footer">
            Already have an account? <a routerLink="/login">Login here</a>
          </p>
        </div>
      </div>
    </section>
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
        width: min(1120px, 100%);
        display: grid;
        grid-template-columns: 1.1fr 1.3fr;
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
        font-size: clamp(2.2rem, 2.5vw, 3.2rem);
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
        padding: 38px 30px 28px;
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
        gap: 16px;
      }

      .two-column {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-weight: 700;
        color: #374151;
      }

      input, textarea {
        border: 1px solid #d1d5db;
        background: #f9fafb;
        border-radius: 14px;
        padding: 12px 14px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      textarea {
        resize: vertical;
        min-height: 88px;
      }

      input:focus, textarea:focus {
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

        .two-column {
          grid-template-columns: 1fr;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form: UserRegistrationRequest = {
    userName: '',
    userEmail: '',
    phone: '',
    address: '',
    userId: '',
    password: ''
  };

  readonly isSubmitting = signal(false);
  readonly message = signal('');
  readonly isSuccess = signal(true);

  submitRegister(): void {
    if (!this.form.userName.trim() || !this.form.userEmail.trim() || !this.form.phone.trim() || !this.form.address.trim() || !this.form.userId.trim() || !this.form.password.trim()) {
      this.message.set('Please fill in every required field.');
      this.isSuccess.set(false);
      return;
    }

    this.isSubmitting.set(true);
    this.authService.register(this.form).subscribe({
      next: response => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.message.set('Registration successful. Redirecting to login...');
          this.isSuccess.set(true);
          setTimeout(() => this.router.navigate(['/login']), 800);
          return;
        }

        this.message.set(response.message || 'Registration failed.');
        this.isSuccess.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.message.set('Unable to complete registration right now.');
        this.isSuccess.set(false);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.form.userName.trim() &&
      this.form.userName.trim().length >= 2 &&
      this.form.userEmail.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.userEmail.trim()) &&
      this.form.phone.trim() &&
      /^[0-9]{10}$/.test(this.form.phone.trim()) &&
      this.form.address.trim() &&
      this.form.address.trim().length >= 10 &&
      this.form.userId.trim() &&
      this.form.userId.trim().length >= 4 &&
      this.form.password.trim() &&
      this.form.password.trim().length >= 6
    );
  }
}
