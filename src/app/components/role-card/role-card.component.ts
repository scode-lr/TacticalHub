import { Component, input, output, computed, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Role, RoleType } from '@core/models/role.model';
import { TranslationService } from '@services/i18n/translation.service';
import { AppStatus } from '@core/models/app-status.model';
import { ListCardComponent } from '@components/list-card/list-card.component';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    TranslatePipe,
    ListCardComponent
  ]
})
export class RoleCardComponent {
  private readonly translationService = inject(TranslationService);
  readonly role = input<Role | null>(null);
  readonly isAddCard = input<boolean>(false);
  readonly listMode = input<boolean>(false);
  readonly selected = input<boolean>(false);
  readonly cardClicked = output<Role | null>();
  readonly isPending = computed(() => {
    const roleStatus = this.role()?.status;
    return roleStatus === AppStatus.Pending || roleStatus === AppStatus.Draft;
  });

  getRoleDisplayName(role: Role | null | undefined): string {
    const key = this.getRoleNameKey(role?.roleId);
    const translated = this.translationService.instant('roles.' + key);
    return role?.teamName ? `${translated} (${role.teamName})` : translated;
  }

  getRoleNameKey(roleId: RoleType | undefined): string {
    const nameMap: { [key: number]: string } = {
      [RoleType.Admin]: 'admin',
      [RoleType.Coach]: 'coach',
      [RoleType.Member]: 'member',
      [RoleType.Guest]: 'guest'
    };
    return nameMap[roleId as number] ?? 'member';
  }

  getRoleIcon(roleId: RoleType | undefined): string {
    const iconMap: { [key: number]: string } = {
      [RoleType.Admin]: 'shield-checkmark-outline',
      [RoleType.Coach]: 'clipboard-outline',
      [RoleType.Member]: 'person-outline',
      [RoleType.Guest]: 'eye-outline'
    };
    return iconMap[roleId as number] ?? 'person-outline';
  }

  onCardClick() {
    if (!this.isPending()) {
      this.cardClicked.emit(this.role());
    }
  }
}
