import { Component, ElementRef, AfterViewInit, OnDestroy, inject, signal, output } from '@angular/core';
import { IonIcon, createGesture, Gesture } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

const PULL_DAMPING = 0.45;
const MAX_PULL_DISTANCE = 90;
const TRIGGER_THRESHOLD = 60;
const INDICATOR_HEIGHT = 50;

/**
 * Wraps a page's content so dragging down from the very top of its scroll container
 * (found by walking up to the closest `.ion-page`, since these pages don't use
 * `<ion-content>` and can't rely on Ionic's own `<ion-refresher>`) reveals a spinner
 * and fires `refresh`. The caller must call the injected complete() function once its
 * reload finishes, same shape as `$event.target.complete()` on ion-refresher.
 */
@Component({
  selector: 'app-pull-to-refresh',
  templateUrl: './pull-to-refresh.component.html',
  styleUrls: ['./pull-to-refresh.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class PullToRefreshComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private gesture: Gesture | null = null;

  readonly refresh = output<() => void>();

  readonly pullDistance = signal<number>(0);
  readonly refreshing = signal<boolean>(false);

  constructor() {
    addIcons({ refreshOutline });
  }

  ngAfterViewInit(): void {
    const scrollEl = this.findScrollParent();
    if (!scrollEl) return;

    this.gesture = createGesture({
      el: scrollEl,
      gestureName: 'pull-to-refresh',
      direction: 'y',
      threshold: 10,
      canStart: () => !this.refreshing() && scrollEl.scrollTop <= 0,
      onMove: ev => {
        const distance = Math.max(0, ev.deltaY * PULL_DAMPING);
        this.pullDistance.set(Math.min(distance, MAX_PULL_DISTANCE));
      },
      onEnd: () => {
        if (this.pullDistance() >= TRIGGER_THRESHOLD) {
          this.refreshing.set(true);
          this.pullDistance.set(INDICATOR_HEIGHT);
          this.refresh.emit(() => this.complete());
        } else {
          this.pullDistance.set(0);
        }
      }
    });
    this.gesture.enable(true);
  }

  ngOnDestroy(): void {
    this.gesture?.destroy();
  }

  private complete(): void {
    this.refreshing.set(false);
    this.pullDistance.set(0);
  }

  private findScrollParent(): HTMLElement | null {
    let el: HTMLElement | null = this.elementRef.nativeElement.parentElement;
    while (el) {
      if (el.classList.contains('ion-page')) return el;
      el = el.parentElement;
    }
    return null;
  }
}
