import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UpvotesComponent } from '../upvotes/upvotes.component';
import { NewsComment, VoteType } from '@models/news.model';
import { DefaultImageDirective } from '@core/directives';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  standalone: true,
  imports: [CommonModule,  TranslatePipe, UpvotesComponent, IonImg, DefaultImageDirective]
})
export class CommentsComponent {
  readonly comments = input.required<NewsComment[]>();
  readonly commentCount = input.required<number>();
  
  readonly voteComment = output<{ commentId: string; voteType: VoteType; parentCommentId?: string }>();
  
  onVoteComment(commentId: string, voteType: VoteType, parentCommentId?: string): void {
    this.voteComment.emit({ commentId, voteType, parentCommentId });
  }
}
