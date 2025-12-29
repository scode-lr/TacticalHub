import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { MatchService } from '@services/match.service';
import { GoalScorer } from '@models/match-detail.model';

@Component({
  selector: 'app-match-goal-scorers',
  templateUrl: './match-goal-scorers.component.html',
  styleUrls: ['./match-goal-scorers.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class MatchGoalScorersComponent implements OnInit {
  @Input({ required: true }) matchId!: number;

  private matchService = inject(MatchService);
  readonly goalScorers = signal<GoalScorer[]>([]);

  ngOnInit() {
    const goals = this.matchService.getGoalScorers(this.matchId);
    this.goalScorers.set(goals);
  }

  get localGoals(): GoalScorer[] {
    return this.goalScorers().filter(g => g.team === 'local');
  }

  get awayGoals(): GoalScorer[] {
    return this.goalScorers().filter(g => g.team === 'away');
  }
}
