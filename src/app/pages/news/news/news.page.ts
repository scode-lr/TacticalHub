import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonModal, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { NewsCardComponent } from '@components/news-card/news-card.component';
import { NewsPost, NewsPostImage, TimeFilter } from '@models/news.model';
import { NewsService } from '@services/news.service';
import { ClubService } from '@services/club.service';
import { FormService } from '@services/form.service';
import { RoleType } from '@models/role.model';
import { ToastService } from '@services/toast.service';
import { ConfirmService } from '@services/confirm.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { AppStatus } from '@models/app-status.model';
import { FormDetail } from '@core/responses/form.response';

interface NewsFormModel {
  title: string;
  body: string;
  externalLinkUrl: string;
  externalLinkLabel: string;
  linkedFormId: number | null;
  publishNow: boolean;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonModal, IonSpinner, TranslatePipe, NewsCardComponent]
})
export class NewsPage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly newsService = inject(NewsService);
  private readonly clubService = inject(ClubService);
  private readonly formService = inject(FormService);
  private readonly toastService = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly translationService = inject(TranslationService);
  
  readonly news = signal<NewsPost[]>([]);
  readonly loading = signal(true);
  readonly selectedTimeFilter = signal<TimeFilter>(TimeFilter.All);
  readonly showTimeModal = signal<boolean>(false);
  readonly showEditorModal = signal(false);
  readonly isSaving = signal(false);
  readonly imageUploading = signal(false);
  readonly editingNews = signal<NewsPost | null>(null);
  readonly uploadedPrimaryImageUrl = signal<string | null>(null);
  readonly activeForms = signal<FormDetail[]>([]);
  readonly formsLoading = signal(false);
  
  readonly TimeFilter = TimeFilter;
  readonly AppStatus = AppStatus;
  readonly isAdmin = computed(() => this.navigationService.extractRoleDetails().roleType === RoleType.Admin);

  readonly form = signal<NewsFormModel>(this.createEmptyForm());

  private clubId = 0;
  private orphanedImageUrls = new Set<string>();
  private uploadedUnsavedImageUrls = new Set<string>();

  async ngOnInit(): Promise<void> {
    this.clubId = this.clubService.getCurrentClubId() ?? 0;
    await this.loadNews();
  }
  
  readonly filteredNews = computed(() => {
    let filtered = this.news();
    
    const timeFilter = this.selectedTimeFilter();
    if (timeFilter !== TimeFilter.All) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case TimeFilter.Today:
          filterDate.setHours(0, 0, 0, 0);
          break;
        case TimeFilter.Week:
          filterDate.setDate(now.getDate() - 7);
          break;
        case TimeFilter.Month:
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case TimeFilter.Year:
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(n => new Date(n.publishedAt ?? n.createdAt) >= filterDate);
    }
    
    return filtered;
  });
  
  readonly timeFilters = [
    { value: TimeFilter.All, label: 'user.news.time.all' },
    { value: TimeFilter.Today, label: 'user.news.time.today' },
    { value: TimeFilter.Week, label: 'user.news.time.week' },
    { value: TimeFilter.Month, label: 'user.news.time.month' },
    { value: TimeFilter.Year, label: 'user.news.time.year' }
  ];
  
  async loadNews(): Promise<void> {
    try {
      this.loading.set(true);
      const posts = await this.newsService.getByClubId(this.clubId, this.isAdmin());
      this.news.set(posts);
    } catch {
      this.news.set([]);
    } finally {
      this.loading.set(false);
    }
  }
  
  selectTimeFilter(timeFilter: TimeFilter): void {
    this.selectedTimeFilter.set(timeFilter);
    this.showTimeModal.set(false);
  }
  
  openNews(id: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news', id.toString()]);
  }

  async startCreate(): Promise<void> {
    this.editingNews.set(null);
    this.form.set(this.createEmptyForm());
    this.uploadedPrimaryImageUrl.set(null);
    this.orphanedImageUrls.clear();
    this.uploadedUnsavedImageUrls.clear();
    await this.loadActiveForms();
    this.showEditorModal.set(true);
  }

  async startEdit(newsPost: NewsPost): Promise<void> {
    const primaryImage = this.getPrimaryImageUrl(newsPost);
    this.editingNews.set(newsPost);
    this.form.set({
      title: newsPost.title,
      body: newsPost.body,
      externalLinkUrl: newsPost.externalLinkUrl ?? '',
      externalLinkLabel: newsPost.externalLinkLabel ?? '',
      linkedFormId: newsPost.linkedFormId ?? null,
      publishNow: newsPost.status === AppStatus.Active
    });
    this.uploadedPrimaryImageUrl.set(primaryImage);
    this.orphanedImageUrls.clear();
    this.uploadedUnsavedImageUrls.clear();
    await this.loadActiveForms();
    this.showEditorModal.set(true);
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
    try {
      const updated = await this.newsService.publish(this.clubId, newsPost.id);
      this.news.update(list => list.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.toastService.show(this.translationService.instant('user.news.publishFailed'), 'danger');
    }
  }

  async unpublish(newsPost: NewsPost): Promise<void> {
    try {
      const updated = await this.newsService.unpublish(this.clubId, newsPost.id);
      this.news.update(list => list.map(item => item.id === updated.id ? updated : item));
    } catch {
      this.toastService.show(this.translationService.instant('user.news.unpublishFailed'), 'danger');
    }
  }

  async deleteNews(newsPost: NewsPost): Promise<void> {
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

  updateForm<K extends keyof NewsFormModel>(key: K, value: NewsFormModel[K]): void {
    this.form.update(current => ({ ...current, [key]: value }));
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
}
