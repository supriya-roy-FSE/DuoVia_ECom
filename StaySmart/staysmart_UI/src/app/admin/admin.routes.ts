import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { AdminAnalyticsComponent } from './components/admin-analytics/admin-analytics.component';
import { adminGuard } from './guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'orders',
        component: AdminOrdersComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'reviews',
        component: AdminReviewsComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'analytics',
        component: AdminAnalyticsComponent,
        canActivate: [adminGuard]
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
