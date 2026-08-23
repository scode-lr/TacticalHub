import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private readonly _online = signal(this.readBrowserStatus());
  readonly online = this._online.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._online.set(true));
      window.addEventListener('offline', () => this._online.set(false));
    }
  }

  isOnline(): boolean {
    const online = this.readBrowserStatus();
    this._online.set(online);
    return online;
  }

  private readBrowserStatus(): boolean {
    return typeof navigator === 'undefined' || navigator.onLine;
  }
}
