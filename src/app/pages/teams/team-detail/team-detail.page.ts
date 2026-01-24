import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { NavigationService } from '@services/navigation.service';
import { TeamMockService } from '@services/team-mock.service';
import { Team } from '@models/team.model';
import { Player, Position } from '@models/match-detail.model';
import { PlayerFormModalComponent, NewPlayerData } from '@components/modals';
import { addIcons } from 'ionicons';
import { arrowBackOutline, trophyOutline, addOutline } from 'ionicons/icons';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, PlayerFormModalComponent]
})
export class TeamDetailPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly teamMockService = inject(TeamMockService);
  
  readonly team = signal<Team | null>(null);
  readonly players = signal<Player[]>([]);
  readonly positions = [Position.GK, Position.DF, Position.MF, Position.FW];
  readonly isModalOpen = signal<boolean>(false);
  
  constructor() {
    addIcons({ arrowBackOutline, trophyOutline, addOutline });
  }

  ngOnInit(): void {
    const id = this.navigationService.findRouteParam('teamId');
    if (id) {
      const foundTeam = this.teamMockService.getTeamById(Number(id));
      if (foundTeam) {
        this.team.set(foundTeam);
        const teamPlayers = this.teamMockService.getTeamPlayers(Number(id));
        this.players.set(teamPlayers);
      }
    }
  }
  
  goBack(): void {
    this.navigationService.goBack();
  }

  getPositionLabel(position: Position): string {
    const labels: Record<Position, string> = {
      [Position.GK]: 'Goalkeeper',
      [Position.DF]: 'Defender',
      [Position.MF]: 'Midfielder',
      [Position.FW]: 'Forward'
    };
    return labels[position];
  }

  getPlayersByPosition(position: Position): Player[] {
    return this.players().filter(p => p.position === position);
  }

  openAddPlayerModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onPlayerAdded(playerData: NewPlayerData): void {
    const currentPlayers = this.players();
    const maxId = currentPlayers.reduce((max, p) => Math.max(max, p.id), 0);
    
    const newPlayer: Player = {
      id: maxId + 1,
      name: playerData.name,
      number: playerData.number,
      position: playerData.position,
      isCaptain: playerData.isCaptain
    };

    this.players.update(players => [...players, newPlayer]);
  }
}
