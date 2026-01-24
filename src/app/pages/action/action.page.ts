import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { ParametersService } from '@core/services/parameters.service';
import { ActionCardComponent } from '@components/action-card/action-card.component';
import { ActionParameter, ActionType } from '@core/models/parameters/action-param.model';
import { ParameterType } from '@core/models/parameters/parameter-type.enum';

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
  private parametersService = inject(ParametersService);

  readonly actions: ActionParameter[] = this.parametersService.getParameterValue<ActionParameter[]>(ParameterType.ActionCards) ?? [];

  onActionSelect(actionType: ActionType): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/action/${actionType}`]);
  }
}
