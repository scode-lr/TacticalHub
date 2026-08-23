import { TestBed } from '@angular/core/testing';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { TokenService } from './token.service';

describe('TokenService', () => {
  const createToken = (expiresAt: number): string => {
    const encode = (value: object): string => btoa(JSON.stringify(value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ exp: expiresAt })}.signature`;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [TokenService]
    });
  });

  it('starts without a persisted access token', () => {
    const service = TestBed.inject(TokenService);

    expect(service.getAccessToken()).toBeNull();
  });

  it('persists a new access token', () => {
    const service = TestBed.inject(TokenService);
    const token = createToken(Math.floor(Date.now() / 1000) + 3600);

    service.setAccessToken(token);

    expect(service.getAccessToken()).toBe(token);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.TOKEN)!)).toBe(token);
  });

  it('restores a valid persisted access token', () => {
    const token = createToken(Math.floor(Date.now() / 1000) + 3600);
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));

    const service = TestBed.inject(TokenService);

    expect(service.getAccessToken()).toBe(token);
  });

  it('rejects and removes an expired persisted access token', () => {
    const token = createToken(Math.floor(Date.now() / 1000) - 60);
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));

    const service = TestBed.inject(TokenService);

    expect(service.getAccessToken()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
  });

  it('clears the token from memory and persistent storage', () => {
    const service = TestBed.inject(TokenService);
    const token = createToken(Math.floor(Date.now() / 1000) + 3600);
    service.setAccessToken(token);

    service.clearAccessToken();

    expect(service.getAccessToken()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
  });
});
