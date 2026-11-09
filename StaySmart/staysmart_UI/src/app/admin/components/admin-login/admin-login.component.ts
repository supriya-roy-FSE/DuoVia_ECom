import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminApiService } from '../../../services/admin-api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  readonly username = signal('');
  readonly password = signal('');
  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);

  constructor(
    private readonly authService: AdminAuthService,
    private readonly adminApiService: AdminApiService,
    private readonly router: Router
  ) {}

  login(): void {
    const user = this.username().trim();
    const pass = this.password().trim();

    if (!user || !pass) {
      this.errorMessage.set('Username and password are required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.adminApiService.login(user, pass).subscribe({
      next: response => {
        this.isSubmitting.set(false);

        if (response.success) {
          this.authService.login(user, pass);
          this.router.navigate(['/admin/dashboard']);
          return;
        }

        this.errorMessage.set(response.message || 'Invalid credentials. Username and password are case sensitive.');
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Unable to reach the admin backend.');
      }
    });
  }
}
