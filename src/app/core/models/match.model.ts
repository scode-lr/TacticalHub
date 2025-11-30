export interface Match {
    id: string;
    team: string;
    resultLocal: number;
    resultAway: number;
    teamVersus: string;
    date: Date;
    location: 'home' | 'away';
    additionalData?: string;
}
