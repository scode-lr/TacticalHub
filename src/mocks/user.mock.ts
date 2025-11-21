import { User, Role, Club } from '../app/core/models';

// Mock Club
export const mockClub: Club = Object.assign(new Club(), {
  id: 'club-001',
  name: 'FC Barcelona',
  description: 'Professional football club based in Barcelona, Catalonia, Spain',
  location: 'Barcelona, Spain',
  logoUrl: 'https://example.com/barcelona-logo.png',
  level: 'Professional',
  membersCount: 50,
  teamsCount: 3
});

// Mock Roles
export const mockPlayerRole: Role = Object.assign(new Role(), {
  id: 'role-001',
  name: 'Player',
  club: mockClub,
  description: 'Regular player role',
  permissions: ['view_teams', 'join_teams', 'view_matches', 'view_trainings'],
  createdAt: new Date('2024-01-01')
});

export const mockCoachRole: Role = Object.assign(new Role(), {
  id: 'role-002',
  name: 'Coach',
  club: mockClub,
  description: 'Team coach role',
  permissions: ['view_teams', 'manage_teams', 'view_matches', 'create_matches', 'manage_trainings', 'view_players'],
  createdAt: new Date('2024-01-01')
});

export const mockAdminRole: Role = Object.assign(new Role(), {
  id: 'role-003',
  name: 'Admin',
  club: mockClub,
  description: 'Administrator role',
  permissions: ['view_teams', 'manage_teams', 'view_matches', 'create_matches', 'manage_users', 'manage_roles', 'manage_club'],
  createdAt: new Date('2024-01-01')
});

// Mock Users
export const mockPlayerUser: User = Object.assign(new User(), {
  id: 'user-001',
  email: 'john.doe@example.com',
  roles: [mockPlayerRole],
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: 'https://example.com/avatar-john.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '612345678',
  dateOfBirth: new Date('1995-06-15'),
  createdAt: new Date('2024-01-15')
});

export const mockCoachUser: User = Object.assign(new User(), {
  id: 'user-002',
  email: 'maria.garcia@example.com',
  roles: [mockCoachRole],
  firstName: 'Maria',
  lastName: 'Garcia',
  avatarUrl: 'https://example.com/avatar-maria.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '698765432',
  dateOfBirth: new Date('1985-03-20'),
  createdAt: new Date('2024-01-10')
});

export const mockAdminUser: User = Object.assign(new User(), {
  id: 'user-003',
  email: 'admin@example.com',
  roles: [mockAdminRole, mockCoachRole],
  firstName: 'Carlos',
  lastName: 'Rodriguez',
  avatarUrl: 'https://example.com/avatar-carlos.jpg',
  prefixPhoneNumber: '+34',
  phoneNumber: '687654321',
  dateOfBirth: new Date('1980-11-30'),
  createdAt: new Date('2024-01-01')
});

// Helper to get all mock users
export const mockUsers: User[] = [mockPlayerUser, mockCoachUser, mockAdminUser];

// Helper to get all mock roles
export const mockRoles: Role[] = [mockPlayerRole, mockCoachRole, mockAdminRole];
