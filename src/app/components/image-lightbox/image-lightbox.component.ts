import { Component, computed, effect, input, output, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

/**
 * Full-screen photo viewer: shows an image uncropped (object-fit: contain, unlike a cover-cropped
 * hero/thumbnail) and, when there is more than one, lets the user page through them.
 */
@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ImageLightboxComponent {
  readonly images = input.required<string[]>();
  readonly startIndex = input<number>(0);
  readonly isOpen = input<boolean>(false);

  readonly closed = output<void>();

  readonly currentIndex = signal(0);
  readonly hasMultiple = computed(() => this.images().length > 1);

  constructor() {
    addIcons({ closeOutline, chevronBackOutline, chevronForwardOutline });

    // Reset to the tapped image every time the lightbox opens.
    effect(() => {
      if (this.isOpen()) {
        this.currentIndex.set(this.startIndex());
      }
    });
  }

  next(): void {
    const total = this.images().length;
    this.currentIndex.set((this.currentIndex() + 1) % total);
  }

  previous(): void {
    const total = this.images().length;
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
  }

  close(): void {
    this.closed.emit();
  }
}
