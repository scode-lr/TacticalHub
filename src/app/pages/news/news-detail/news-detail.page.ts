import { Component, inject, signal, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsCardComponent } from '@components/news-card/news-card.component';
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
  imports: [CommonModule, IonIcon, TranslatePipe, NewsCardComponent]
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

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => this.loadNews(params.get('newsId')));
  }

  get primaryImageUrl(): string | null {
    const images = this.news()?.images ?? [];
    return images.find(image => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
  }

  get bodyParagraphs(): string[] {
    const body = this.news()?.body ?? '';
    return body.split(/\n+/).map(paragraph => paragraph.trim()).filter(Boolean);
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

  private async loadRelated(clubId: number, excludeId: number): Promise<void> {
    try {
      const page = await this.newsService.getByClubId(clubId, false, 3, 0);
      this.relatedNews.set(page.items.find(item => item.id !== excludeId) ?? null);
    } catch {
      this.relatedNews.set(null);
    }
  }
}
