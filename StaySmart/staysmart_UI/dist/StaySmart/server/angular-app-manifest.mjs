
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
    "route": "/DuoVia_ECom/products/*"
  },
  {
    "renderMode": 0,
    "route": "/DuoVia_ECom/products/*/*"
  },
  {
    "renderMode": 0,
    "redirectTo": "/DuoVia_ECom",
    "route": "/DuoVia_ECom/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 21636, hash: 'a64dff492ec60fdd12efc6ba347d5d0540cdffb55a0a353dbb8e3b93c884e96a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20504, hash: '6ca0d9eabf95b0898cd35d8d7865065c74a74bdbc70e68c8c2c56ca097f390b9', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 41639, hash: '30c78a0239445f60b23fa378a286c9f58f2cd5c5bfe93b62a394ec98b7c64450', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-24YM3R4R.css': {size: 2333, hash: 'FTZAsDMwLB0', text: () => import('./assets-chunks/styles-24YM3R4R_css.mjs').then(m => m.default)}
  },
};
