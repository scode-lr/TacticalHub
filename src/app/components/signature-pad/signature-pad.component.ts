import {
  Component, ElementRef, OnDestroy, AfterViewInit, viewChild, signal, output, inject, DestroyRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, refreshOutline, textOutline } from 'ionicons/icons';
import SignaturePad from 'signature_pad';
import { TranslatePipe } from '@pipes/translate.pipe';

export type SignatureMode = 'draw' | 'type';

/**
 * Signature capture, matching the design: draw with a finger or mouse, or type your name and have
 * it rendered in a handwriting face. Either way the output is a PNG data URL.
 */
@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  standalone: true,
  imports: [FormsModule, IonIcon, TranslatePipe],
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private signaturePad: SignaturePad | null = null;
  private resizeObserver: ResizeObserver | null = null;

  /** Emits the PNG data URL, or null when the signature is cleared. */
  readonly signatureChange = output<string | null>();

  readonly mode = signal<SignatureMode>('draw');
  readonly hasSignature = signal<boolean>(false);
  typedName = '';

  constructor() {
    addIcons({ createOutline, refreshOutline, textOutline });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;

    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 0.8,
      maxWidth: 2.5,
      penColor: '#1a1a1a',
      // Transparent so the stroke can be composited onto the PDF cleanly.
      backgroundColor: 'rgba(0,0,0,0)',
    });

    this.signaturePad.addEventListener('endStroke', () => this.emitDrawnSignature());

    this.resizeCanvas();
    this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
    this.resizeObserver.observe(canvas);

    this.destroyRef.onDestroy(() => this.teardown());
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  setMode(mode: SignatureMode): void {
    if (this.mode() === mode) return;
    this.mode.set(mode);
    this.clear();
  }

  clear(): void {
    this.signaturePad?.clear();
    this.typedName = '';
    this.hasSignature.set(false);
    this.signatureChange.emit(null);
  }

  onTypedNameChange(): void {
    const name = this.typedName.trim();
    if (!name) {
      this.hasSignature.set(false);
      this.signatureChange.emit(null);
      return;
    }

    this.hasSignature.set(true);
    this.signatureChange.emit(this.renderTypedName(name));
  }

  private emitDrawnSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      this.hasSignature.set(false);
      this.signatureChange.emit(null);
      return;
    }

    this.hasSignature.set(true);
    this.signatureChange.emit(this.signaturePad.toDataURL('image/png'));
  }

  /**
   * Keeps the drawing surface aligned with its CSS size on high-density screens, otherwise the
   * stroke lands offset from the finger.
   */
  private resizeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const { width, height } = canvas.getBoundingClientRect();

    if (width === 0 || height === 0) return;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    // Resizing clears the surface, so the captured signature is no longer valid.
    this.signaturePad?.clear();
    if (this.mode() === 'draw' && this.hasSignature()) {
      this.hasSignature.set(false);
      this.signatureChange.emit(null);
    }
  }

  /** Draws the typed name in a handwriting face and exports it as PNG. */
  private renderTypedName(name: string): string {
    const width = 600;
    const height = 200;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#1a1a1a';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Shrink the face until the name fits the canvas.
    let fontSize = 72;
    do {
      context.font = `${fontSize}px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive`;
      fontSize -= 4;
    } while (context.measureText(name).width > width - 40 && fontSize > 20);

    context.fillText(name, width / 2, height / 2);

    return canvas.toDataURL('image/png');
  }

  private teardown(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.signaturePad?.off();
    this.signaturePad = null;
  }
}
