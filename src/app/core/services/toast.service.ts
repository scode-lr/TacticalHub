import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly showToast = signal<boolean>(false);
  readonly toastMessage = signal<string>('');
  readonly toastColor = signal<string>('success');

  show(message: string, color: string = 'success'): void {
    this.toastMessage.set(message);
    this.toastColor.set(color);
    this.showToast.set(true);
  }

  hide(): void {
    this.showToast.set(false);
  }
}