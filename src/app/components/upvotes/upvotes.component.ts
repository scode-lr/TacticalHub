import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { VoteType } from '@core/models';

@Component({
  selector: 'app-upvotes',
  templateUrl: './upvotes.component.html',
  styleUrls: ['./upvotes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class UpvotesComponent {
  readonly upvotes = input.required<number>();
  readonly downvotes = input.required<number>();
  readonly userVote = input<VoteType | null>(null);
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  
  readonly voteChange = output<VoteType>();
  
  get voteScore(): number {
    return this.upvotes() - this.downvotes();
  }
  
  vote(voteType: VoteType): void {
    this.voteChange.emit(voteType);
  }
}
