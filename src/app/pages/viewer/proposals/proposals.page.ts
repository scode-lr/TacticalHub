import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonIcon, IonInput, IonTextarea, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { FileValidationService } from '@services/file-validation.service';

@Component({
  selector: 'app-viewer-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonIcon,
    IonInput,
    IonTextarea,
    IonButton,
    IonSpinner,
    TranslatePipe
  ]
})
export class ViewerProposalsPage {
  private fb = inject(FormBuilder);
  private fileValidationService = inject(FileValidationService);

  readonly proposalForm = this.fb.group({
    title: [''],
    content: [''],
    attachment: [null as File | null]
  });

  readonly selectedFileName = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly canSubmit = signal<boolean>(false);

  constructor() {
    this.proposalForm.valueChanges.subscribe(() => {
      const title = this.proposalForm.get('title')?.value;
      const content = this.proposalForm.get('content')?.value;
      this.canSubmit.set(!!(title?.trim() && content?.trim()));
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      const validation = this.fileValidationService.validateFile(file);
      
      if (validation.valid) {
        this.selectedFileName.set(file.name);
        this.proposalForm.patchValue({ attachment: file });
      } else {
        input.value = '';
        this.selectedFileName.set(null);
        this.proposalForm.patchValue({ attachment: null });
      }
    }
  }

  onSubmit(): void {
    if (this.canSubmit() && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      
      console.log('Proposal submitted:', {
        title: this.proposalForm.get('title')?.value,
        content: this.proposalForm.get('content')?.value,
        attachment: this.selectedFileName()
      });

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.proposalForm.reset();
        this.selectedFileName.set(null);
      }, 1500);
    }
  }
}
