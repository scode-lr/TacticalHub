import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { MatchService } from '@services/match.service';
import { TeamStanding } from '@models/match-detail.model';

@Component({
  selector: 'app-match-standings',
  templateUrl: './match-standings.component.html',
  styleUrls: ['./match-standings.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class MatchStandingsComponent implements OnInit {
  @Input({ required: true }) matchId!: number;

  private matchService = inject(MatchService);
  readonly standings = signal<TeamStanding[]>([]);

  ngOnInit() {
    const standingsData = this.matchService.getStandings(this.matchId);
    this.standings.set(standingsData);
  }
}
