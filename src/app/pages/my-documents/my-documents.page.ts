import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, downloadOutline, eyeOutline, folderOutline } from 'ionicons/icons';
import { DocumentPreviewComponent } from '@components/document-preview/document-preview.component';
import { canPreviewPdfInline } from '@core/utils/file-download.util';
import { TranslatePipe } from '@pipes/translate.pipe';
import { DocumentsService } from '@core/services/documents.service';
import { ClubService } from '@core/services/club.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { FormDocument } from '@core/models/document.model';

/**
 * The member's signed documents for the current club, with download.
 */
@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.page.html',
  styleUrls: ['./my-documents.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, DocumentPreviewComponent],
})
export class MyDocumentsPage implements OnInit {
  private readonly documentsService = inject(DocumentsService);
  private readonly clubService = inject(ClubService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly documents = signal<FormDocument[]>([]);
  readonly loading = signal<boolean>(true);
  readonly downloadingId = signal<number | null>(null);
  readonly previewDocumentId = signal<number | null>(null);
  readonly previewFileName = signal<string>('');

  readonly isEmpty = computed(() => !this.loading() && this.documents().length === 0);

  /** No in-app viewer on native, so there the download already opens the OS preview. */
  readonly canPreviewInline = canPreviewPdfInline();

  constructor() {
    addIcons({ documentTextOutline, downloadOutline, eyeOutline, folderOutline });
  }

  openPreview(document: FormDocument): void {
    this.previewFileName.set(document.fileName);
    this.previewDocumentId.set(document.id);
  }

  closePreview(): void {
    this.previewDocumentId.set(null);
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId === null) {
      this.loading.set(false);
      return;
    }

    try {
      const page = await this.documentsService.getMyDocuments(clubId, 50, 0);
      this.documents.set(page.documents ?? []);
    } catch {
      this.toastService.show(this.translationService.instant('user.myDocuments.loadError'), 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  async download(document: FormDocument): Promise<void> {
    if (this.downloadingId() !== null) return;

    this.downloadingId.set(document.id);
    try {
      await this.documentsService.download(document.id, document.fileName);
    } catch {
      this.toastService.show(this.translationService.instant('user.myDocuments.downloadError'), 'danger');
    } finally {
      this.downloadingId.set(null);
    }
  }
}
