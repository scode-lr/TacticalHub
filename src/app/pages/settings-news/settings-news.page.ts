import { Component, signal, computed, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonModal, IonSpinner } from '@ionic/angular/standalone';
import { EditorInitEvent, EditorModule } from 'primeng/editor';
import { formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslatePipe } from '@pipes/translate.pipe';
import { TranslationService } from '@core/services/i18n/translation.service';
import { NavigationService } from '@services/navigation.service';
import { NewsService } from '@services/news.service';
import { ClubService } from '@services/club.service';
import { FormService } from '@services/form.service';
import { ToastService } from '@services/toast.service';
import { ConfirmService } from '@services/confirm.service';
import { NewsPost, NewsPostImage } from '@models/news.model';
import { AppStatus } from '@models/app-status.model';
import { FormDetail } from '@core/responses/form.response';

type StatusFilter = 'all' | 'published' | 'draft';

interface NewsFormModel {
  title: string;
  body: string;
  externalLinkUrl: string;
  externalLinkLabel: string;
  linkedFormId: number | null;
  publishNow: boolean;
}

@Component({
  selector: 'app-settings-news',
  templateUrl: './settings-news.page.html',
  styleUrls: ['./settings-news.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, IonSpinner, TranslatePipe, EditorModule]
})
export class SettingsNewsPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly newsService = inject(NewsService);
  private readonly clubService = inject(ClubService);
  private readonly formService = inject(FormService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly translationService = inject(TranslationService);

  readonly AppStatus = AppStatus;

  readonly news = signal<NewsPost[]>([]);
  readonly loading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(false);
  readonly statusFilter = signal<StatusFilter>('all');
  readonly openMenuId = signal<number | null>(null);

  readonly showEditorModal = signal(false);
  readonly isSaving = signal(false);
  readonly imageUploading = signal(false);
  readonly editingNews = signal<NewsPost | null>(null);
  readonly uploadedPrimaryImageUrl = signal<string | null>(null);
  readonly activeForms = signal<FormDetail[]>([]);
  readonly formsLoading = signal(false);
  readonly form = signal<NewsFormModel>(this.createEmptyForm());

  readonly filteredNews = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'all') return this.news();
    return this.news().filter(item => filter === 'published' ? item.status === AppStatus.Active : item.status !== AppStatus.Active);
  });

  private readonly limit = 20;
  private offset = 0;
  private clubId = 0;
  private orphanedImageUrls = new Set<string>();
  private uploadedUnsavedImageUrls = new Set<string>();

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId() ?? 0;
    await this.loadInitialNews();
  }

  async loadInitialNews(): Promise<void> {
    try {
      this.loading.set(true);
      this.offset = 0;
      const page = await this.newsService.getByClubId(this.clubId, true, this.limit, this.offset);
      this.news.set(page.items);
      this.hasMore.set(page.hasMore);
      this.offset += page.items.length;
    } catch {
      this.news.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadMoreNews(): Promise<void> {
    if (this.isLoadingMore() || !this.hasMore()) return;

    try {
      this.isLoadingMore.set(true);
      const page = await this.newsService.getByClubId(this.clubId, true, this.limit, this.offset);
      this.news.update(existing => [...existing, ...page.items]);
      this.hasMore.set(page.hasMore);
      this.offset += page.items.length;
    } catch {
      this.offset = this.news().length;
      this.hasMore.set(false);
    } finally {
      this.isLoadingMore.set(false);
    }
  }

  toggleMenu(id: number): void {
    this.openMenuId.update(current => current === id ? null : id);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openMenuId() === null) return;
    if (!(event.target as HTMLElement).closest('.news-row-actions')) {
      this.openMenuId.set(null);
    }
  }

  statusLabel(newsPost: NewsPost): string {
    return this.translationService.instant(newsPost.status === AppStatus.Active ? 'admin.settingsNews.status.published' : 'admin.settingsNews.status.draft');
  }

  getTimeAgo(date: string | null | undefined): string {
    if (!date) return this.translationService.instant('user.news.statusDraft');
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: this.getLocale() });
  }

  async startCreate(): Promise<void> {
    this.openMenuId.set(null);
    this.editingNews.set(null);
    this.form.set(this.createEmptyForm());
    this.uploadedPrimaryImageUrl.set(null);
    this.orphanedImageUrls.clear();
    this.uploadedUnsavedImageUrls.clear();
    await this.loadActiveForms();
    this.showEditorModal.set(true);
  }

  async startEdit(newsPost: NewsPost): Promise<void> {
    this.openMenuId.set(null);
    this.editingNews.set(newsPost);
    this.form.set({
      title: newsPost.title,
      body: newsPost.body,
      externalLinkUrl: newsPost.externalLinkUrl ?? '',
      externalLinkLabel: newsPost.externalLinkLabel ?? '',
      linkedFormId: newsPost.linkedFormId ?? null,
      publishNow: newsPost.status === AppStatus.Active
    });
    this.uploadedPrimaryImageUrl.set(this.getPrimaryImageUrl(newsPost));
    this.orphanedImageUrls.clear();
    this.uploadedUnsavedImageUrls.clear();
    await this.loadActiveForms();
    this.showEditorModal.set(true);
  }

  updateForm<K extends keyof NewsFormModel>(key: K, value: NewsFormModel[K]): void {
    this.form.update(current => ({ ...current, [key]: value }));
  }

  onEditorInit(event: EditorInitEvent): void {
    const tooltip = event.editor?.container?.querySelector?.('.ql-tooltip') as HTMLElement | null;
    if (!tooltip) return;

    const enterLabel = this.translationService.instant('user.news.linkEditor.enter');
    const editLabel = this.translationService.instant('user.news.linkEditor.edit');
    const saveLabel = this.translationService.instant('user.news.linkEditor.save');
    const removeLabel = this.translationService.instant('user.news.linkEditor.remove');

    tooltip.dataset['visitLabel'] = this.translationService.instant('user.news.linkEditor.visit');
    tooltip.dataset['enterLabel'] = enterLabel;

    tooltip
      .querySelector<HTMLInputElement>('input[type="text"]')
      ?.setAttribute('aria-label', enterLabel);

    const action = tooltip.querySelector<HTMLElement>('.ql-action');
    if (action) {
      action.dataset['editLabel'] = editLabel;
      action.dataset['saveLabel'] = saveLabel;
    }

    const remove = tooltip.querySelector<HTMLElement>('.ql-remove');
    if (remove) {
      remove.dataset['removeLabel'] = removeLabel;
      remove.setAttribute('aria-label', removeLabel);
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const previousUrl = this.uploadedPrimaryImageUrl();
    this.imageUploading.set(true);

    try {
      const result = await this.newsService.uploadImage(this.clubId, file);

      if (previousUrl?.startsWith('http')) {
        this.orphanedImageUrls.add(previousUrl);
      }

      this.uploadedPrimaryImageUrl.set(result.url);
      this.uploadedUnsavedImageUrls.add(result.url);
    } catch {
      this.toastService.show(this.translationService.instant('user.news.imageUploadFailed'), 'danger');
    } finally {
      input.value = '';
      this.imageUploading.set(false);
    }
  }

  async removePrimaryImage(): Promise<void> {
    const url = this.uploadedPrimaryImageUrl();
    if (!url) return;
    if (url.startsWith('http')) {
      this.orphanedImageUrls.add(url);
    }
    this.uploadedPrimaryImageUrl.set(null);
  }

  async saveNews(): Promise<void> {
    if (this.isSaving() || this.imageUploading()) return;

    const form = this.form();
    if (!form.title.trim() || !form.body.trim()) {
      this.toastService.show(this.translationService.instant('user.news.titleBodyRequired'), 'warning');
      return;
    }

    const images = this.buildImagePayload();
    this.isSaving.set(true);

    try {
      const editing = this.editingNews();
      if (editing) {
        const updated = await this.newsService.update(this.clubId, editing.id, {
          title: form.title.trim(),
          body: form.body.trim(),
          externalLinkUrl: form.externalLinkUrl || null,
          externalLinkLabel: form.externalLinkLabel || null,
          linkedFormId: form.linkedFormId || null,
          images
        });

        let finalPost = updated;
        if (form.publishNow && updated.status !== AppStatus.Active) {
          finalPost = await this.newsService.publish(this.clubId, updated.id);
        } else if (!form.publishNow && updated.status === AppStatus.Active) {
          finalPost = await this.newsService.unpublish(this.clubId, updated.id);
        }

        this.news.update(list => list.map(item => item.id === finalPost.id ? finalPost : item));
      } else {
        const created = await this.newsService.create(this.clubId, {
          title: form.title.trim(),
          body: form.body.trim(),
          externalLinkUrl: form.externalLinkUrl || null,
          externalLinkLabel: form.externalLinkLabel || null,
          linkedFormId: form.linkedFormId || null,
          publishNow: form.publishNow,
          images
        });
        this.news.update(list => [created, ...list]);
      }

      await this.cleanupOrphanedImages();
      this.uploadedUnsavedImageUrls.clear();
      this.showEditorModal.set(false);
      this.toastService.show(this.translationService.instant('user.news.saved'), 'success');
    } catch {
      this.toastService.show(this.translationService.instant('user.news.saveFailed'), 'danger');
    } finally {
      this.isSaving.set(false);
    }
  }

  async cancelEditor(): Promise<void> {
    await this.newsService.deleteImages(this.clubId, [...this.uploadedUnsavedImageUrls]);
    this.uploadedUnsavedImageUrls.clear();
    this.orphanedImageUrls.clear();
    this.showEditorModal.set(false);
  }

  async publish(newsPost: NewsPost): Promise<void> {
    this.openMenuId.set(null);
    try {
      const updated = await this.newsService.publish(this.clubId, newsPost.id);
      this.news.update(list => list.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.toastService.show(this.translationService.instant('user.news.publishFailed'), 'danger');
    }
  }

  async unpublish(newsPost: NewsPost): Promise<void> {
    this.openMenuId.set(null);
    try {
      const updated = await this.newsService.unpublish(this.clubId, newsPost.id);
      this.news.update(list => list.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.toastService.show(this.translationService.instant('user.news.unpublishFailed'), 'danger');
    }
  }

  async deleteNews(newsPost: NewsPost): Promise<void> {
    this.openMenuId.set(null);
    const confirmed = await this.confirmService.request({
      header: this.translationService.instant('common.delete'),
      message: this.translationService.instant('user.news.deleteConfirm', { title: newsPost.title }),
      confirmText: this.translationService.instant('common.delete'),
      cancelText: this.translationService.instant('common.cancel')
    });
    if (!confirmed) return;

    try {
      await this.newsService.delete(this.clubId, newsPost.id);
      this.news.update(list => list.filter(item => item.id !== newsPost.id));
    } catch {
      this.toastService.show(this.translationService.instant('user.news.deleteFailed'), 'danger');
    }
  }

  private buildImagePayload(): NewsPostImage[] {
    const imageUrl = this.uploadedPrimaryImageUrl();
    return imageUrl ? [{ imageUrl, isPrimary: true, sortOrder: 0 }] : [];
  }

  private getPrimaryImageUrl(newsPost: NewsPost): string | null {
    return newsPost.images?.find(image => image.isPrimary)?.imageUrl ?? newsPost.images?.[0]?.imageUrl ?? null;
  }

  private async cleanupOrphanedImages(): Promise<void> {
    try {
      await this.newsService.deleteImages(this.clubId, [...this.orphanedImageUrls]);
      this.orphanedImageUrls.clear();
    } catch {
      this.toastService.show(this.translationService.instant('user.news.imageCleanupFailed'), 'warning');
    }
  }

  private async loadActiveForms(): Promise<void> {
    if (!this.clubId) {
      this.activeForms.set([]);
      return;
    }

    this.formsLoading.set(true);
    try {
      const forms = await this.formService.getFormsByClubId(this.clubId, AppStatus.Active, false, 100);
      this.activeForms.set(forms);
    } catch {
      this.activeForms.set([]);
      this.toastService.show(this.translationService.instant('user.news.loadFormsFailed'), 'warning');
    } finally {
      this.formsLoading.set(false);
    }
  }

  private createEmptyForm(): NewsFormModel {
    return {
      title: '',
      body: '',
      externalLinkUrl: '',
      externalLinkLabel: '',
      linkedFormId: null,
      publishNow: true
    };
  }

  private getLocale(): Locale {
    switch (this.translationService.getCurrentLanguage()) {
      case 'es': return es;
      case 'ca': return ca;
      default: return enUS;
    }
  }
}
