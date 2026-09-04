import { Component, computed, input } from '@angular/core';
import { Role, RoleType } from '@models/role.model';
import { User } from '@models/user.model';
import { TranslatePipe } from '@pipes/translate.pipe';
import { DefaultImageDirective } from '@directives/default-image.directive';

@Component({
  selector: 'app-account-identity',
  standalone: true,
  imports: [TranslatePipe, DefaultImageDirective],
  templateUrl: './account-identity.component.html',
  styleUrls: ['./account-identity.component.scss'],
})
export class AccountIdentityComponent {
  readonly user = input<User | null>(null);
  readonly role = input<Role | null>(null);
  readonly isGuest = computed(() => this.user()?.isGuest || this.role()?.roleId === RoleType.Guest);
  readonly displayName = computed(() => {
    const user = this.user();
    return [user?.metadata?.firstName, user?.metadata?.lastName].filter(Boolean).join(' ').trim() || user?.username || user?.email || '';
  });
  readonly roleLabel = computed(() => ({
    [RoleType.Admin]: 'roles.admin', [RoleType.Coach]: 'roles.coach',
    [RoleType.Member]: 'roles.member', [RoleType.Guest]: 'roles.guest',
  })[this.role()?.roleId ?? RoleType.Guest]);
}
