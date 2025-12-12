import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonChip } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UpvotesComponent } from '../upvotes/upvotes.component';
import { News, NewsCategory, VoteType } from '@models/news.model';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonChip, TranslatePipe, UpvotesComponent]
})
export class NewsCardComponent {
  readonly news = input.required<News>();
  readonly animationDelay = input<number>(0);
  
  readonly cardClick = output<number>();
  readonly voteChange = output<{ newsId: number; voteType: VoteType }>();
  
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
  
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  }
  
  onCardClick(): void {
    this.cardClick.emit(this.news().id);
  }
  
  onVoteChange(voteType: 'up' | 'down'): void {
    this.voteChange.emit({ newsId: this.news().id, voteType });
  }
}
