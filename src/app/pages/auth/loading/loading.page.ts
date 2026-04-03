import { Component, inject, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@pipes/translate.pipe';
import { AuthBrandingComponent } from '../components/auth-branding/auth-branding.component';
import { LoadingService } from '@services/loading.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    AuthBrandingComponent,
    TranslatePipe
  ]
})
export class LoadingPage {
  private readonly loadingService = inject(LoadingService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly loadingMessageKey = computed(() => this.loadingService.state().messageKey);
  readonly loadingSubMessageKey = computed(() => this.loadingService.state().subMessageKey);

  async ionViewWillEnter() {
    const isGuest = this.activatedRoute.snapshot.queryParamMap.get('guest') === 'true';
    if (isGuest) {
      await this.loadingService.handleGuestAccess();
    } else {
      await this.loadingService.handleUserAccess();
    }
  }

  
}
