import { Injectable, signal } from '@angular/core';
import { Match } from '@models/match.model';
import { MatchDetail, LineupData, GoalScorer, TeamStanding } from '@models/match-detail.model';
import { mockMatches } from '@mocks/match.mock';
import { mockMatchDetail, mockLineup, mockGoalScorers, mockStandings, mockRelatedMatches } from '@mocks/match-detail.mock';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matches = signal<Match[]>(mockMatches);

  getMatches(): Match[] {
    return this.matches();
  }

  getMatchById(id: number): Match | undefined {
    return this.matches().find(match => match.id === id);
  }

  getMatchDetail(id: number): MatchDetail | null {
    if (id === 1) {
      return mockMatchDetail;
    }
    return null;
  }

  getLineup(matchId: number): LineupData | null {
    if (matchId === 1) {
      return mockLineup;
    }
    return null;
  }

  getGoalScorers(matchId: number): GoalScorer[] {
    if (matchId === 1) {
      return mockGoalScorers;
    }
    return [];
  }

  getStandings(matchId: number): TeamStanding[] {
    if (matchId === 1) {
      return mockStandings;
    }
    return [];
  }

  getRelatedMatches(matchId: number): Match[] {
    if (matchId === 1) {
      return mockRelatedMatches;
    }
    return [];
  }
}
