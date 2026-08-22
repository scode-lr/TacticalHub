import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonModal, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsCardComponent } from '@components/news-card/news-card.component';
import { NewsPost, TimeFilter } from '@models/news.model';
import { NewsService } from '@services/news.service';
import { ClubService } from '@services/club.service';
import { PullToRefreshComponent } from '@components/pull-to-refresh/pull-to-refresh.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, IonSpinner, TranslatePipe, NewsCardComponent, PullToRefreshComponent]
})
export class NewsPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly newsService = inject(NewsService);
  private readonly clubService = inject(ClubService);

  readonly news = signal<NewsPost[]>([]);
  readonly loading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(false);
  readonly selectedTimeFilter = signal<TimeFilter>(TimeFilter.All);
  readonly showTimeModal = signal<boolean>(false);

  readonly TimeFilter = TimeFilter;

  private readonly limit = 12;
  private offset = 0;
  private clubId = 0;

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId() ?? 0;
    await this.loadInitialNews();
  }

  async onRefresh(complete: () => void): Promise<void> {
    await this.loadInitialNews();
    complete();
  }

  readonly filteredNews = computed(() => {
    let filtered = this.news();

    const timeFilter = this.selectedTimeFilter();
    if (timeFilter !== TimeFilter.All) {
      const now = new Date();
      const filterDate = new Date();

      switch (timeFilter) {
        case TimeFilter.Today:
          filterDate.setHours(0, 0, 0, 0);
          break;
        case TimeFilter.Week:
          filterDate.setDate(now.getDate() - 7);
          break;
        case TimeFilter.Month:
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case TimeFilter.Year:
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(n => new Date(n.publishedAt ?? n.createdAt) >= filterDate);
    }

    return filtered;
  });

  readonly featuredNews = computed(() => this.filteredNews()[0] ?? null);
  readonly restNews = computed(() => this.filteredNews().slice(1));

  readonly timeFilters = [
    { value: TimeFilter.All, label: 'user.news.time.all' },
    { value: TimeFilter.Today, label: 'user.news.time.today' },
    { value: TimeFilter.Week, label: 'user.news.time.week' },
    { value: TimeFilter.Month, label: 'user.news.time.month' },
    { value: TimeFilter.Year, label: 'user.news.time.year' }
  ];

  async loadInitialNews(): Promise<void> {
    try {
      this.loading.set(true);
      this.offset = 0;
      const page = await this.newsService.getByClubId(this.clubId, false, this.limit, this.offset);
      this.news.set(page.items);
      this.hasMore.set(page.hasMore);
      this.offset += page.items.length;
    } catch {
      this.news.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMoreNews(): Promise<void> {
    if (this.isLoadingMore() || !this.hasMore()) return;

    try {
      this.isLoadingMore.set(true);
      const page = await this.newsService.getByClubId(this.clubId, false, this.limit, this.offset);
      this.news.update(existing => [...existing, ...page.items]);
      this.hasMore.set(page.hasMore);
      this.offset += page.items.length;
    } catch {
      this.offset = this.news().length;
      this.hasMore.set(false);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  selectTimeFilter(timeFilter: TimeFilter): void {
    this.selectedTimeFilter.set(timeFilter);
    this.showTimeModal.set(false);
  }

  openNews(id: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news', id.toString()]);
  }
}
