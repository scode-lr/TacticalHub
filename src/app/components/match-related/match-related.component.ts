import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { MatchService } from '@services/match.service';
import { Match } from '@core/models/match.model';

@Component({
  selector: 'app-match-related',
  templateUrl: './match-related.component.html',
  styleUrls: ['./match-related.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class MatchRelatedComponent implements OnInit {
  @Input({ required: true }) matchId!: number;

  private matchService = inject(MatchService);
  private navigationService = inject(NavigationService);
  
  readonly relatedMatches = signal<Match[]>([]);

  ngOnInit() {
    const matches = this.matchService.getRelatedMatches(this.matchId);
    this.relatedMatches.set(matches);
  }

  get previousMatches(): Match[] {
    const now = new Date();
    return this.relatedMatches()
      .filter(m => new Date(m.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  get upcomingMatches(): Match[] {
    const now = new Date();
    return this.relatedMatches()
      .filter(m => new Date(m.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  hasStarted(match: Match): boolean {
    return match.resultLocal > 0 || match.resultAway > 0;
  }

  getDisplayScore(score: number, match: Match): string {
    return this.hasStarted(match) ? score.toString() : '-';
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  getFormattedTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goToMatch(matchId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'matches', matchId.toString()]);
  }
}
