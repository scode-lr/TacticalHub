import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { NewsPost } from '@models/news.model';
import { AppStatus } from '@models/app-status.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class NewsCardComponent {
  private readonly translationService = inject(TranslationService);
  readonly news = input.required<NewsPost>();
  readonly animationDelay = input<number>(0);
  readonly isAdmin = input<boolean>(false);
  
  readonly cardClick = output<number>();
  readonly editClick = output<NewsPost>();
  readonly publishClick = output<NewsPost>();
  readonly unpublishClick = output<NewsPost>();
  readonly deleteClick = output<NewsPost>();

  readonly AppStatus = AppStatus;

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

  onEdit(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.news());
  }

  onPublish(event: Event): void {
    event.stopPropagation();
    this.publishClick.emit(this.news());
  }

  onUnpublish(event: Event): void {
    event.stopPropagation();
    this.unpublishClick.emit(this.news());
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.news());
  }
}
