import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  readonly showSnackbar = signal<boolean>(false);
  readonly snackbarMessage = signal<string>('');
  readonly snackbarColor = signal<string>('success');

  show(message: string, color: string = 'success'): void {
    this.snackbarMessage.set(message);
    this.snackbarColor.set(color);
    this.showSnackbar.set(true);
  }

  hide(): void {
    this.showSnackbar.set(false);
  }
}