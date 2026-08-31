import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { newspaperOutline, chevronForwardOutline } from 'ionicons/icons';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { NewsService } from '@services/news.service';
import { NewsPostSummary } from '@models/news.model';

/**
 * "Next article" widget for the bottom of a news post. Deliberately its own component (rather than
 * inline in NewsDetailPage) so the parent can wrap it in `@defer (on viewport)` — it neither loads
 * its JS nor fires its fetch until the reader actually scrolls near it.
 */
@Component({
  selector: 'app-related-news',
  templateUrl: './related-news.component.html',
  styleUrls: ['./related-news.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe],
})
export class RelatedNewsComponent implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly translationService = inject(TranslationService);

  readonly clubId = input.required<number>();
  readonly excludeId = input.required<number>();

  readonly opened = output<number>();

  readonly related = signal<NewsPostSummary | null>(null);

  constructor() {
    addIcons({ newspaperOutline, chevronForwardOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.related.set(await this.newsService.getAdjacent(this.clubId(), this.excludeId()));
    } catch {
      this.related.set(null);
    }
  }

  primaryImageUrl(post: NewsPostSummary): string | null {
    return post.images.find(image => image.isPrimary)?.imageUrl ?? post.images[0]?.imageUrl ?? null;
  }

  getTimeAgo(date: string | null | undefined): string {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: this.getLocale() });
  }

  open(id: number): void {
    this.opened.emit(id);
  }

  private getLocale(): Locale {
    switch (this.translationService.getCurrentLanguage()) {
      case 'es': return es;
      case 'ca': return ca;
      default: return enUS;
    }
  }
}
