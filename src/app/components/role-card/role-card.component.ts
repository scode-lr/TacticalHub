import { Component, input, output, signal, computed } from '@angular/core';
import { IonIcon, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { Role, RoleStatus } from '@core/models/role.model';

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
  readonly role = input<Role | null>(null);
  readonly isAddCard = input<boolean>(false);
  readonly cardClicked = output<Role | null>();
  readonly showDefaultIcon = signal<boolean>(false);
  readonly isPending = computed(() => {
    const roleStatus = this.role()?.status;
    return roleStatus === RoleStatus.Pending || roleStatus === RoleStatus.Draft;
  });

  getRoleIcon(roleName: string): string {
    const iconMap: { [key: string]: string } = {
      'Player': 'football-outline',
      'Coach': 'clipboard-outline',
      'Admin': 'shield-checkmark-outline',
      'Manager': 'briefcase-outline'
    };
    return iconMap[roleName] || 'person-outline';
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
