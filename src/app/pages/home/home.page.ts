import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@services/navigation.service';
import { UserService } from '@core/services/user.service';
import { RoleType } from '@core/models/role.model';
import { addIcons } from 'ionicons';
import {
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
export class HomePage {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);

  private readonly adminShortcuts: HomeShortcut[] = [
    { id: 'inbox', labelKey: 'admin.menu.inbox', descriptionKey: 'admin.description.inbox', icon: 'mail-outline', route: 'inbox' },
    { id: 'forms-submissions', labelKey: 'admin.menu.forms', descriptionKey: 'admin.description.forms', icon: 'document-text-outline', route: 'forms-submissions' },
    { id: 'news', labelKey: 'admin.menu.news', descriptionKey: 'admin.description.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'settings-club', labelKey: 'admin.menu.settings', descriptionKey: 'admin.description.settings', icon: 'settings-outline', route: 'settings-club' }
  ];

  private readonly memberShortcuts: HomeShortcut[] = [
    { id: 'news', labelKey: 'user.menu.news', descriptionKey: 'user.description.news', icon: 'newspaper-outline', route: 'news' },
    { id: 'forms', labelKey: 'user.menu.forms', descriptionKey: 'user.description.forms', icon: 'document-text-outline', route: 'forms' },
    { id: 'information', labelKey: 'user.menu.information', descriptionKey: 'user.description.information', icon: 'information-circle-outline', route: 'information' },
    { id: 'sponsors', labelKey: 'user.menu.sponsors', descriptionKey: 'user.description.sponsors', icon: 'people-outline', route: 'sponsors' },
    { id: 'contact', labelKey: 'user.menu.contact', descriptionKey: 'user.description.contact', icon: 'mail-outline', route: 'contact' }
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
  readonly shortcuts = computed(() => {
    switch (this.roleType()) {
      case RoleType.Admin:
        return this.adminShortcuts;
      case RoleType.Guest:
        return this.guestShortcuts;
      default:
        return this.memberShortcuts;
    }
  });

  constructor() {
    addIcons({
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

  openShortcut(shortcut: HomeShortcut): void {
    const currentRole = this.userService.getCurrentRole();
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    const currentRoleType = currentRole?.roleId ?? roleType;
    const routeContextId = currentRoleType === RoleType.Guest ? currentRole?.clubId : currentRole?.id ?? roleId;
    if (!currentRoleType || !routeContextId) return;
    this.navigationService.navigateTo([`/app/${currentRoleType}/${routeContextId}/${shortcut.route}`]);
  }
}
