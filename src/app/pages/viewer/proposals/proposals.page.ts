import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonIcon, IonContent, IonItem, IonInput, IonTextarea, IonButton, IonNote } from '@ionic/angular/standalone';
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
    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonNote,
    TranslatePipe
  ]
})
export class ViewerProposalsPage {
  private fb = inject(FormBuilder);
  private fileValidationService = inject(FileValidationService);

  readonly proposalForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(20)]],
    attachment: [null as File | null]
  });

  readonly selectedFileName = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);
  readonly fileError = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError.set(null);

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file using the service
      const validationResult = this.fileValidationService.validateFile(file);

      if (!validationResult.valid) {
        this.fileError.set(validationResult.errorKey!);
        this.selectedFileName.set(null);
        this.proposalForm.patchValue({ attachment: null });
        input.value = '';
        return;
      }

      // File is valid
      this.selectedFileName.set(file.name);
      this.proposalForm.patchValue({ attachment: file });
    }
  }

  onSubmit(): void {
    if (this.proposalForm.valid) {
      this.isSubmitting.set(true);
      console.log('Proposal submitted:', this.proposalForm.value);

      // Mock submission delay
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.proposalForm.reset();
        this.selectedFileName.set(null);
        this.fileError.set(null);
        // Here we would ideally show a success toast
      }, 1500);
    }
  }
}
