/**
 * UPDATED APP ROUTES - Integration Configuration
 * 
 * Replace the contents of src/app/app.routes.ts with this file
 * to integrate the ProductDetailComponent as the default home route.
 */

import { Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductDetailComponent
  },
  // Add additional routes here as needed
  // {
  //   path: 'about',
  //   component: AboutComponent
  // },
  // {
  //   path: 'contact',
  //   component: ContactComponent
  // }
];
