import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';

@Component({
  selector: 'app-viewer-action',
  templateUrl: './action.page.html',
  styleUrls: ['./action.page.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, TranslatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewerActionPage {}
