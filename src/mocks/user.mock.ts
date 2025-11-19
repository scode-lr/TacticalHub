import { User } from '../app/core/models/user.model';
import { Role } from '../app/core/models/role.model';
import { Club } from '../app/core/models/club.model';
import { Team } from '../app/core/models/team.model';

// Mock Club
export const mockClub: Club = {
  id: 'club-001',
  name: 'Voltregà CF',
  description: 'Professional football club',
  location: 'SHV',
  logoUrl: '/assets/logo.svg',
  level: 'Professional',
  membersCount: 50,
  teamsCount: 3
};

// Mock Teams
export const mockTeamJuvenilB: Team = {
  id: 'team-001',
  name: 'Juvenil',
  category: 'B',
  clubId: 'club-001'
};

export const mockTeamJuvenilC: Team = {
  id: 'team-002',
  name: 'Juvenil',
  category: 'C',
  clubId: 'club-001'
};

export const mockTeamAlevinB: Team = {
  id: 'team-003',
  name: 'Alevin',
  category: 'B',
  clubId: 'club-001'
};

export const mockTeamAlevinC: Team = {
  id: 'team-004',
  name: 'Alevin',
  category: 'C',
  clubId: 'club-001'
};

// Mock Roles
export const mockPlayerRole: Role = {
  id: 'role-001',
  name: 'Player',
  club: mockClub,
  description: 'Regular player role',
  permissions: ['view_teams', 'join_teams', 'view_matches', 'view_trainings'],
  createdAt: new Date('2024-01-01')
};

export const mockCoachRole: Role = {
  id: 'role-002',
  name: 'Coach',
  club: mockClub,
  team: 'U-19',
  description: 'Team coach role',
  permissions: ['view_teams', 'manage_teams', 'view_matches', 'create_matches', 'manage_trainings', 'view_players'],
  createdAt: new Date('2024-01-01')
};

export const mockAdminRole: Role = {
  id: 'role-003',
  name: 'Admin',
  club: mockClub,
  description: 'Administrator role',
  permissions: ['view_teams', 'manage_teams', 'view_matches', 'create_matches', 'manage_users', 'manage_roles', 'manage_club'],
  createdAt: new Date('2024-01-01')
};

export const mockViewerRole: Role = {
  id: 'role-005',
  name: 'Viewer',
  club: mockClub,
  description: 'Viewer role with read-only access',
  permissions: ['view_teams', 'view_matches', 'view_trainings'],
  createdAt: new Date('2024-01-01')
};

export const mockCoachSeniorRole: Role = {
  id: 'role-004',
  name: 'Coach',
  club: mockClub,
  team: 'Senior Team',
  description: 'Senior team coach role',
  permissions: ['view_teams', 'manage_teams', 'view_matches', 'create_matches', 'manage_trainings', 'view_players'],
  createdAt: new Date('2024-01-01')
};

// Mock Users
// Scenario 1: User with only ONE role - should redirect directly to home
export const mockPlayerUser: User = {
  id: 'user-001',
  username: 'johndoe',
  email: 'john.doe@example.com',
  roles: [mockPlayerRole],
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: 'https://example.com/avatar-john.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '612345678',
  dateOfBirth: new Date('1995-06-15'),
  createdAt: new Date('2024-01-15')
};

// Scenario 2: User with MULTIPLE roles - should show role selection with all cards
export const mockCoachUser: User = {
  id: 'user-002',
  username: 'mariagarcia',
  email: 'maria.garcia@example.com',
  roles: [],
  firstName: 'Maria',
  lastName: 'Garcia',
  avatarUrl: 'https://example.com/avatar-maria.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '698765432',
  dateOfBirth: new Date('1985-03-20'),
  createdAt: new Date('2024-01-10')
};

export const mockAdminUser: User = {
  id: 'user-003',
  username: 'adminuser',
  email: 'admin@example.com',
  roles: [mockAdminRole, mockCoachRole, mockCoachSeniorRole, mockViewerRole],
  firstName: 'Elisabeth',
  lastName: 'Portús',
  avatarUrl: 'https://example.com/avatar-carlos.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '687654321',
  dateOfBirth: new Date('1980-11-30'),
  createdAt: new Date('2024-01-01')
};

// Scenario 3: User with NO roles - should show role selection with only "add club" card and skip button
export const mockNewUser: User = {
  id: 'user-004',
  username: 'newuser',
  email: 'new.user@example.com',
  roles: [],
  firstName: 'New',
  lastName: 'User',
  avatarUrl: 'https://example.com/avatar-new.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '600000000',
  dateOfBirth: new Date('2000-01-01'),
  createdAt: new Date('2024-03-01')
};

// Helper to get all mock users
export const mockUsers: User[] = [mockPlayerUser, mockCoachUser, mockAdminUser, mockNewUser];

// Helper to get all mock roles
export const mockRoles: Role[] = [mockPlayerRole, mockCoachRole, mockCoachSeniorRole, mockAdminRole, mockViewerRole];

// Helper to get all mock teams
export const mockTeams: Team[] = [mockTeamJuvenilB, mockTeamJuvenilC, mockTeamAlevinB, mockTeamAlevinC];
