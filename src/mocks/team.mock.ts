import { Team } from '@core/models/team.model';
import { Player, Position } from '@core/models/match-detail.model';

export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Juvenil A',
    category: 'Juvenil',
    clubId: 1
  },
  {
    id: 2,
    name: 'Cadet A',
    category: 'Cadet',
    clubId: 1
  },
  {
    id: 3,
    name: 'Cadet B',
    category: 'Cadet',
    clubId: 1
  },
  {
    id: 4,
    name: 'Infantil A',
    category: 'Infantil',
    clubId: 1
  },
  {
    id: 5,
    name: 'Infantil B',
    category: 'Infantil',
    clubId: 1
  },
  {
    id: 6,
    name: 'Aleví A',
    category: 'Aleví',
    clubId: 1
  },
  {
    id: 7,
    name: 'Aleví B',
    category: 'Aleví',
    clubId: 1
  },
  {
    id: 8,
    name: 'Aleví C',
    category: 'Aleví',
    clubId: 1
  },
  {
    id: 9,
    name: 'Benjamí A',
    category: 'Benjamí',
    clubId: 1
  },
  {
    id: 10,
    name: 'Benjamí B',
    category: 'Benjamí',
    clubId: 1
  }
];

export const mockTeamPlayers: Record<number, Player[]> = {
  1: [
    { id: 1, number: 1, name: 'Marc González', position: Position.GK, isCaptain: false },
    { id: 2, number: 2, name: 'Jordi Martínez', position: Position.DF, isCaptain: true },
    { id: 3, number: 3, name: 'Pau Fernández', position: Position.DF, isCaptain: false },
    { id: 4, number: 4, name: 'David López', position: Position.DF, isCaptain: false },
    { id: 5, number: 5, name: 'Sergi Rodríguez', position: Position.DF, isCaptain: false },
    { id: 6, number: 6, name: 'Joan Pérez', position: Position.MF, isCaptain: false },
    { id: 7, number: 7, name: 'Albert García', position: Position.MF, isCaptain: false },
    { id: 8, number: 8, name: 'Xavier Sánchez', position: Position.MF, isCaptain: false },
    { id: 9, number: 9, name: 'Roger Martín', position: Position.FW, isCaptain: false },
    { id: 10, number: 10, name: 'Arnau Vila', position: Position.FW, isCaptain: false },
    { id: 11, number: 11, name: 'Gerard Soler', position: Position.FW, isCaptain: false },
    { id: 12, number: 12, name: 'Pol Torres', position: Position.GK, isCaptain: false },
    { id: 13, number: 13, name: 'Carles Ruiz', position: Position.DF, isCaptain: false },
    { id: 14, number: 14, name: 'Oriol Dominguez', position: Position.MF, isCaptain: false },
    { id: 15, number: 15, name: 'Nil Jiménez', position: Position.FW, isCaptain: false }
  ],
  2: [
    { id: 16, number: 1, name: 'Ivan Castillo', position: Position.GK, isCaptain: false },
    { id: 17, number: 2, name: 'Marc Vilaró', position: Position.DF, isCaptain: true },
    { id: 18, number: 3, name: 'Alex Pujol', position: Position.DF, isCaptain: false },
    { id: 19, number: 4, name: 'Sergi Molist', position: Position.DF, isCaptain: false },
    { id: 20, number: 5, name: 'Ramon Costa', position: Position.MF, isCaptain: false },
    { id: 21, number: 6, name: 'Miquel Bernal', position: Position.MF, isCaptain: false },
    { id: 22, number: 7, name: 'Toni Casas', position: Position.MF, isCaptain: false },
    { id: 23, number: 8, name: 'Ferran Camps', position: Position.FW, isCaptain: false },
    { id: 24, number: 9, name: 'Adrià Valls', position: Position.FW, isCaptain: false },
    { id: 25, number: 10, name: 'Guillem Font', position: Position.FW, isCaptain: false },
    { id: 26, number: 11, name: 'Martí Bosch', position: Position.FW, isCaptain: false },
    { id: 27, number: 12, name: 'Lluís Mora', position: Position.GK, isCaptain: false }
  ],
  3: [
    { id: 28, number: 1, name: 'Joel Roca', position: Position.GK, isCaptain: false },
    { id: 29, number: 2, name: 'Dani Soler', position: Position.DF, isCaptain: true },
    { id: 30, number: 3, name: 'Eric Puig', position: Position.DF, isCaptain: false },
    { id: 31, number: 4, name: 'Oscar Mata', position: Position.DF, isCaptain: false },
    { id: 32, number: 5, name: 'Pere Farrés', position: Position.MF, isCaptain: false },
    { id: 33, number: 6, name: 'Biel Sala', position: Position.MF, isCaptain: false },
    { id: 34, number: 7, name: 'Andreu Serra', position: Position.MF, isCaptain: false },
    { id: 35, number: 8, name: 'Isaac Vidal', position: Position.FW, isCaptain: false },
    { id: 36, number: 9, name: 'Àlex Navarro', position: Position.FW, isCaptain: false },
    { id: 37, number: 10, name: 'Pol Rius', position: Position.FW, isCaptain: false }
  ],
  4: [
    { id: 38, number: 1, name: 'Hugo Mas', position: Position.GK, isCaptain: false },
    { id: 39, number: 2, name: 'Jan Torrent', position: Position.DF, isCaptain: true },
    { id: 40, number: 3, name: 'Marc Albà', position: Position.DF, isCaptain: false },
    { id: 41, number: 4, name: 'Guillem Parés', position: Position.DF, isCaptain: false },
    { id: 42, number: 5, name: 'Bernat Riera', position: Position.MF, isCaptain: false },
    { id: 43, number: 6, name: 'Àngel Casals', position: Position.MF, isCaptain: false },
    { id: 44, number: 7, name: 'Martí Duran', position: Position.MF, isCaptain: false },
    { id: 45, number: 8, name: 'Àlex Ribas', position: Position.FW, isCaptain: false },
    { id: 46, number: 9, name: 'Pau Colom', position: Position.FW, isCaptain: false },
    { id: 47, number: 10, name: 'Joan Clarà', position: Position.FW, isCaptain: false }
  ],
  5: [
    { id: 48, number: 1, name: 'Aniol Llach', position: Position.GK, isCaptain: false },
    { id: 49, number: 2, name: 'Roger Pla', position: Position.DF, isCaptain: true },
    { id: 50, number: 3, name: 'Gerard Palau', position: Position.DF, isCaptain: false },
    { id: 51, number: 4, name: 'Marc Olivé', position: Position.DF, isCaptain: false },
    { id: 52, number: 5, name: 'Pau Geli', position: Position.MF, isCaptain: false },
    { id: 53, number: 6, name: 'Jordi Bach', position: Position.MF, isCaptain: false },
    { id: 54, number: 7, name: 'Albert Grau', position: Position.MF, isCaptain: false },
    { id: 55, number: 8, name: 'David Solà', position: Position.FW, isCaptain: false },
    { id: 56, number: 9, name: 'Sergi Brugués', position: Position.FW, isCaptain: false }
  ],
  6: [
    { id: 57, number: 1, name: 'Marc Ballesteros', position: Position.GK, isCaptain: false },
    { id: 58, number: 2, name: 'Pol Mir', position: Position.DF, isCaptain: true },
    { id: 59, number: 3, name: 'Oriol Blanch', position: Position.DF, isCaptain: false },
    { id: 60, number: 4, name: 'Xavier Puigserver', position: Position.DF, isCaptain: false },
    { id: 61, number: 5, name: 'Joan Corominas', position: Position.MF, isCaptain: false },
    { id: 62, number: 6, name: 'Gerard Planas', position: Position.MF, isCaptain: false },
    { id: 63, number: 7, name: 'Arnau Casanovas', position: Position.MF, isCaptain: false },
    { id: 64, number: 8, name: 'Biel Busquets', position: Position.FW, isCaptain: false },
    { id: 65, number: 9, name: 'Marc Fortuny', position: Position.FW, isCaptain: false }
  ],
  7: [
    { id: 66, number: 1, name: 'Pol Codina', position: Position.GK, isCaptain: false },
    { id: 67, number: 2, name: 'Adrià Sallent', position: Position.DF, isCaptain: true },
    { id: 68, number: 3, name: 'Marc Oller', position: Position.DF, isCaptain: false },
    { id: 69, number: 4, name: 'David Colell', position: Position.DF, isCaptain: false },
    { id: 70, number: 5, name: 'Sergi Pons', position: Position.MF, isCaptain: false },
    { id: 71, number: 6, name: 'Guillem Arenas', position: Position.MF, isCaptain: false },
    { id: 72, number: 7, name: 'Roger Vilà', position: Position.FW, isCaptain: false },
    { id: 73, number: 8, name: 'Albert Carreras', position: Position.FW, isCaptain: false }
  ],
  8: [
    { id: 74, number: 1, name: 'Nil Borràs', position: Position.GK, isCaptain: false },
    { id: 75, number: 2, name: 'Marc Boix', position: Position.DF, isCaptain: true },
    { id: 76, number: 3, name: 'Pau Rovira', position: Position.DF, isCaptain: false },
    { id: 77, number: 4, name: 'Xavier Ferrer', position: Position.DF, isCaptain: false },
    { id: 78, number: 5, name: 'Jordi Marí', position: Position.MF, isCaptain: false },
    { id: 79, number: 6, name: 'Gerard Comas', position: Position.MF, isCaptain: false },
    { id: 80, number: 7, name: 'Albert Iglesias', position: Position.FW, isCaptain: false },
    { id: 81, number: 8, name: 'Marc Vilanova', position: Position.FW, isCaptain: false }
  ],
  9: [
    { id: 82, number: 1, name: 'Jan Mallol', position: Position.GK, isCaptain: false },
    { id: 83, number: 2, name: 'Pol Sabater', position: Position.DF, isCaptain: true },
    { id: 84, number: 3, name: 'Arnau Badia', position: Position.DF, isCaptain: false },
    { id: 85, number: 4, name: 'Marc Font', position: Position.DF, isCaptain: false },
    { id: 86, number: 5, name: 'Oriol Folch', position: Position.MF, isCaptain: false },
    { id: 87, number: 6, name: 'Sergi Alonso', position: Position.MF, isCaptain: false },
    { id: 88, number: 7, name: 'David Roig', position: Position.FW, isCaptain: false },
    { id: 89, number: 8, name: 'Marc Batlle', position: Position.FW, isCaptain: false }
  ],
  10: [
    { id: 90, number: 1, name: 'Guillem Escobar', position: Position.GK, isCaptain: false },
    { id: 91, number: 2, name: 'Roger Faura', position: Position.DF, isCaptain: true },
    { id: 92, number: 3, name: 'Marc Pascual', position: Position.DF, isCaptain: false },
    { id: 93, number: 4, name: 'Pol Martorell', position: Position.DF, isCaptain: false },
    { id: 94, number: 5, name: 'Arnau Guitart', position: Position.MF, isCaptain: false },
    { id: 95, number: 6, name: 'Jordi Muntané', position: Position.MF, isCaptain: false },
    { id: 96, number: 7, name: 'Gerard Surroca', position: Position.FW, isCaptain: false },
    { id: 97, number: 8, name: 'Albert Bertran', position: Position.FW, isCaptain: false }
  ]
};
