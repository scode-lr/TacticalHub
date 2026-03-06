import { Component, input, output, signal, computed, inject } from '@angular/core';
import { IonIcon, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Role, RoleType } from '@core/models/role.model';
import { TranslationService } from '@services/i18n/translation.service';
import { AppStatus } from '@core/models/app-status.model';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonAvatar,
    IonImg,
    TranslatePipe
  ]
})
export class RoleCardComponent {
  private readonly translationService = inject(TranslationService);
  readonly role = input<Role | null>(null);
  readonly isAddCard = input<boolean>(false);
  readonly cardClicked = output<Role | null>();
  readonly showDefaultIcon = signal<boolean>(false);
  readonly isPending = computed(() => {
    const roleStatus = this.role()?.status;
    return roleStatus === AppStatus.Pending || roleStatus === AppStatus.Draft;
  });

  getRoleDisplayName(role: Role | null | undefined): string {
    const key = this.getRoleNameKey(role?.roleId);
    const translated = this.translationService.instant('roles.' + key);
    console.log('Translate', translated)
    return role?.teamName ? `${translated} (${role.teamName})` : translated;
  }

  getRoleNameKey(roleId: RoleType | undefined): string {
    const nameMap: { [key: number]: string } = {
      [RoleType.Admin]: 'admin',
      [RoleType.Coach]: 'coach',
      [RoleType.Viewer]: 'viewer',
      [RoleType.Guest]: 'guest'
    };
    return nameMap[roleId as number] ?? 'viewer';
  }

  getRoleIcon(roleId: RoleType | undefined): string {
    const iconMap: { [key: number]: string } = {
      [RoleType.Admin]: 'shield-checkmark-outline',
      [RoleType.Coach]: 'clipboard-outline',
      [RoleType.Viewer]: 'person-outline',
      [RoleType.Guest]: 'eye-outline'
    };
    return iconMap[roleId as number] ?? 'person-outline';
  }

  onLogoError() {
    this.showDefaultIcon.set(true);
  }

  onCardClick() {
    if (!this.isPending()) {
      this.cardClicked.emit(this.role());
    }
  }
}
