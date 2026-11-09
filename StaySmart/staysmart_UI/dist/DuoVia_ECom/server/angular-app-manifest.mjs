
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/DuoVia_ECom"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/login"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/register"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/cart"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/wishlist"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/my-orders"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/products/*"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/products/*/*"
  },
  {
    "renderMode": 0,
    "redirectTo": "/DuoVia_ECom/admin/login",
    "route": "/DuoVia_ECom/admin"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/admin/login"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/admin/dashboard"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/admin/orders"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/admin/reviews"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/admin/analytics"
  },
  {
    "renderMode": 0,
    "redirectTo": "/DuoVia_ECom",
    "route": "/DuoVia_ECom/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 21869, hash: 'a3171c5cf509e3b2f9efe7c45899c3f2d718080cd8a5a9f9b1644fa06b541f83', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20796, hash: 'f1758673d89161e525e2a311c8c9106dc1d85ee572a24b20b514eb25c564dcad', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'DuoVia_ECom/index.html': {size: 58579, hash: '1977cacc8b0479d3be397b4c327b10c8b71daea6e048022e48e051b93911676b', text: () => import('./assets-chunks/DuoVia_ECom_index_html.mjs').then(m => m.default)},
    'styles-JICB6I2V.css': {size: 2274, hash: 'UOLRmhTOo5M', text: () => import('./assets-chunks/styles-JICB6I2V_css.mjs').then(m => m.default)}
  },
};
