import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { format, formatDistanceToNow, Locale } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { ca } from 'date-fns/locale/ca';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@core/services/user.service';
import { ClubService } from '@services/club.service';
import { MatchService } from '@services/match.service';
import { NewsService } from '@services/news.service';
import { FormService } from '@services/form.service';
import { NotificationsService } from '@services/notifications.service';
import { InboxService } from '@services/inbox.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { RoleType } from '@core/models/role.model';
import { AppStatus } from '@core/models';
import { Match } from '@models/match.model';
import { NewsPost } from '@models/news.model';
import { FormHeader } from '@models/form-header.model';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  documentTextOutline,
  footballOutline,
  homeOutline,
  informationCircleOutline,
  mailOutline,
  newspaperOutline,
  notificationsOutline,
  peopleOutline,
  settingsOutline
} from 'ionicons/icons';

interface HomeShortcut {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class HomePage implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly clubService = inject(ClubService);
  private readonly matchService = inject(MatchService);
  private readonly newsService = inject(NewsService);
  private readonly formService = inject(FormService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly inboxService = inject(InboxService);
  private readonly translationService = inject(TranslationService);

  private readonly adminShortcuts: HomeShortcut[] = [
    { id: 'inbox', labelKey: 'admin.menu.inbox', descriptionKey: 'admin.description.inbox', icon: 'mail-outline', route: 'inbox' },
    { id: 'forms-submissions', labelKey: 'admin.menu.forms', descriptionKey: 'admin.description.forms', icon: 'document-text-outline', route: 'forms-submissions' },
    { id: 'news', labelKey: 'admin.menu.news', descriptionKey: 'admin.description.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'settings-club', labelKey: 'admin.menu.settings', descriptionKey: 'admin.description.settings', icon: 'settings-outline', route: 'settings-club' }
  ];

  private readonly guestShortcuts: HomeShortcut[] = [
    { id: 'news', labelKey: 'guest.menu.news', descriptionKey: 'guest.description.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'information', labelKey: 'guest.menu.information', descriptionKey: 'guest.description.information', icon: 'information-circle-outline', route: 'information' },
    { id: 'matches', labelKey: 'guest.menu.matches', descriptionKey: 'guest.description.matches', icon: 'football-outline', route: 'matches' },
    { id: 'sponsors', labelKey: 'guest.menu.sponsors', descriptionKey: 'guest.description.sponsors', icon: 'people-outline', route: 'sponsors' }
  ];

  readonly roleType = computed(() => this.userService.getCurrentRole()?.roleId ?? this.navigationService.extractRoleDetails().roleType);
  readonly titleKey = computed(() => this.roleType() === RoleType.Admin ? 'admin.title' : this.roleType() === RoleType.Guest ? 'guest.title' : 'user.title');
  readonly subtitleKey = computed(() => this.roleType() === RoleType.Admin ? 'admin.subtitle' : this.roleType() === RoleType.Guest ? 'guest.subtitle' : 'user.subtitle');
  readonly isMember = computed(() => this.roleType() === RoleType.Member);
  readonly shortcuts = computed(() => {
    switch (this.roleType()) {
      case RoleType.Admin:
        return this.adminShortcuts;
      case RoleType.Guest:
        return this.guestShortcuts;
      default:
        return [];
    }
  });

  readonly firstName = computed(() => this.userService.getCurrentUser()?.metadata?.firstName ?? '');
  readonly greetingKey = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'user.home.greetingMorning';
    if (hour < 20) return 'user.home.greetingAfternoon';
    return 'user.home.greetingEvening';
  });

  readonly upcomingMatches = signal<Match[]>([]);
  readonly featuredNews = signal<NewsPost | null>(null);
  readonly latestForm = signal<FormHeader | null>(null);
  readonly feedLoading = signal<boolean>(true);

  constructor() {
    addIcons({
      calendarOutline,
      documentTextOutline,
      footballOutline,
      homeOutline,
      informationCircleOutline,
      mailOutline,
      newspaperOutline,
      notificationsOutline,
      peopleOutline,
      settingsOutline
    });
  }

  ngOnInit(): void {
    if (this.isMember()) {
      this.loadFeed();
    }
  }

  ionViewWillEnter(): void {
    const roleType = this.roleType();
    if (roleType === RoleType.Admin) {
      void this.notificationsService.loadNotifications();
      void this.inboxService.loadMessages();
    } else if (roleType === RoleType.Member) {
      void this.notificationsService.loadNotifications();
    }
  }

  openShortcut(shortcut: HomeShortcut): void {
    const currentRole = this.userService.getCurrentRole();
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const currentRoleType = currentRole?.roleId ?? roleType;
    const routeContextId = currentRoleType === RoleType.Guest ? currentRole?.clubId : currentRole?.id ?? roleId;
    if (!currentRoleType || !routeContextId) return;
    this.navigationService.navigateTo([`/app/${currentRoleType}/${routeContextId}/${shortcut.route}`]);
  }

  primaryNewsImage(news: NewsPost): string | null {
    const images = news.images ?? [];
    return images.find(image => image.isPrimary)?.imageUrl ?? images[0]?.imageUrl ?? null;
  }

  formatEventDate(date: Date | string): string {
    const formatted = format(new Date(date), 'EEEE · HH:mm\'h\'', { locale: this.getLocale() });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  getTimeAgo(date: string | null | undefined): string {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: this.getLocale() });
  }

  goToMatch(matchId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'matches', matchId.toString()]);
  }

  goToMatches(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'matches']);
  }

  goToNews(newsId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news', newsId.toString()]);
  }

  goToAllNews(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'news']);
  }

  goToForm(formId: number): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'forms', formId.toString()]);
  }

  goToForms(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'forms']);
  }

  private loadFeed(): void {
    const upcoming = this.matchService.getMatches()
      .filter(match => new Date(match.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.upcomingMatches.set(upcoming.slice(0, 4));

    const clubId = this.clubService.getCurrentClubId();
    if (!clubId) {
      this.feedLoading.set(false);
      return;
    }
    this.newsService.getByClubId(clubId, false, 1, 0)
      .then(page => this.featuredNews.set(page.items[0] ?? null))
      .catch(() => this.featuredNews.set(null));
    this.formService.getFormsByClubId(clubId, AppStatus.Active, false, 1, 0)
      .then(forms => this.latestForm.set(forms[0] ?? null))
      .catch(() => this.latestForm.set(null))
      .finally(() => this.feedLoading.set(false));
  }

  private getLocale(): Locale {
    switch (this.translationService.getCurrentLanguage()) {
      case 'es': return es;
      case 'ca': return ca;
      default: return enUS;
    }
  }
}
