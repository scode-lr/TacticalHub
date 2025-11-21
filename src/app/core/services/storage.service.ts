import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      throw new Error(`Failed to store data for key: ${key}`);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  getString(key: string): string | null {
    return localStorage.getItem(key);
  }

  setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
