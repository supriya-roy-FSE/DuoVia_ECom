
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/DuoVia_ECom/',
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
    'index.csr.html': {size: 21869, hash: '7db29e51134d55f6e288f26ccaaf75a7860a09a4e97d3a12db65752067a3632e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20796, hash: '9ed7a9718932d232df188acef64d7e235d42d86272826e3c393269ce394933d7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 58579, hash: '43479086861575a96eb0aeee2e9c0bd657060c6f0acfe2a862048ebfa4745690', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-JICB6I2V.css': {size: 2274, hash: 'UOLRmhTOo5M', text: () => import('./assets-chunks/styles-JICB6I2V_css.mjs').then(m => m.default)}
  },
};
