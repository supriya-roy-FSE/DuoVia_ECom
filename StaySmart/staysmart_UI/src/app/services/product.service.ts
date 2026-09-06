import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FolderImageManifest, ImageCatalogPayload, ProductCatalogEntry, TShirtProduct } from '../models/tshirt.model';

export type Category = 'men' | 'women' | 'kids';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly catalog = signal<Record<Category, TShirtProduct[]>>({
    men: [
      {
        id: 'TS-MEN-001',
        sku: 'TS-MEN-001',
        name: 'Classic Black Crew Neck',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Timeless black tee perfect for any occasion',
        basePrice: 1999,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['black', 'classic', 'crew-neck'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/1a1a2e/f59e0b?text=Men+01',
          'https://via.placeholder.com/300x400/16213e/f59e0b?text=Men+01B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/1a1a2e/f59e0b?text=Men+01'
      },
      {
        id: 'TS-MEN-002',
        sku: 'TS-MEN-002',
        name: 'Oversized Graphic Tee',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Bold graphic design with premium comfort',
        basePrice: 2199,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['graphic', 'oversized', 'casual'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/0f3460/f59e0b?text=Men+02',
          'https://via.placeholder.com/300x400/533483/f59e0b?text=Men+02B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/0f3460/f59e0b?text=Men+02'
      },
      {
        id: 'TS-MEN-003',
        sku: 'TS-MEN-003',
        name: 'Minimalist White Tee',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Clean minimalist design on premium white cotton',
        basePrice: 1799,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['white', 'minimalist', 'clean'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/2a2a3e/f59e0b?text=Men+03',
          'https://via.placeholder.com/300x400/1a1a3e/f59e0b?text=Men+03B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/2a2a3e/f59e0b?text=Men+03'
      },
      {
        id: 'TS-MEN-004',
        sku: 'TS-MEN-004',
        name: 'Premium Navy Blue',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Deep navy blue with subtle design accents',
        basePrice: 2099,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['navy', 'premium', 'business-casual'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/3a0f5c/f59e0b?text=Men+04',
          'https://via.placeholder.com/300x400/121215/f59e0b?text=Men+04B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/3a0f5c/f59e0b?text=Men+04'
      }
    ],
    women: [
      {
        id: 'TS-WOM-001',
        sku: 'TS-WOM-001',
        name: 'Fitted Pastel Pink',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Soft pastel pink fitted design for women',
        basePrice: 1999,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['pink', 'fitted', 'pastel'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/2e1a47/f59e0b?text=Women+01',
          'https://via.placeholder.com/300x400/1f1f2e/f59e0b?text=Women+01B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/2e1a47/f59e0b?text=Women+01'
      },
      {
        id: 'TS-WOM-002',
        sku: 'TS-WOM-002',
        name: 'Vintage Style Crop Top',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Trendy crop top with vintage aesthetic',
        basePrice: 1899,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['crop', 'vintage', 'trendy'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/4a5f8f/f59e0b?text=Women+02',
          'https://via.placeholder.com/300x400/3d4e7a/f59e0b?text=Women+02B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/4a5f8f/f59e0b?text=Women+02'
      },
      {
        id: 'TS-WOM-003',
        sku: 'TS-WOM-003',
        name: 'Empowerment Graphic Tee',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Inspiring graphic design celebrating women',
        basePrice: 2199,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['graphic', 'empowerment', 'statement'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/5a6f9f/f59e0b?text=Women+03',
          'https://via.placeholder.com/300x400/4d5e8a/f59e0b?text=Women+03B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/5a6f9f/f59e0b?text=Women+03'
      },
      {
        id: 'TS-WOM-004',
        sku: 'TS-WOM-004',
        name: 'Elegant Burgundy',
        fabricSpecs: '240 GSM | 100% Cotton | DTF Print',
        description: 'Sophisticated burgundy tee for all occasions',
        basePrice: 2099,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['burgundy', 'elegant', 'sophisticated'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/6a7faf/f59e0b?text=Women+04',
          'https://via.placeholder.com/300x400/5d6e9a/f59e0b?text=Women+04B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/6a7faf/f59e0b?text=Women+04'
      }
    ],
    kids: [
      {
        id: 'TS-KID-001',
        sku: 'TS-KID-001',
        name: 'Colorful Rainbow Tee',
        fabricSpecs: '200 GSM | 100% Cotton | DTF Print',
        description: 'Bright and fun rainbow design for kids',
        basePrice: 1299,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['rainbow', 'colorful', 'fun'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/7a8fbf/f59e0b?text=Kids+01',
          'https://via.placeholder.com/300x400/6d7eaa/f59e0b?text=Kids+01B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/7a8fbf/f59e0b?text=Kids+01'
      },
      {
        id: 'TS-KID-002',
        sku: 'TS-KID-002',
        name: 'Adventure Animal Prints',
        fabricSpecs: '200 GSM | 100% Cotton | DTF Print',
        description: 'Cute animal designs kids love',
        basePrice: 1399,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['animals', 'cute', 'playful'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/8a9fcf/f59e0b?text=Kids+02',
          'https://via.placeholder.com/300x400/7d8eba/f59e0b?text=Kids+02B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/8a9fcf/f59e0b?text=Kids+02'
      },
      {
        id: 'TS-KID-003',
        sku: 'TS-KID-003',
        name: 'Space Explorer Graphic',
        fabricSpecs: '200 GSM | 100% Cotton | DTF Print',
        description: 'Awesome space-themed graphic for young adventurers',
        basePrice: 1499,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['space', 'adventure', 'explorer'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/9aafdf/f59e0b?text=Kids+03',
          'https://via.placeholder.com/300x400/8d9eca/f59e0b?text=Kids+03B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/9aafdf/f59e0b?text=Kids+03'
      },
      {
        id: 'TS-KID-004',
        sku: 'TS-KID-004',
        name: 'Superhero Squad Tee',
        fabricSpecs: '200 GSM | 100% Cotton | DTF Print',
        description: 'Empower kids with superhero-inspired designs',
        basePrice: 1399,
        sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
        tags: ['superhero', 'empowerment', 'cool'],
        thumbnailImages: [
          'https://via.placeholder.com/300x400/aaafef/f59e0b?text=Kids+04',
          'https://via.placeholder.com/300x400/9d9eda/f59e0b?text=Kids+04B'
        ],
        mainImageUrl: 'https://via.placeholder.com/300x400/aaafef/f59e0b?text=Kids+04'
      }
    ]
  });

  constructor() {
    this.loadCatalogData();
  }

  getProductsByCategory(category: Category): TShirtProduct[] {
    return this.catalog()[category] ?? [];
  }

  getProductById(category: Category, productId: string): TShirtProduct | undefined {
    return this.catalog()[category]?.find(p => p.id === productId);
  }

  isValidCategory(value: string): value is Category {
    return ['men', 'women', 'kids'].includes(value);
  }

  private loadCatalogData(): void {
    this.http.get<ImageCatalogPayload>('/data/image-catalog.json').subscribe({
      next: payload => {
        const productEntries = this.getValidProductEntries(payload);
        if (productEntries.length === 0) {
          return;
        }

        const uniqueFolders = Array.from(new Set(productEntries.map(entry => entry.imageFolderPath.trim()).filter(Boolean)));

        if (uniqueFolders.length === 0) {
          const nextCatalog = this.mergeProductCatalog(this.catalog(), productEntries, new Map<string, string[]>());
          this.catalog.set(nextCatalog);
          return;
        }

        const manifestRequests = uniqueFolders.map(folderPath =>
          this.http.get<FolderImageManifest>(`${folderPath}/manifest.json`).pipe(
            map(manifest => ({ folderPath, fileNames: this.normalizeImageFileNames(manifest?.images ?? []) })),
            catchError(() => of({ folderPath, fileNames: [] }))
          )
        );

        forkJoin(manifestRequests).subscribe(results => {
          const imageFilesByFolder = new Map<string, string[]>();
          results.forEach(result => {
            imageFilesByFolder.set(result.folderPath, this.orderHomeFirst(result.fileNames));
          });

          const nextCatalog = this.mergeProductCatalog(this.catalog(), productEntries, imageFilesByFolder);
          this.catalog.set(nextCatalog);
        });
      },
      error: error => {
        console.warn('Catalog JSON could not be loaded. Using default product configuration.', error);
      }
    });
  }

  private getValidProductEntries(payload: unknown): ProductCatalogEntry[] {
    if (!this.hasProductCatalogEntries(payload)) {
      return [];
    }

    const products = payload.products ?? [];
    const seenProductIds = new Set<string>();

    return products.filter(entry => {
      if (seenProductIds.has(entry.id)) {
        console.warn(`Duplicate product id found in product catalog: ${entry.id}`);
        return false;
      }

      seenProductIds.add(entry.id);
      return true;
    });
  }

  private mergeProductCatalog(
    catalog: Record<Category, TShirtProduct[]>,
    entries: ProductCatalogEntry[],
    imageFilesByFolder: Map<string, string[]>
  ): Record<Category, TShirtProduct[]> {
    const existingById = new Map<string, TShirtProduct>();

    (Object.keys(catalog) as Category[]).forEach(category => {
      catalog[category].forEach(product => {
        existingById.set(product.id, product);
      });
    });

    const nextCatalog: Record<Category, TShirtProduct[]> = {
      men: [],
      women: [],
      kids: []
    };

    entries.forEach(entry => {
      const fallback = existingById.get(entry.id);
      const folderPath = entry.imageFolderPath.trim();
      const imageFileNames = imageFilesByFolder.get(folderPath) ?? [];
      const orderedFileNames = this.orderHomeFirst(imageFileNames);
      const imagePaths = orderedFileNames.map(fileName => `${folderPath}/${fileName}`);
      const mainImageUrl = this.getHomeImagePath(imagePaths) ?? imagePaths[0] ?? fallback?.mainImageUrl ?? '';
      const thumbnailImages = imagePaths.length > 0 ? imagePaths : (fallback?.thumbnailImages ?? []);

      nextCatalog[entry.category].push({
        id: entry.id,
        sku: fallback?.sku ?? entry.id,
        name: entry.productName,
        category: entry.category,
        uploadDate: entry.uploadDate,
        fabricSpecs: fallback?.fabricSpecs ?? '240 GSM | 100% Cotton | DTF Print',
        description: fallback?.description ?? `${entry.productName} from the latest collection.`,
        basePrice: entry.price,
        sizeOptions: entry.size,
        tags: fallback?.tags ?? [entry.category],
        thumbnailImages,
        mainImageUrl
      });
    });

    const categories: Category[] = ['men', 'women', 'kids'];
    categories.forEach(category => {
      if (nextCatalog[category].length === 0) {
        nextCatalog[category] = catalog[category];
      }
    });

    return nextCatalog;
  }

  private hasProductCatalogEntries(value: unknown): value is ImageCatalogPayload {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const payloadRecord = value as Record<string, unknown>;
    const products = payloadRecord['products'];

    if (!Array.isArray(products)) {
      return false;
    }

    return products.every(entry => this.isProductCatalogEntry(entry));
  }

  private isProductCatalogEntry(value: unknown): value is ProductCatalogEntry {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const entry = value as Record<string, unknown>;

    if (
      typeof entry['productName'] !== 'string' ||
      typeof entry['id'] !== 'string' ||
      typeof entry['category'] !== 'string' ||
      !this.isValidCategory(entry['category']) ||
      typeof entry['uploadDate'] !== 'string' ||
      typeof entry['price'] !== 'number' ||
      !Array.isArray(entry['size']) ||
      typeof entry['imageFolderPath'] !== 'string' ||
      entry['imageFolderPath'].trim().length === 0
    ) {
      return false;
    }

    return entry['size'].every(size => this.isSizeValue(size));
  }

  private normalizeImageFileNames(fileNames: unknown[]): string[] {
    return Array.from(
      new Set(
        fileNames
          .filter((fileName): fileName is string => typeof fileName === 'string')
          .map(fileName => fileName.trim())
          .filter(fileName => fileName.length > 0)
      )
    );
  }

  private orderHomeFirst(fileNames: string[]): string[] {
    return [...fileNames].sort((left, right) => {
      const leftName = left.toLowerCase();
      const rightName = right.toLowerCase();
      const leftIsHome = leftName.startsWith('home.');
      const rightIsHome = rightName.startsWith('home.');

      if (leftIsHome && !rightIsHome) {
        return -1;
      }

      if (!leftIsHome && rightIsHome) {
        return 1;
      }

      return leftName.localeCompare(rightName);
    });
  }

  private getHomeImagePath(imagePaths: string[]): string | undefined {
    return imagePaths.find(path => /\/home\.[^/]+$/i.test(path));
  }

  private isSizeValue(value: unknown): value is TShirtProduct['sizeOptions'][number] {
    return value === 'S' || value === 'M' || value === 'L' || value === 'XL' || value === 'XXL';
  }

}
