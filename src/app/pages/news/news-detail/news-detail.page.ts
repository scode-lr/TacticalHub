import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsCardComponent } from '@components/news-card/news-card.component';
import { ImageLightboxComponent } from '@components/image-lightbox/image-lightbox.component';
import { RichTextPipe } from '@core/pipes/rich-text.pipe';
import { NewsPost } from '@models/news.model';
import { NewsService } from '@services/news.service';
import { ClubService } from '@services/club.service';
import { RoleType } from '@models/role.model';
import { TranslationService } from '@core/services/i18n/translation.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, NewsCardComponent, ImageLightboxComponent, RichTextPipe]
})
export class NewsDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly newsService = inject(NewsService);
  private readonly clubService = inject(ClubService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly news = signal<NewsPost | null>(null);
  readonly relatedNews = signal<NewsPost | null>(null);
  readonly loading = signal(true);
  readonly isLightboxOpen = signal(false);
  readonly lightboxStartIndex = signal(0);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => this.loadNews(params.get('newsId')));
  }

  get primaryImageUrl(): string | null {
    const images = this.news()?.images ?? [];
    return images.find(image => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
  }

  /** All of the article's images, ordered for the lightbox — same order the admin arranged them in. */
  get imageUrls(): string[] {
    const images = this.news()?.images ?? [];
    return [...images].sort((a, b) => a.sortOrder - b.sortOrder).map(image => image.imageUrl);
  }

  /** The non-featured photos, shown as a strip under the hero so they're visible before opening the lightbox. */
  get secondaryImageUrls(): string[] {
    const primary = this.primaryImageUrl;
    return this.imageUrls.filter(url => url !== primary);
  }

  openLightbox(): void {
    this.openLightboxAt(this.primaryImageUrl ?? '');
  }

  openLightboxAt(url: string): void {
    const urls = this.imageUrls;
    if (urls.length === 0) return;

    const startIndex = Math.max(0, urls.indexOf(url));
    this.lightboxStartIndex.set(startIndex);
    this.isLightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.isLightboxOpen.set(false);
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  getFormattedDate(date: string | null | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString(this.translationService.getCurrentLanguage(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  openExternalLink(): void {
    const url = this.news()?.externalLinkUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  openLinkedForm(): void {
    const formId = this.news()?.linkedFormId;
    if (!formId) return;

    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    if (roleType === RoleType.Admin) {
      this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'settings-forms', formId.toString()]);
      return;
    }

    if (roleType === RoleType.Member) {
      this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'forms', formId.toString()]);
    }
  }

  openRelated(id: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news', id.toString()]);
  }

  async share(): Promise<void> {
    const post = this.news();
    if (!post) return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {
        // user cancelled the native share sheet
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      this.toastService.show(this.translationService.instant('user.news.linkCopied'), 'success');
    } catch {
      this.toastService.show(this.translationService.instant('user.news.shareFailed'), 'danger');
    }
  }

  private async loadNews(id: string | null): Promise<void> {
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    if (!id || !clubId) {
      this.news.set(null);
      this.relatedNews.set(null);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.relatedNews.set(null);
    try {
      const post = await this.newsService.getById(clubId, Number(id));
      this.news.set(post);
      await this.loadRelated(clubId, post.id);
    } catch {
      this.news.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Picks the article right next to the current one in the feed (the next-older one, or the
   * previous-newer one when the current article is the oldest fetched) — not just the first item
   * of page 1, which always showed the same one or two most recent posts regardless of which
   * article you were actually reading.
   */
  private async loadRelated(clubId: number, excludeId: number): Promise<void> {
    try {
      const page = await this.newsService.getByClubId(clubId, false, 50, 0);
      const items = page.items;
      const currentIndex = items.findIndex(item => item.id === excludeId);

      if (currentIndex === -1) {
        this.relatedNews.set(items.find(item => item.id !== excludeId) ?? null);
        return;
      }

      this.relatedNews.set(items[currentIndex + 1] ?? items[currentIndex - 1] ?? null);
    } catch {
      this.relatedNews.set(null);
    }
  }
}
