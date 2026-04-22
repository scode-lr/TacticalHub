import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonChip, IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { UpvotesComponent } from '@components/upvotes/upvotes.component';
import { CommentsComponent } from '@components/comments/comments.component';
import { News, NewsCategory, NewsComment } from '@models/news.model';
import { mockNews } from '@mocks/news.mock';
import { DefaultImageDirective } from "@core/directives";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonChip, TranslatePipe, UpvotesComponent, CommentsComponent, DefaultImageDirective, IonImg]
})
export class NewsDetailPage implements OnInit {
  private navigationService = inject(NavigationService);
  
  readonly news = signal<News | null>(null);
  
  ngOnInit() {
    const id = this.navigationService.findRouteParam('newsId');
    if (id) {
      const foundNews = mockNews.find(n => n.id === Number(id));
      this.news.set(foundNews || null);
    }
  }
  
  goBack(): void {
    this.navigationService.goBack();
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
  
  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  vote(voteType: 'up' | 'down'): void {
    const currentNews = this.news();
    if (!currentNews) return;
    
    const currentVote = currentNews.userVote;
    let newUpvotes = currentNews.upvotes;
    let newDownvotes = currentNews.downvotes;
    let newUserVote: 'up' | 'down' | null = voteType;
    
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
    
    this.news.set({
      ...currentNews,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: newUserVote
    });
  }
  
  onVoteComment(event: { commentId: number; voteType: 'up' | 'down'; parentCommentId?: number }): void {
    this.voteComment(event.commentId, event.voteType, event.parentCommentId);
  }
  
  voteComment(commentId: number, voteType: 'up' | 'down', parentCommentId?: number): void {
    const currentNews = this.news();
    if (!currentNews) return;
    
    const updateCommentVotes = (comments: NewsComment[]): NewsComment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;
          
          if (voteType === 'up') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }
          
          return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes };
        }
        
        if (comment.replies) {
          return { ...comment, replies: updateCommentVotes(comment.replies) };
        }
        
        return comment;
      });
    };
    
    this.news.set({
      ...currentNews,
      comments: updateCommentVotes(currentNews.comments)
    });
  }
}
