import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

type Category = 'men' | 'women' | 'kids';

interface CategoryOption {
  id: Category;
  label: string;
  description: string;
  eyebrow: string;
  imagePath: string;
}

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  bgColor: string;
  cta: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  // Carousel signals
  currentSlideIndex = signal(0);
  autoPlayActive = signal(true);

  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: 'Premium DTF T-Shirts',
      subtitle: 'High-quality direct-to-fabric printing with vibrant colors',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92) 0%, rgba(31, 41, 55, 0.88) 65%, rgba(245, 158, 11, 0.42) 100%)',
      cta: 'Explore Collection'
    },
    {
      id: 2,
      title: 'Exclusive Designs',
      subtitle: 'Limited edition graphic tees for every style',
      bgColor: 'linear-gradient(135deg, rgba(31, 41, 55, 0.94) 0%, rgba(55, 65, 81, 0.9) 60%, rgba(245, 158, 11, 0.28) 100%)',
      cta: 'Shop Now'
    },
    {
      id: 3,
      title: 'Perfect Fit Guaranteed',
      subtitle: 'Comfortable oversized cuts in multiple sizes',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(75, 85, 99, 0.86) 70%, rgba(245, 158, 11, 0.22) 100%)',
      cta: 'View Sizes'
    },
    {
      id: 4,
      title: 'Fast Shipping',
      subtitle: 'Same-day dispatch on all orders',
      bgColor: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 60%, rgba(245, 158, 11, 0.25) 100%)',
      cta: 'Order Today'
    },
    {
      id: 5,
      title: 'Best Prices',
      subtitle: 'Unbeatable deals on premium tees',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.94) 0%, rgba(31, 41, 55, 0.88) 68%, rgba(245, 158, 11, 0.36) 100%)',
      cta: 'View Deals'
    }
  ];

  categories: CategoryOption[] = [
    {
      id: 'men',
      label: 'Men',
      description: 'Sharp graphic essentials with bold silhouettes and everyday comfort.',
      eyebrow: 'Modern Classics',
      imagePath: '/data/resources/Image/Bikers_Delight_1/home.jpeg'
    },
    {
      id: 'women',
      label: 'Women',
      description: 'Refined statement prints designed with a clean, elevated finish.',
      eyebrow: 'Studio Selects',
      imagePath: '/data/resources/Image/Sanatani_1/home.PNG'
    },
    {
      id: 'kids',
      label: 'Kids',
      description: 'Easy-wear pieces built for movement, color, and playful character.',
      eyebrow: 'Everyday Comfort',
      imagePath: '/data/resources/Image/Test Kids Tee Alpha/home.jpeg'
    }
  ];

  // Computed properties
  currentSlide = computed(() => this.carouselSlides[this.currentSlideIndex()]);
  nextSlideIndex = computed(() => (this.currentSlideIndex() + 1) % this.carouselSlides.length);
  nextSlide = computed(() => this.carouselSlides[this.nextSlideIndex()]);

  constructor(private router: Router) {
    // Auto-rotate carousel every 5 seconds
    effect(() => {
      if (this.autoPlayActive()) {
        const interval = setInterval(() => {
          this.nextSlide_();
        }, 5000);

        return () => clearInterval(interval);
      }
      return () => {};
    });
  }

  nextSlide_() {
    const currentIndex = this.currentSlideIndex();
    this.currentSlideIndex.set((currentIndex + 1) % this.carouselSlides.length);
  }

  prevSlide() {
    const currentIndex = this.currentSlideIndex();
    this.currentSlideIndex.set((currentIndex - 1 + this.carouselSlides.length) % this.carouselSlides.length);
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
    this.autoPlayActive.set(false);
    
    // Resume auto-play after 10 seconds of user interaction
    setTimeout(() => this.autoPlayActive.set(true), 10000);
  }

  selectCategory(category: Category) {
    // Navigate to product detail page with category parameter
    this.router.navigate(['/products', category]);
  }

  onCarouselHover() {
    this.autoPlayActive.set(false);
  }

  onCarouselLeave() {
    this.autoPlayActive.set(true);
  }
}
