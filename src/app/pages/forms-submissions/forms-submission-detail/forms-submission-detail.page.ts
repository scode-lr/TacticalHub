import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@core/pipes/translate.pipe';
import { BackButtonComponent } from '@components/back-button/back-button.component';

@Component({
  selector: 'app-forms-submission-detail',
  templateUrl: './forms-submission-detail.page.html',
  styleUrls: ['./forms-submission-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe, BackButtonComponent]
})
export class FormsSubmissionDetailPage {}
