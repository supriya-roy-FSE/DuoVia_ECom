import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { MyOrdersComponent } from './components/orders/my-orders.component';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'cart',
		component: CartComponent
	},
	{
		path: 'wishlist',
		component: WishlistComponent
	},
	{
		path: 'my-orders',
		component: MyOrdersComponent
	},
	{
		path: 'products/:category',
		component: ProductListingComponent
	},
	{
		path: 'products/:category/:productId',
		component: ProductDetailComponent
	},
	...adminRoutes,
	{
		path: '**',
		redirectTo: ''
	}
];
