import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { FormService } from '@services/form.service';
import { ClubService } from '@services/club.service';
import { FormHeader } from '@models/form-header.model';
import { FormHeaderComponent } from '../settings-forms/form-header/form-header.component';
import { addIcons } from 'ionicons';
import { documentTextOutline } from 'ionicons/icons';
import { AppStatus } from '@core/models';

@Component({
  selector: 'app-viewer-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, FormHeaderComponent]
})
export class FormsPage implements OnInit {
  private readonly formService = inject(FormService);
  private readonly clubService = inject(ClubService);

  readonly forms = signal<FormHeader[]>([]);
  readonly loading = signal<boolean>(true);

  constructor() {
    addIcons({ documentTextOutline });
  }

  async ngOnInit(): Promise<void> {
    const clubId = this.clubService.getCurrentClubId();
    if (clubId !== null) {
      const forms = await this.formService.getFormsByClubId(clubId, AppStatus.Active);
      this.forms.set(forms);
    }
    this.loading.set(false);
  }
}
