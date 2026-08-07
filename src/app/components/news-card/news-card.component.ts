import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslationService } from '@core/services/i18n/translation.service';
import { NewsPost } from '@models/news.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class NewsCardComponent {
  private readonly translationService = inject(TranslationService);
  readonly news = input.required<NewsPost>();
  readonly animationDelay = input<number>(0);
  readonly variant = input<'featured' | 'row'>('row');

  readonly cardClick = output<number>();

  get primaryImageUrl(): string | null {
    const images = this.news().images ?? [];
    return images.find(image => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
  }

  getTimeAgo(date: string | null | undefined): string {
    if (!date) return this.translationService.instant('user.news.statusDraft');
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: this.getLocale() });
  }

  private getLocale(): Locale {
    const lang = this.translationService.getCurrentLanguage();
    switch (lang) {
      case 'es': return es;
      case 'ca': return ca;
      default: return enUS;
    }
  }

  onCardClick(): void {
    this.cardClick.emit(this.news().id);
  }
}
