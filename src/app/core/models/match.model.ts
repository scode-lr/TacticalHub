export interface Match {
    id: number;
    team: string;
    resultLocal: number;
    resultAway: number;
    teamVersus: string;
    date: Date;
    location: 'home' | 'away';
    additionalData?: string;
    competition?: string;
}
