export enum Position {
    GK = 'GK',
    DF = 'DF',
    MF = 'MF',
    FW = 'FW'
}

export interface MatchDetail {
    id: number;
    team: string;
    teamVersus: string;
    resultLocal: number;
    resultAway: number;
    date: Date;
    location: 'home' | 'away';
    competition: string;
    stadium: string;
    referee?: string;
    status: 'scheduled' | 'live' | 'finished';
}

export interface Player {
    id: number;
    number: number;
    name: string;
    position: Position;
    isCaptain?: boolean;
}

export interface GoalScorer {
    id: number;
    playerId: number;
    playerName: string;
    playerNumber: number;
    minute: number;
    team: 'local' | 'away';
    isPenalty?: boolean;
    isOwnGoal?: boolean;
}

export interface LineupData {
    local: {
        starters: Player[];
        substitutes: Player[];
    };
    away: {
        starters: Player[];
        substitutes: Player[];
    };
}

export interface TeamStanding {
    position: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}