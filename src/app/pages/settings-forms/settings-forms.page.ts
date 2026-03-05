import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@core/pipes/translate.pipe';

@Component({
  selector: 'app-settings-forms',
  templateUrl: './settings-forms.page.html',
  styleUrls: ['./settings-forms.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class SettingsFormsPage {}
