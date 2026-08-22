import { Component, effect, inject, input, output, signal, DestroyRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonIcon, IonModal, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, downloadOutline, documentTextOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { DocumentsService } from '@core/services/documents.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { canPreviewPdfInline, previewBlob, saveBlob } from '@core/utils/file-download.util';

/**
 * Shows a generated document before the member commits to saving it.
 *
 * The PDF is fetched once and reused for both the preview and the download, so opening the preview
 * and then saving does not hit the API twice. The object URL is revoked on close and on destroy —
 * it pins the whole file in memory until it is.
 */
@Component({
  selector: 'app-document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss'],
  standalone: true,
  imports: [IonIcon, IonModal, IonSpinner, TranslatePipe],
})
export class DocumentPreviewComponent {
  private readonly documentsService = inject(DocumentsService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  /** Non-null opens the preview; null closes it. */
  readonly documentId = input.required<number | null>();
  readonly fileName = input.required<string>();

  readonly closed = output<void>();

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly previewUrl = signal<SafeResourceUrl | null>(null);

  /** False on native: there the file opens in the OS viewer via FileViewer instead of an in-app iframe. */
  readonly canPreviewInline = canPreviewPdfInline();

  private blob: Blob | null = null;
  private objectUrl: string | null = null;

  constructor() {
    addIcons({ closeOutline, downloadOutline, documentTextOutline });

    effect(() => {
      const id = this.documentId();
      if (id === null) {
        this.release();
        return;
      }

      void this.load(id);
    });

    this.destroyRef.onDestroy(() => this.release());
  }

  private async load(documentId: number): Promise<void> {
    this.release();
    this.isLoading.set(true);

    try {
      this.blob = await this.documentsService.fetchBlob(documentId);

      if (this.canPreviewInline) {
        this.objectUrl = URL.createObjectURL(this.blob);
        this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
      } else {
        // Nothing to render in-app: hand it to the OS document viewer and close.
        await previewBlob(this.blob, this.fileName());
        this.close();
      }
    } catch {
      this.toastService.show(this.translationService.instant('user.myDocuments.downloadError'), 'danger');
      this.close();
    } finally {
      this.isLoading.set(false);
    }
  }

  async save(): Promise<void> {
    if (!this.blob || this.isSaving()) return;

    this.isSaving.set(true);
    try {
      await saveBlob(this.blob, this.fileName());
    } catch {
      this.toastService.show(this.translationService.instant('user.myDocuments.downloadError'), 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  close(): void {
    // `didDismiss` also fires when the parent clears the id, so the modal closing on its own
    // must not echo another `closed` back up.
    if (this.documentId() === null) return;

    this.release();
    this.closed.emit();
  }

  private release(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    this.previewUrl.set(null);
    this.blob = null;
  }
}
