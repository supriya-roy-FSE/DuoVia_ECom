
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
    'index.csr.html': {size: 21638, hash: 'ba15967f0f99e7d3726c9555543a1bf5f9ac7f73035daa9979c632d2fcbceb5b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20506, hash: '5e7c5c68d106bbf80e8e9304e4ca573e6f5f4d8d2cc1a7db0596968914210418', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 41641, hash: 'b585b561982ba4ac35c13150092e2e463c63a3c06b3ae596622625d8301845d8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-24YM3R4R.css': {size: 2333, hash: 'FTZAsDMwLB0', text: () => import('./assets-chunks/styles-24YM3R4R_css.mjs').then(m => m.default)}
  },
};
