import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    // Category listing depends on data fetched at runtime (image-catalog.json),
    // which isn't reliably available during the build-time prerender step.
    // Render on-demand per request instead of prerendering.
    path: 'products/:category',
    renderMode: RenderMode.Server
  },
  {
    // Product catalog can change independently of app builds, so render
    // detail pages on-demand instead of prerendering a fixed id list.
    path: 'products/:category/:productId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
