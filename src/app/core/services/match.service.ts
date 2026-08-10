import { Injectable } from '@angular/core';
import { Match } from '@models/match.model';
import { MatchDetail, LineupData, GoalScorer, TeamStanding } from '@models/match-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private readonly matches: Match[] = [];

  getMatches(): Match[] {
    return this.matches;
  }

  getMatchById(id: number): Match | undefined {
    return this.matches.find(match => match.id === id);
  }

  getMatchDetail(_id: number): MatchDetail | null {
    return null;
  }

  getLineup(_matchId: number): LineupData | null {
    return null;
  }

  getGoalScorers(_matchId: number): GoalScorer[] {
    return [];
  }

  getStandings(_matchId: number): TeamStanding[] {
    return [];
  }

  getRelatedMatches(_matchId: number): Match[] {
    return [];
  }
}
