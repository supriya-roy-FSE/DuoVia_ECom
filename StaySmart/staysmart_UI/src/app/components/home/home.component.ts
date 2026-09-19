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
  imagePath: string;
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

  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: 'Premium DTF T-Shirts',
      subtitle: 'High-quality direct-to-fabric printing with vibrant colors',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(31, 41, 55, 0.3) 65%, rgba(245, 158, 11, 0.18) 100%)',
      imagePath: '/data/resources/Image/background/background-1.png'
    },
    {
      id: 2,
      title: 'Exclusive Designs',
      subtitle: 'Limited edition graphic tees for every style',
      bgColor: 'linear-gradient(135deg, rgba(31, 41, 55, 0.45) 0%, rgba(55, 65, 81, 0.3) 60%, rgba(245, 158, 11, 0.15) 100%)',
      imagePath: '/data/resources/Image/background/background-2.png'
    },
    {
      id: 3,
      title: 'Perfect Fit Guaranteed',
      subtitle: 'Comfortable oversized cuts in multiple sizes',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.48) 0%, rgba(75, 85, 99, 0.3) 70%, rgba(245, 158, 11, 0.12) 100%)',
      imagePath: '/data/resources/Image/background/background-3.png'
    },
    {
      id: 4,
      title: 'Bold Statement Prints',
      subtitle: 'Standout graphics crafted for everyday confidence',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(55, 65, 81, 0.3) 65%, rgba(245, 158, 11, 0.16) 100%)',
      imagePath: '/data/resources/Image/background/background-4F.png'
    },
    {
      id: 5,
      title: 'Style That Speaks',
      subtitle: 'Fresh drops crafted to keep your wardrobe on point',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(31, 41, 55, 0.3) 65%, rgba(245, 158, 11, 0.18) 100%)',
      imagePath: '/data/resources/Image/background/background-5.png'
    }
  ];

  categories: CategoryOption[] = [
    {
      id: 'men',
      label: 'Men',
      description: 'Sharp graphic essentials with bold silhouettes and everyday comfort.',
      eyebrow: 'Modern Classics',
      imagePath: '/data/resources/Image/category/Men.PNG'
    },
    {
      id: 'women',
      label: 'Women',
      description: 'Refined statement prints designed with a clean, elevated finish.',
      eyebrow: 'Studio Selects',
      imagePath: '/data/resources/Image/category/women.PNG'
    },
    {
      id: 'kids',
      label: 'Kids',
      description: 'Easy-wear pieces built for movement, color, and playful character.',
      eyebrow: 'Everyday Comfort',
      imagePath: '/data/resources/Image/category/kids.PNG'
    }
  ];

  // Computed properties
  currentSlide = computed(() => this.carouselSlides[this.currentSlideIndex()]);
  nextSlideIndex = computed(() => (this.currentSlideIndex() + 1) % this.carouselSlides.length);
  nextSlide = computed(() => this.carouselSlides[this.nextSlideIndex()]);

  constructor(private router: Router) {
    // Auto-rotate carousel every 5 seconds, uninterrupted
    effect(() => {
      const interval = setInterval(() => {
        this.nextSlide_();
      }, 5000);

      return () => clearInterval(interval);
    });
  }

  nextSlide_() {
    const currentIndex = this.currentSlideIndex();
    this.currentSlideIndex.set((currentIndex + 1) % this.carouselSlides.length);
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
  }

  selectCategory(category: Category) {
    // Navigate to product detail page with category parameter
    this.router.navigate(['/products', category]);
  }
}
