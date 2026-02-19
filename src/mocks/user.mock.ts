import { User } from '../app/core/models/user.model';
import { Role, RoleType } from '../app/core/models/role.model';
import { Club } from '../app/core/models/club.model';
import { Team } from '../app/core/models/team.model';


// Mock Teams
export const mockTeamJuvenilB: Team = {
  id: 1,
  name: 'Juvenil',
  category: 'B',
  clubId: 1
};

export const mockTeamJuvenilC: Team = {
  id: 2,
  name: 'Juvenil',
  category: 'C',
  clubId: 1
};

export const mockTeamAlevinB: Team = {
  id: 3,
  name: 'Alevin',
  category: 'B',
  clubId: 1
};

export const mockTeamAlevinC: Team = {
  id: 4,
  name: 'Alevin',
  category: 'C',
  clubId: 1
};

// Mock Club
export const mockClub: Club = {
  id: 1,
  name: 'Voltregà CF',
  code: 'voltrega-cf',
  description: 'Professional football club',
  location: 'SHV',
  logoUrl: 'https://pbs.twimg.com/profile_images/1808725237573304320/mSo6RtAd_400x400.jpg',
  teams: [mockTeamJuvenilB, mockTeamJuvenilC, mockTeamAlevinB, mockTeamAlevinC]
};

// Mock Roles
export const mockPlayerRole: Role = {
  id: 1,
  clubName: 'Voltregà CF',
  clubId: 1,
  roleId: RoleType.Viewer,
  description: 'Regular player role',
  createdAt: new Date('2024-01-01')
};

export const mockCoachRole: Role = {
  id: 2,
  clubName: 'Voltregà CF',
  clubId: 1,
  roleId: RoleType.Coach,
  teamName: 'U-19',
  description: 'Team coach role',
  createdAt: new Date('2024-01-01')
};

export const mockAdminRole: Role = {
  id: 3,
  clubName: 'Voltregà CF',
  clubId: 1,
  roleId: RoleType.Admin,
  description: 'Administrator role',
  createdAt: new Date('2024-01-01')
};

export const mockViewerRole: Role = {
  id: 4,
  clubName: 'Voltregà CF',
  clubId: 1,
  roleId: RoleType.Viewer,
  description: 'Viewer role with read-only access',
  createdAt: new Date('2024-01-01')
};

export const mockCoachSeniorRole: Role = {
  id: 5,
  clubName: 'Voltregà CF',
  clubId: 1,
  roleId: RoleType.Coach,
  teamName: 'Senior Team',
  description: 'Senior team coach role',
  createdAt: new Date('2024-01-01')
};

// Mock Users
// Scenario 1: User with only ONE role - should redirect directly to home
export const mockPlayerUser: User = {
  id: 1,
  username: 'johndoe',
  email: 'john.doe@example.com',
  roles: [mockPlayerRole],
  firstName: 'John',
  lastName: 'Doe',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  prefixPhoneNumber: '+34',
  phoneNumber: '612345678',
  dateOfBirth: new Date('1995-06-15'),
  createdAt: new Date('2024-01-15')
};

// Scenario 2: User with MULTIPLE roles - should show role selection with all cards
export const mockCoachUser: User = {
  id: 2,
  username: 'mariagarcia',
  email: 'maria.garcia@example.com',
  roles: [],
  firstName: 'Maria',
  lastName: 'Garcia',
  avatarUrl: 'https://i.pravatar.cc/150?img=5',
  prefixPhoneNumber: '+34',
  phoneNumber: '698765432',
  dateOfBirth: new Date('1985-03-20'),
  createdAt: new Date('2024-01-10')
};

export const mockAdminUser: User = {
  id: 3,
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
  id: 4,
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

// Additional mock users for messages
export const mockPlayerUser2: User = {
  id: 5,
  username: 'sarahwilliams',
  email: 'sarah.williams@example.com',
  roles: [mockPlayerRole],
  firstName: 'Sarah',
  lastName: 'Williams',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
  prefixPhoneNumber: '+34',
  phoneNumber: '611222333',
  dateOfBirth: new Date('1997-08-10'),
  createdAt: new Date('2024-02-01')
};

export const mockPlayerUser3: User = {
  id: 6,
  username: 'michaelbrown',
  email: 'michael.brown@example.com',
  roles: [mockPlayerRole],
  firstName: 'Michael',
  lastName: 'Brown',
  avatarUrl: 'https://i.pravatar.cc/150?img=68',
  prefixPhoneNumber: '+34',
  phoneNumber: '699888777',
  dateOfBirth: new Date('1996-04-25'),
  createdAt: new Date('2024-01-20')
};

// Helper to get all mock users
export const mockUsers: User[] = [mockPlayerUser, mockCoachUser, mockAdminUser, mockNewUser, mockPlayerUser2, mockPlayerUser3];

// Helper to get all mock roles
export const mockRoles: Role[] = [mockPlayerRole, mockCoachRole, mockCoachSeniorRole, mockAdminRole, mockViewerRole];

// Helper to get all mock teams
export const mockUserTeams: Team[] = [mockTeamJuvenilB, mockTeamJuvenilC, mockTeamAlevinB, mockTeamAlevinC];
