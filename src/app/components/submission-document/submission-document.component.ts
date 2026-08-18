import { Component, inject, input, signal, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, downloadOutline, eyeOutline } from 'ionicons/icons';
import { TranslatePipe } from '@pipes/translate.pipe';
import { DocumentPreviewComponent } from '@components/document-preview/document-preview.component';
import { DocumentsService } from '@core/services/documents.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormDocument } from '@core/models/document.model';
import { canPreviewPdfInline } from '@core/utils/file-download.util';

/**
 * The document issued for a submission, resolved on its own.
 *
 * It looks the document up by submission rather than relying on an id coming down with the
 * submission payload, because `GET /documents/by-submission` also issues the document when it is
 * missing — which is what makes a storage outage during approval invisible.
 *
 * A submission with no document is the normal case (pending, rejected, or a form that produces
 * none), so failure renders nothing and never raises an error to the user.
 */
@Component({
  selector: 'app-submission-document',
  templateUrl: './submission-document.component.html',
  styleUrls: ['./submission-document.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslatePipe, DocumentPreviewComponent],
})
export class SubmissionDocumentComponent implements OnInit {
  private readonly documentsService = inject(DocumentsService);
  private readonly translationService = inject(TranslationService);
  private readonly toastService = inject(ToastService);

  readonly submissionId = input.required<number>();

  readonly loading = signal(true);
  readonly document = signal<FormDocument | null>(null);
  readonly previewDocumentId = signal<number | null>(null);
  readonly isDownloading = signal(false);

  /** No in-app viewer on native, so there the download already opens the OS preview. */
  readonly canPreviewInline = canPreviewPdfInline();

  constructor() {
    addIcons({ documentTextOutline, downloadOutline, eyeOutline });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.document.set(await this.documentsService.getBySubmission(this.submissionId()));
    } catch {
      // 404 simply means this submission has no document. Nothing to show, nothing to report.
      this.document.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  openPreview(): void {
    this.previewDocumentId.set(this.document()?.id ?? null);
  }

  closePreview(): void {
    this.previewDocumentId.set(null);
  }

  async downloadDocument(): Promise<void> {
    const document = this.document();
    if (!document || this.isDownloading()) return;

    this.isDownloading.set(true);
    try {
      await this.documentsService.download(document.id, document.fileName);
    } catch {
      this.toastService.show(this.translationService.instant('user.myDocuments.downloadError'), 'danger');
    } finally {
      this.isDownloading.set(false);
    }
  }
}
