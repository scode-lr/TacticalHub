import { Component, inject, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { NavigationService } from '@core/services/navigation.service';
import { TranslationService } from '@core/services/i18n/translation.service';
import { ACTION_CONFIG, ActionConfig, ActionType } from '../action/action.config';
import { DynamicFormComponent } from '@components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.page.html',
  styleUrls: ['./action-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    DynamicFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionFormPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navigationService = inject(NavigationService);
  private translationService = inject(TranslationService);
  private toastController = inject(ToastController);

  readonly actionConfig = signal<ActionConfig | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  private memberId = '';

  ngOnInit(): void {
    const actionType = this.route.snapshot.paramMap.get('type') as ActionType;
    this.memberId = this.router.url.split('/')[3];
    
    if (!actionType || !ACTION_CONFIG[actionType]) {
      this.goBack();
      return;
    }

    const config = ACTION_CONFIG[actionType];
    this.actionConfig.set(config);
  }

  async onFormSubmit(formData: any): Promise<void> {
    const config = this.actionConfig();
    if (!config) return;

    this.isSubmitting.set(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const toast = await this.toastController.create({
        message: this.translationService.instant(config.successMessage),
        duration: 3000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline'
      });

      await toast.present();
      this.goBack();
    } catch (error) {
      const toast = await this.toastController.create({
        message: this.translationService.instant('viewer.action.form.errors.submitError'),
        duration: 3000,
        position: 'top',
        color: 'danger',
        icon: 'alert-circle-outline'
      });

      await toast.present();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onFormCancel(): void {
    this.goBack();
  }

  private goBack(): void {
    const { roleType, roleId } = this.navigationService.extractRoleDetails();
    this.navigationService.navigateTo([`/app/${roleType}/${roleId}/action`]);
  }
}
