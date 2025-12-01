import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { ACTION_CONFIG, ActionType } from './action.config';
import { ActionCardComponent } from '@components/action-card/action-card.component';

interface ActionCard {
  type: ActionType;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-viewer-action',
  templateUrl: './action.page.html',
  styleUrls: ['./action.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, ActionCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewerActionPage {
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  readonly actions: ActionCard[] = [
    {
      type: 'register-player',
      icon: 'person-add-outline',
      title: 'viewer.action.registerPlayer',
      description: 'viewer.action.registerPlayerDesc'
    },
    {
      type: 'become-member',
      icon: 'card-outline',
      title: 'viewer.action.becomeMember',
      description: 'viewer.action.becomeMemberDesc'
    }
  ];

  onActionSelect(actionType: ActionType): void {
    const roleId = this.router.url.split('/')[2];
    this.navigationService.navigateTo(['/app', roleId, 'action-form', actionType]);
  }
}
