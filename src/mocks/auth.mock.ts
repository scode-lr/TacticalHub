import { AuthResponse } from '../app/core/responses';
import { mockAdminUser } from './user.mock';

export const mockSignInResponse: AuthResponse = {
  user: mockAdminUser, // User with multiple roles
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5MDAwMDAsImV4cCI6MTY5OTk4NjQwMH0.fake-token',
  refreshToken: 'refresh-token-fake-12345',
  expiresIn: 86400 // 24 hours in seconds
};
