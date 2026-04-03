import { Match } from '@models/match.model';

const today = new Date();
const currentDay = today.getDay();
const diffToSaturday = 6 - currentDay; // Days until Saturday
const diffToSunday = 7 - currentDay;   // Days until Sunday

const saturday = new Date(today);
saturday.setDate(today.getDate() + diffToSaturday);
saturday.setHours(10, 0, 0, 0);

const sunday = new Date(today);
sunday.setDate(today.getDate() + diffToSunday);
sunday.setHours(11, 0, 0, 0);

const lastSaturday = new Date(saturday);
lastSaturday.setDate(saturday.getDate() - 7);

const lastSunday = new Date(sunday);
lastSunday.setDate(sunday.getDate() - 7);

const nextSaturday = new Date(saturday);
nextSaturday.setDate(saturday.getDate() + 7);

const nextSunday = new Date(sunday);
nextSunday.setDate(sunday.getDate() + 7);

export const mockMatches: Match[] = [
    // Current Week
    {
        id: 1,
        team: 'Juvenil A',
        resultLocal: 3,
        resultAway: 1,
        teamVersus: 'FC Barcelona',
        date: new Date(saturday.setHours(10, 0, 0, 0)),
        location: 'home',
        additionalData: 'League Match'
    },
    {
        id: 2,
        team: 'Cadet B',
        resultLocal: 2,
        resultAway: 2,
        teamVersus: 'RCD Espanyol',
        date: new Date(saturday.setHours(12, 30, 0, 0)),
        location: 'away',
        additionalData: 'Friendly'
    },
    {
        id: 3,
        team: 'Infantil A',
        resultLocal: 0,
        resultAway: 4,
        teamVersus: 'Girona FC',
        date: new Date(sunday.setHours(11, 0, 0, 0)),
        location: 'home',
        additionalData: 'Cup Match'
    },
    {
        id: 4,
        team: 'Aleví C',
        resultLocal: 5,
        resultAway: 2,
        teamVersus: 'CE Sabadell',
        date: new Date(sunday.setHours(16, 0, 0, 0)),
        location: 'away'
    },

    // Previous Week
    {
        id: 5,
        team: 'Juvenil A',
        resultLocal: 1,
        resultAway: 0,
        teamVersus: 'Damm CF',
        date: new Date(lastSaturday.setHours(18, 0, 0, 0)),
        location: 'away'
    },
    {
        id: 6,
        team: 'Cadet B',
        resultLocal: 4,
        resultAway: 1,
        teamVersus: 'UE Cornellà',
        date: new Date(lastSunday.setHours(10, 0, 0, 0)),
        location: 'home'
    },

    // Next Week
    {
        id: 7,
        team: 'Juvenil A',
        resultLocal: 0,
        resultAway: 0,
        teamVersus: 'CF Badalona',
        date: new Date(nextSaturday.setHours(17, 0, 0, 0)),
        location: 'home'
    },
    {
        id: 8,
        team: 'Infantil A',
        resultLocal: 0,
        resultAway: 0,
        teamVersus: 'Nàstic Tarragona',
        date: new Date(nextSunday.setHours(12, 0, 0, 0)),
        location: 'away'
    }
];
