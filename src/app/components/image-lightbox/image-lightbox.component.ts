import { Component, ElementRef, OnDestroy, OnInit, Renderer2, computed, effect, inject, input, output, signal } from '@angular/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, chevronBackOutline, chevronForwardOutline, downloadOutline } from 'ionicons/icons';
import { saveBlob, sanitizeFileName } from '@core/utils/file-download.util';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;
const SWIPE_THRESHOLD = 40;
const DOUBLE_TAP_MAX_DELAY_MS = 300;
const DOUBLE_TAP_MAX_DISTANCE = 30;

/**
 * Full-screen photo viewer: shows an image uncropped (object-fit: contain, unlike a cover-cropped
 * hero/thumbnail) and, when there is more than one, lets the user page through them — by swiping on
 * touch or with the arrow buttons. Supports pinch/double-tap/double-click zoom with drag-to-pan once
 * zoomed, and downloading the current photo.
 */
@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.component.html',
  styleUrls: ['./image-lightbox.component.scss'],
  standalone: true,
  imports: [IonIcon, IonSpinner],
})
export class ImageLightboxComponent implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  readonly images = input.required<string[]>();
  readonly startIndex = input<number>(0);
  readonly isOpen = input<boolean>(false);

  readonly closed = output<void>();

  readonly currentIndex = signal(0);
  readonly hasMultiple = computed(() => this.images().length > 1);
  readonly zoomScale = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly isZoomed = computed(() => this.zoomScale() > 1);
  readonly isDownloading = signal(false);

  // Single-finger tracking, reused for swipe, pan and tap/double-tap detection.
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;
  private panStartX = 0;
  private panStartY = 0;
  private lastTapTime = 0;
  private lastTapX = 0;
  private lastTapY = 0;

  // Two-finger pinch tracking.
  private pinchStartDistance: number | null = null;
  private pinchStartScale = 1;

  // Mouse drag-to-pan tracking (desktop, once zoomed).
  private isMouseDragging = false;
  private mouseDragStartX = 0;
  private mouseDragStartY = 0;

  constructor() {
    addIcons({ closeOutline, chevronBackOutline, chevronForwardOutline, downloadOutline });

    // Reset to the tapped image, at 1x zoom, every time the lightbox opens.
    effect(() => {
      if (this.isOpen()) {
        this.currentIndex.set(this.startIndex());
        this.resetZoom();
      }
    });
  }

  ngOnInit(): void {
    // Ionic gives every routed page `contain: layout size style`, which makes it the containing
    // block for `position: fixed` descendants — so without this, the lightbox would scroll away
    // with the page instead of pinning to the real viewport. Re-parenting to <body> escapes that
    // (and any header/menu stacking context) so it can truly cover the whole screen.
    this.renderer.appendChild(document.body, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.renderer.removeChild(document.body, this.elementRef.nativeElement);
  }

  next(): void {
    const total = this.images().length;
    this.currentIndex.set((this.currentIndex() + 1) % total);
    this.resetZoom();
  }

  previous(): void {
    const total = this.images().length;
    this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    this.resetZoom();
  }

  close(): void {
    this.closed.emit();
  }

  async download(): Promise<void> {
    const url = this.images()[this.currentIndex()];
    if (!url || this.isDownloading()) return;

    this.isDownloading.set(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = sanitizeFileName(decodeURIComponent(url.split('/').pop() || 'photo.jpg'));
      await saveBlob(blob, fileName);
    } catch {
      // Cross-origin storage without CORS, or offline: let the user save it manually.
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      this.isDownloading.set(false);
    }
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.pinchStartDistance = this.touchDistance(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.zoomScale();
      this.touchStartX = null;
      this.touchStartY = null;
      return;
    }

    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.panStartX = this.panX();
      this.panStartY = this.panY();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinchStartDistance !== null) {
      event.preventDefault();
      const distance = this.touchDistance(event.touches[0], event.touches[1]);
      this.zoomScale.set(this.clamp(this.pinchStartScale * (distance / this.pinchStartDistance), MIN_ZOOM, MAX_ZOOM));
      return;
    }

    if (event.touches.length === 1 && this.isZoomed() && this.touchStartX !== null && this.touchStartY !== null) {
      event.preventDefault();
      this.panX.set(this.panStartX + (event.touches[0].clientX - this.touchStartX));
      this.panY.set(this.panStartY + (event.touches[0].clientY - this.touchStartY));
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.pinchStartDistance !== null) {
      this.pinchStartDistance = null;
      if (this.zoomScale() < MIN_ZOOM + 0.05) this.resetZoom();
      return;
    }

    if (this.touchStartX === null || this.touchStartY === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    this.touchStartX = null;
    this.touchStartY = null;

    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10;

    if (isTap) {
      this.handleTap(touch.clientX, touch.clientY);
      return;
    }

    if (!this.isZoomed() && this.hasMultiple() && Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) this.next(); else this.previous();
    }
  }

  onDoubleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleZoom();
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isZoomed()) return;
    event.preventDefault();
    event.stopPropagation();
    this.isMouseDragging = true;
    this.mouseDragStartX = event.clientX;
    this.mouseDragStartY = event.clientY;
    this.panStartX = this.panX();
    this.panStartY = this.panY();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isMouseDragging) return;
    this.panX.set(this.panStartX + (event.clientX - this.mouseDragStartX));
    this.panY.set(this.panStartY + (event.clientY - this.mouseDragStartY));
  }

  onMouseUp(): void {
    this.isMouseDragging = false;
  }

  private handleTap(clientX: number, clientY: number): void {
    const now = Date.now();
    const isDoubleTap =
      now - this.lastTapTime < DOUBLE_TAP_MAX_DELAY_MS &&
      Math.hypot(clientX - this.lastTapX, clientY - this.lastTapY) < DOUBLE_TAP_MAX_DISTANCE;

    if (isDoubleTap) {
      this.toggleZoom();
      this.lastTapTime = 0;
      return;
    }

    this.lastTapTime = now;
    this.lastTapX = clientX;
    this.lastTapY = clientY;
  }

  private toggleZoom(): void {
    if (this.isZoomed()) {
      this.resetZoom();
    } else {
      this.zoomScale.set(DOUBLE_TAP_ZOOM);
    }
  }

  private resetZoom(): void {
    this.zoomScale.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  private touchDistance(a: Touch, b: Touch): number {
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
