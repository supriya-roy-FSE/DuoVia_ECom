import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { CustomerReview, ReviewSubmission } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';

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
  subtitle1: string;
  subtitle2: string;
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
  private readonly router = inject(Router);
  private readonly reviewService = inject(ReviewService);

  // Carousel signals
  currentSlideIndex = signal(0);
  reviewFormOpen = signal(false);
  reviewSubmitted = signal(false);
  submittingReview = signal(false);
  reviewMessage = signal('');
  selectedPhotoName = signal('No file selected');
  reviewForm = signal<ReviewSubmission>({
    customerName: '',
    email: '',
    mobile: '',
    productId: 'TS-MEN-001',
    productName: 'Classic Black Crew Neck',
    productCategory: 'men',
    size: 'M',
    rating: 5,
    reviewText: '',
    photoUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'
  });

  reviewIndex = signal(0);

  featuredReviews = this.reviewService.getFeaturedReviews();

  visibleReviews = computed(() => {
    const reviews = this.reviewService.getFeaturedReviews();
    const start = this.reviewIndex();
    return reviews.slice(start, start + 3);
  });

  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: 'Premium T-Shirts',
      subtitle1: 'High-quality direct-to-fabric printing',
      subtitle2: 'with vibrant colors',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(31, 41, 55, 0.3) 65%, rgba(245, 158, 11, 0.18) 100%)',
      imagePath: 'data/resources/Image/background/background-1.png'
    },
    {
      id: 2,
      title: 'Exclusive Designs',
      subtitle1: 'Limited edition graphic tees',
      subtitle2: 'for every style',
      bgColor: 'linear-gradient(135deg, rgba(31, 41, 55, 0.45) 0%, rgba(55, 65, 81, 0.3) 60%, rgba(245, 158, 11, 0.15) 100%)',
      imagePath: 'data/resources/Image/background/background-2.png'
    },
    {
      id: 3,
      title: 'Perfect Fit Guaranteed',
      subtitle1: 'Comfortable oversized cuts',
      subtitle2: 'in multiple sizes',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.48) 0%, rgba(75, 85, 99, 0.3) 70%, rgba(245, 158, 11, 0.12) 100%)',
      imagePath: 'data/resources/Image/background/background-3.png'
    },
    {
      id: 4,
      title: 'Style That Speaks',
      subtitle1: 'Standout graphics crafted',
      subtitle2: 'for everyday confidence',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(55, 65, 81, 0.3) 65%, rgba(245, 158, 11, 0.16) 100%)',
      imagePath: 'data/resources/Image/background/background-4F.png'
    },
    {
      id: 5,
      title: 'Bold Statement Prints',
      subtitle1: 'Fresh drops crafted',
      subtitle2: 'to keep your wardrobe on point',
      bgColor: 'linear-gradient(135deg, rgba(17, 24, 39, 0.45) 0%, rgba(31, 41, 55, 0.3) 65%, rgba(245, 158, 11, 0.18) 100%)',
      imagePath: 'data/resources/Image/background/background-5.png'
    }
  ];

  categories: CategoryOption[] = [
    {
      id: 'men',
      label: 'Men',
      description: 'Sharp graphic essentials with bold silhouettes and everyday comfort.',
      eyebrow: 'Modern Classics',
      imagePath: 'data/resources/Image/category/Men.PNG'
    },
    {
      id: 'women',
      label: 'Women',
      description: 'Refined statement prints designed with a clean, elevated finish.',
      eyebrow: 'Studio Selects',
      imagePath: 'data/resources/Image/category/women.PNG'
    },
    {
      id: 'kids',
      label: 'Kids',
      description: 'Easy-wear pieces built for movement, color, and playful character.',
      eyebrow: 'Everyday Comfort',
      imagePath: 'data/resources/Image/category/kids.PNG'
    }
  ];

  // Computed properties
  currentSlide = computed(() => this.carouselSlides[this.currentSlideIndex()]);
  nextSlideIndex = computed(() => (this.currentSlideIndex() + 1) % this.carouselSlides.length);
  nextSlide = computed(() => this.carouselSlides[this.nextSlideIndex()]);

  constructor() {
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

  openReviewForm() {
    this.reviewSubmitted.set(false);
    this.reviewMessage.set('');
    this.reviewFormOpen.set(true);
  }

  closeReviewForm() {
    this.reviewFormOpen.set(false);
    this.reviewSubmitted.set(false);
    this.reviewMessage.set('');
    this.selectedPhotoName.set('No file selected');
  }

  onRatingSelect(rating: number) {
    this.reviewForm.update(current => ({ ...current, rating }));
  }

  updateReviewField(field: keyof ReviewSubmission, value: string | number) {
    this.reviewForm.update(current => ({
      ...current,
      [field]: value
    }));
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedPhotoName.set(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.reviewForm.update(current => ({
        ...current,
        photoUrl: result
      }));
    };
    reader.readAsDataURL(file);
  }

  clearPhotoSelection() {
    this.selectedPhotoName.set('No file selected');
    this.reviewForm.update(current => ({
      ...current,
      photoUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'
    }));
  }

  submitReview() {
    const form = this.reviewForm();
    if (!form.customerName || !form.email || !form.reviewText) {
      this.reviewMessage.set('Please complete your name, email, and feedback before submitting.');
      return;
    }

    this.submittingReview.set(true);
    this.reviewMessage.set('');

    this.reviewService.submitReview(form).subscribe({
      next: response => {
        this.submittingReview.set(false);
        if (response.success) {
          this.reviewSubmitted.set(true);
          this.reviewMessage.set('Your review was submitted successfully. It is now pending approval and may unlock a 5% discount after review.');
          this.reviewForm.set({
            customerName: '',
            email: '',
            mobile: '',
            productId: 'TS-MEN-001',
            productName: 'Classic Black Crew Neck',
            productCategory: 'men',
            size: 'M',
            rating: 5,
            reviewText: '',
            photoUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80'
          });
          setTimeout(() => this.closeReviewForm(), 2200);
        } else {
          this.reviewMessage.set(response.message);
        }
      },
      error: () => {
        this.submittingReview.set(false);
        this.reviewMessage.set('Unable to submit review right now. Please try again.');
      }
    });
  }

  prevReview() {
    const reviews = this.reviewService.getFeaturedReviews();
    const nextIndex = this.reviewIndex() - 1;
    this.reviewIndex.set(nextIndex < 0 ? Math.max(0, reviews.length - 3) : nextIndex);
  }

  nextReview() {
    const reviews = this.reviewService.getFeaturedReviews();
    const maxStart = Math.max(0, reviews.length - 3);
    const nextIndex = this.reviewIndex() + 1;
    this.reviewIndex.set(nextIndex > maxStart ? 0 : nextIndex);
  }
}
