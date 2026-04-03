import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { MatchService } from '@services/match.service';
import { MatchDetail } from '@models/match-detail.model';
import { MatchLineupComponent } from '@components/match-lineup/match-lineup.component';
import { MatchGoalScorersComponent } from '@components/match-goal-scorers/match-goal-scorers.component';
import { MatchStandingsComponent } from '@components/match-standings/match-standings.component';
import { MatchRelatedComponent } from '@components/match-related/match-related.component';

export type TabType = 'lineup' | 'goals' | 'standings' | 'matches';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.page.html',
  styleUrls: ['./match-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonButton,
    IonSegment,
    IonSegmentButton,
    TranslatePipe,
    MatchLineupComponent,
    MatchGoalScorersComponent,
    MatchStandingsComponent,
    MatchRelatedComponent
  ]
})
export class MatchDetailPage implements OnInit {
  private navigationService = inject(NavigationService);
  private matchService = inject(MatchService);

  readonly match = signal<MatchDetail | null>(null);
  readonly selectedTab = signal<TabType>('lineup');

  readonly hasStarted = computed(() => {
    const m = this.match();
    return m ? m.resultLocal > 0 || m.resultAway > 0 : false;
  });

  ngOnInit() {
    const id = this.navigationService.findRouteParam('matchId');
    if (id) {
      const matchDetail = this.matchService.getMatchDetail(Number(id));
      this.match.set(matchDetail);
    }
  }

  goBack(): void {
    this.navigationService.goBack();
  }

  selectTab(tab: TabType): void {
    this.selectedTab.set(tab);
  }

  onTabChange(event: any): void {
    const value = event.detail.value as TabType;
    this.selectTab(value);
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getFormattedTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get displayLocalScore(): string {
    const m = this.match();
    return m && this.hasStarted() ? m.resultLocal.toString() : '-';
  }

  get displayAwayScore(): string {
    const m = this.match();
    return m && this.hasStarted() ? m.resultAway.toString() : '-';
  }
}
