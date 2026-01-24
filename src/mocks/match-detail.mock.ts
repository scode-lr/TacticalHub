import { Match } from '@core/models/match.model';
import { MatchDetail, LineupData, GoalScorer, TeamStanding, Position } from '@models/match-detail.model';

export const mockMatchDetail: MatchDetail = {
    id: 1,
    team: 'Juvenil A',
    teamVersus: 'FC Barcelona',
    resultLocal: 3,
    resultAway: 1,
    date: new Date('2026-01-03T10:00:00'),
    location: 'home',
    competition: 'Liga Nacional Juvenil',
    stadium: 'Municipal de Voltregà',
    referee: 'Carlos Martínez',
    status: 'finished'
};

export const mockLineup: LineupData = {
    local: {
        starters: [
            { id: 1, number: 1, name: 'Marc Torres', position: Position.GK },
            { id: 2, number: 2, name: 'Jordi Vila', position: Position.DF },
            { id: 3, number: 5, name: 'Pau Martí', position: Position.DF, isCaptain: true },
            { id: 4, number: 4, name: 'Xavier López', position: Position.DF },
            { id: 5, number: 3, name: 'David Pujol', position: Position.DF },
            { id: 6, number: 8, name: 'Albert Garcia', position: Position.MF },
            { id: 7, number: 6, name: 'Roger Soler', position: Position.MF },
            { id: 8, number: 10, name: 'Arnau Roig', position: Position.MF },
            { id: 9, number: 7, name: 'Sergi Ferrer', position: Position.FW },
            { id: 10, number: 9, name: 'Marc Font', position: Position.FW },
            { id: 11, number: 11, name: 'Joan Camps', position: Position.FW }
        ],
        substitutes: [
            { id: 12, number: 13, name: 'Pol Riera', position: Position.GK },
            { id: 13, number: 14, name: 'Ivan Serra', position: Position.DF },
            { id: 14, number: 15, name: 'Nil Bosch', position: Position.MF },
            { id: 15, number: 16, name: 'Oriol Valls', position: Position.FW }
        ]
    },
    away: {
        starters: [
            { id: 16, number: 1, name: 'Alex Ruiz', position: Position.GK },
            { id: 17, number: 2, name: 'Hugo Sanz', position: Position.DF },
            { id: 18, number: 5, name: 'Eric Jiménez', position: Position.DF, isCaptain: true },
            { id: 19, number: 4, name: 'Adrià Molina', position: Position.DF },
            { id: 20, number: 3, name: 'Pol Navarro', position: Position.DF },
            { id: 21, number: 8, name: 'Marc Casals', position: Position.MF },
            { id: 22, number: 6, name: 'Ansu Díaz', position: Position.MF },
            { id: 23, number: 10, name: 'Gerard Mas', position: Position.MF },
            { id: 24, number: 7, name: 'Joel Prat', position: Position.MF },
            { id: 25, number: 9, name: 'Dani Puig', position: Position.FW },
            { id: 26, number: 11, name: 'Carles Mora', position: Position.FW }
        ],
        substitutes: [
            { id: 27, number: 13, name: 'Biel Costa', position: Position.GK },
            { id: 28, number: 14, name: 'Ferran Vila', position: Position.DF },
            { id: 29, number: 15, name: 'Raul Campos', position: Position.MF },
            { id: 30, number: 16, name: 'Miquel Sala', position: Position.FW }
        ]
    }
};

export const mockGoalScorers: GoalScorer[] = [
    {
        id: 1,
        playerId: 9,
        playerName: 'Sergi Ferrer',
        playerNumber: 7,
        minute: 12,
        team: 'local'
    },
    {
        id: 2,
        playerId: 10,
        playerName: 'Marc Font',
        playerNumber: 9,
        minute: 34,
        team: 'local'
    },
    {
        id: 3,
        playerId: 25,
        playerName: 'Dani Puig',
        playerNumber: 9,
        minute: 56,
        team: 'away'
    },
    {
        id: 4,
        playerId: 11,
        playerName: 'Joan Camps',
        playerNumber: 11,
        minute: 78,
        team: 'local',
        isPenalty: true
    }
];

export const mockStandings: TeamStanding[] = [
    { position: 1, team: 'RCD Espanyol', played: 18, won: 14, drawn: 3, lost: 1, goalsFor: 45, goalsAgainst: 12, goalDifference: 33, points: 45 },
    { position: 2, team: 'Juvenil A', played: 18, won: 13, drawn: 2, lost: 3, goalsFor: 42, goalsAgainst: 18, goalDifference: 24, points: 41 },
    { position: 3, team: 'FC Barcelona', played: 18, won: 12, drawn: 4, lost: 2, goalsFor: 38, goalsAgainst: 15, goalDifference: 23, points: 40 },
    { position: 4, team: 'Girona FC', played: 18, won: 11, drawn: 3, lost: 4, goalsFor: 35, goalsAgainst: 20, goalDifference: 15, points: 36 },
    { position: 5, team: 'UE Cornellà', played: 18, won: 9, drawn: 5, lost: 4, goalsFor: 30, goalsAgainst: 22, goalDifference: 8, points: 32 },
    { position: 6, team: 'CE Europa', played: 18, won: 8, drawn: 4, lost: 6, goalsFor: 28, goalsAgainst: 24, goalDifference: 4, points: 28 },
    { position: 7, team: 'CF Damm', played: 18, won: 7, drawn: 6, lost: 5, goalsFor: 26, goalsAgainst: 23, goalDifference: 3, points: 27 },
    { position: 8, team: 'CE Sabadell', played: 18, won: 6, drawn: 5, lost: 7, goalsFor: 24, goalsAgainst: 26, goalDifference: -2, points: 23 }
];

export const mockRelatedMatches: Match[] = [
    {
        id: 1,
        team: 'Juvenil A',
        teamVersus: 'Girona FC',
        resultLocal: 2,
        resultAway: 1,
        date: new Date('2025-12-27T11:00:00'),
        competition: 'Liga Nacional Juvenil',
        location: 'home'
    },
    {
        id: 2,
        team: 'Juvenil A',
        teamVersus: 'RCD Espanyol',
        resultLocal: 1,
        resultAway: 1,
        date: new Date('2025-12-20T10:30:00'),
        competition: 'Liga Nacional Juvenil',
        location: 'away'
    },
    {
        id: 3,
        team: 'Juvenil A',
        teamVersus: 'CE Europa',
        resultLocal: 0,
        resultAway: 0,
        date: new Date('2026-01-10T11:00:00'),
        competition: 'Liga Nacional Juvenil',
        location: 'away'
    },
    {
        id: 4,
        team: 'Juvenil A',
        teamVersus: 'CF Damm',
        resultLocal: 0,
        resultAway: 0,
        date: new Date('2026-01-17T10:00:00'),
        competition: 'Liga Nacional Juvenil',
        location: 'home'
    }
];
