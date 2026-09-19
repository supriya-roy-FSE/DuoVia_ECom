import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'products/:category',
		component: ProductListingComponent
	},
	{
		path: 'products/:category/:productId',
		component: ProductDetailComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];
