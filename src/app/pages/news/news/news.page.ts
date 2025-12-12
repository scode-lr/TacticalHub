import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonModal, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsCardComponent } from '@components/news-card/news-card.component';
import { News, NewsCategory, TimeFilter, VoteType } from '@models/news.model';
import { mockNews } from '@mocks/news.mock';

@Component({
  selector: 'app-viewer-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonModal, IonContent, TranslatePipe, NewsCardComponent]
})
export class ViewerNewsPage {
  private navigationService = inject(NavigationService);
  private route = inject(ActivatedRoute);
  
  readonly news = signal<News[]>(mockNews);
  readonly selectedCategory = signal<NewsCategory | 'all'>('all');
  readonly selectedTimeFilter = signal<TimeFilter>(TimeFilter.All);
  readonly showCategoryModal = signal<boolean>(false);
  readonly showTimeModal = signal<boolean>(false);
  readonly showCategoryDropdown = signal<boolean>(false);
  readonly showTimeDropdown = signal<boolean>(false);
  
  readonly TimeFilter = TimeFilter;
  readonly NewsCategory = NewsCategory;
  
  readonly filteredNews = computed(() => {
    let filtered = this.news();
    
    const category = this.selectedCategory();
    if (category !== 'all') {
      filtered = filtered.filter(n => n.category === category);
    }
    
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
      
      filtered = filtered.filter(n => new Date(n.publishedAt) >= filterDate);
    }
    
    return filtered;
  });
  
  readonly categories = [
    { value: 'all' as const, label: 'viewer.news.categories.all' },
    { value: NewsCategory.General as const, label: 'viewer.news.categories.general' },
    { value: NewsCategory.Match as const, label: 'viewer.news.categories.match' },
    { value: NewsCategory.Training as const, label: 'viewer.news.categories.training' },
    { value: NewsCategory.Event as const, label: 'viewer.news.categories.event' },
    { value: NewsCategory.Announcement as const, label: 'viewer.news.categories.announcement' },
    { value: NewsCategory.Achievement as const, label: 'viewer.news.categories.achievement' }
  ];
  
  readonly timeFilters = [
    { value: TimeFilter.All, label: 'viewer.news.time.all' },
    { value: TimeFilter.Today, label: 'viewer.news.time.today' },
    { value: TimeFilter.Week, label: 'viewer.news.time.week' },
    { value: TimeFilter.Month, label: 'viewer.news.time.month' },
    { value: TimeFilter.Year, label: 'viewer.news.time.year' }
  ];
  
  selectCategory(category: NewsCategory | 'all'): void {
    this.selectedCategory.set(category);
    this.showCategoryModal.set(false);
    this.showCategoryDropdown.set(false);
  }
  
  selectTimeFilter(timeFilter: TimeFilter): void {
    this.selectedTimeFilter.set(timeFilter);
    this.showTimeModal.set(false);
    this.showTimeDropdown.set(false);
  }
  
  openCategoryFilter(): void {
    if (window.innerWidth <= 768) {
      this.showCategoryModal.set(true);
    } else {
      this.showCategoryDropdown.set(!this.showCategoryDropdown());
      this.showTimeDropdown.set(false);
    }
  }
  
  openTimeFilter(): void {
    if (window.innerWidth <= 768) {
      this.showTimeModal.set(true);
    } else {
      this.showTimeDropdown.set(!this.showTimeDropdown());
      this.showCategoryDropdown.set(false);
    }
  }
  
  getCategoryColor(category: NewsCategory): string {
    const colors: Record<NewsCategory, string> = {
      [NewsCategory.General]: 'medium',
      [NewsCategory.Match]: 'primary',
      [NewsCategory.Training]: 'success',
      [NewsCategory.Event]: 'tertiary',
      [NewsCategory.Announcement]: 'warning',
      [NewsCategory.Achievement]: 'secondary'
    };
    return colors[category];
  }
  
  openNews(id: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news', id.toString()]);
  }
  
  vote(newsId: number, voteType: VoteType): void {
    this.news.update(newsList => {
      return newsList.map(news => {
        if (news.id !== newsId) return news;
        
        const currentVote = news.userVote;
        let newUpvotes = news.upvotes;
        let newDownvotes = news.downvotes;
        let newUserVote: VoteType | null = voteType;
        
        if (currentVote === voteType) {
          newUserVote = null;
          if (voteType === 'up') {
            newUpvotes--;
          } else {
            newDownvotes--;
          }
        } else if (currentVote) {
          if (currentVote === 'up') {
            newUpvotes--;
            newDownvotes++;
          } else {
            newDownvotes--;
            newUpvotes++;
          }
        } else {
          if (voteType === 'up') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }
        }
        
        return {
          ...news,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      });
    });
  }
}
