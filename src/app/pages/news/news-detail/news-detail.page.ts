import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsPost } from '@models/news.model';
import { NewsService } from '@services/news.service';
import { ClubService } from '@services/club.service';
import { RoleType } from '@models/role.model';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class NewsDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly newsService = inject(NewsService);
  private readonly clubService = inject(ClubService);
  
  readonly news = signal<NewsPost | null>(null);
  readonly loading = signal(true);
  
  async ngOnInit(): Promise<void> {
    const id = this.navigationService.findRouteParam('newsId');
    const clubId = this.clubService.getCurrentClubId() ?? 0;
    if (!id || !clubId) {
      this.loading.set(false);
      return;
    }

    try {
      this.news.set(await this.newsService.getById(clubId, Number(id)));
    } catch {
      this.news.set(null);
    } finally {
      this.loading.set(false);
    }
  }
  
  goBack(): void {
    this.navigationService.goBack();
  }
  
  get primaryImageUrl(): string | null {
    const images = this.news()?.images ?? [];
    return images.find(image => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
  }
  
  getFormattedDate(date: string | null | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
}
