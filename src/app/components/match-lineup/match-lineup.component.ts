import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { MatchService } from '@services/match.service';
import { LineupData, Player } from '@models/match-detail.model';

@Component({
  selector: 'app-match-lineup',
  templateUrl: './match-lineup.component.html',
  styleUrls: ['./match-lineup.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class MatchLineupComponent implements OnInit {
  @Input({ required: true }) matchId!: number;

  private matchService = inject(MatchService);
  readonly lineup = signal<LineupData | null>(null);

  ngOnInit() {
    const lineupData = this.matchService.getLineup(this.matchId);
    this.lineup.set(lineupData);
  }

  getPositionLabel(position: string): string {
    const labels: Record<string, string> = {
      'GK': 'Portero',
      'DF': 'Defensa',
      'MF': 'Centrocampista',
      'FW': 'Delantero'
    };
    return labels[position] || position;
  }

  getPlayersByPosition(players: Player[], position: string): Player[] {
    return players.filter(p => p.position === position);
  }
}
