import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { ClubMember } from '@core/models/club-member.model';
import { RoleType } from '@core/models/role.model';
import { ClubMembersService } from '@services/club-members.service';
import { ConfirmService } from '@services/confirm.service';
import { ToastService } from '@services/toast.service';
import { UserService } from '@services/user.service';
import { NavigationService } from '@services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { EmptyStateComponent } from '@components/empty-state/empty-state.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  closeCircleOutline,
  ellipsisVertical,
  peopleOutline,
  searchOutline
} from 'ionicons/icons';

interface ClubUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  relations: ClubMember[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonSpinner, TranslatePipe, EmptyStateComponent, UserHeaderComponent, BackButtonComponent],
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit, OnDestroy {
  private readonly clubMembersService = inject(ClubMembersService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly userService = inject(UserService);
  private readonly navigationService = inject(NavigationService);
  private searchTimer?: ReturnType<typeof setTimeout>;
  private loadRequestId = 0;

  readonly members = signal<ClubMember[]>([]);
  readonly isLoading = signal(true);
  readonly savingUserId = signal<number | null>(null);
  readonly openMenuUserId = signal<number | null>(null);
  readonly query = signal('');
  readonly clubId = signal(0);
  readonly totalCount = signal(0);
  readonly offset = signal(0);
  readonly pageSize = 20;
  readonly roleType = RoleType;
  readonly defaultAvatar = 'assets/default-avatar.svg';

  readonly users = computed<ClubUser[]>(() => {
    const usersById = new Map<number, ClubUser>();
    for (const relation of this.members()) {
      const existing = usersById.get(relation.userId);
      if (existing) {
        existing.relations.push(relation);
        continue;
      }

      usersById.set(relation.userId, {
        userId: relation.userId,
        username: relation.username,
        email: relation.email,
        firstName: relation.firstName,
        lastName: relation.lastName,
        avatarUrl: relation.avatarUrl || relation.avatar || this.defaultAvatar,
        relations: [relation]
      });
    }
    return Array.from(usersById.values());
  });

  readonly visibleUsers = computed(() => this.users());
  readonly currentPage = computed(() => Math.floor(this.offset() / this.pageSize) + 1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize)));
  readonly canGoBack = computed(() => this.offset() > 0);
  readonly canGoForward = computed(() => this.offset() + this.pageSize < this.totalCount());

  constructor() {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      closeCircleOutline,
      ellipsisVertical,
      peopleOutline,
      searchOutline
    });
  }

  async ngOnInit(): Promise<void> {
    const role = this.userService.getCurrentRole();
    if (!role) {
      this.isLoading.set(false);
      return;
    }
    this.clubId.set(role.clubId);
    await this.reload();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  async reload(): Promise<void> {
    const requestId = ++this.loadRequestId;
    this.isLoading.set(true);
    try {
      const page = await this.clubMembersService.getByClub(
        this.clubId(), this.pageSize, this.offset(), this.query());
      if (requestId !== this.loadRequestId) return;
      this.members.set(page.items);
      this.totalCount.set(page.totalCount);
    } catch {
      if (requestId !== this.loadRequestId) return;
      this.members.set([]);
      this.totalCount.set(0);
    } finally {
      if (requestId === this.loadRequestId) this.isLoading.set(false);
    }
  }

  search(value: string): void {
    this.query.set(value);
    this.offset.set(0);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => void this.reload(), 300);
  }

  clearSearch(): void {
    if (!this.query()) return;
    this.search('');
  }

  previousPage(): void {
    if (!this.canGoBack() || this.isLoading()) return;
    this.offset.update(value => Math.max(0, value - this.pageSize));
    void this.reload();
  }

  nextPage(): void {
    if (!this.canGoForward() || this.isLoading()) return;
    this.offset.update(value => value + this.pageSize);
    void this.reload();
  }

  toggleMenu(userId: number): void {
    this.openMenuUserId.update(current => current === userId ? null : userId);
  }

  hasRole(user: ClubUser, roleId: RoleType): boolean {
    return user.relations.some(relation => relation.roleId === roleId);
  }

  async assignAdmin(user: ClubUser): Promise<void> {
    if (this.hasRole(user, RoleType.Admin)) return;
    this.openMenuUserId.set(null);
    await this.assignRole(user, RoleType.Admin);
  }

  async deactivateUser(user: ClubUser): Promise<void> {
    const confirmed = await this.confirmService.request({
      header: this.translationService.instant('clubMembers.deactivateUser'),
      message: this.translationService.instant(
        'clubMembers.deactivateConfirm', { name: this.displayName(user) }),
      confirmText: this.translationService.instant('clubMembers.deactivateUser'),
      cancelText: this.translationService.instant('common.cancel')
    });
    if (!confirmed) return;

    this.openMenuUserId.set(null);
    this.savingUserId.set(user.userId);
    try {
      await this.clubMembersService.deactivateUser(this.clubId(), user.userId);
      this.members.update(items => items.filter(item => item.userId !== user.userId));
      this.totalCount.update(value => Math.max(0, value - 1));

      if (this.users().length === 0 && this.offset() > 0) {
        this.offset.update(value => Math.max(0, value - this.pageSize));
        await this.reload();
      }

      this.toastService.show(this.translationService.instant('clubMembers.deactivateSuccess'), 'success');
    } catch {
      this.toastService.show(this.translationService.instant('clubMembers.deactivateError'), 'danger');
    } finally {
      this.savingUserId.set(null);
    }
  }

  roleLabelKey(roleId: number): string {
    if (roleId === RoleType.Admin) return 'roles.admin';
    if (roleId === RoleType.Coach) return 'roles.coach';
    return 'roles.member';
  }

  displayName(user: ClubUser): string {
    return `${user.firstName} ${user.lastName}`.trim() || user.username || user.email;
  }

  backRoute(): string {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    return `/app/${roleType}/${roleId}/more`;
  }

  onAvatarError(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith(this.defaultAvatar)) {
      image.src = this.defaultAvatar;
    }
  }

  private async assignRole(user: ClubUser, roleId: RoleType.Admin): Promise<void> {
    this.savingUserId.set(user.userId);
    try {
      const created = await this.clubMembersService.assignRole(this.clubId(), user.userId, { roleId });
      this.members.update(items => [...items, {
        ...created,
        username: created.username || user.username,
        email: created.email || user.email,
        firstName: created.firstName || user.firstName,
        lastName: created.lastName || user.lastName
      }]);
      this.toastService.show(this.translationService.instant('clubMembers.roleAssigned'), 'success');
    } catch {
      this.toastService.show(this.translationService.instant('clubMembers.roleAssignError'), 'danger');
    } finally {
      this.savingUserId.set(null);
    }
  }
}
