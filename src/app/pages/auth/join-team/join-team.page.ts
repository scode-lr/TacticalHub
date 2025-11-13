import { Component, inject, signal, computed, ElementRef, ViewChildren, QueryList, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, clipboardOutline, eyeOutline, checkmarkCircle, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-join-team',
  templateUrl: './join-team.page.html',
  styleUrls: ['./join-team.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon,
    TranslatePipe,
    UserHeaderComponent
  ]
})
export class JoinTeamPage implements AfterViewInit {
  private readonly navigationService = inject(NavigationService);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('roleSection', { read: ElementRef }) roleSection?: ElementRef<HTMLElement>;
  @ViewChild(IonContent) ionContent?: IonContent;

  readonly codeDigits = signal<string[]>(['', '', '', '', '']);
  readonly code = computed(() => this.codeDigits().join(''));
  readonly selectedRole = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);
  readonly matchedTeam = signal<{ name: string; clubName: string } | null>(null);
  readonly showConfirmation = signal<boolean>(false);

  constructor() {
    addIcons({ arrowBackOutline, clipboardOutline, eyeOutline, checkmarkCircle, closeOutline });
  }

  ngAfterViewInit() {
    // ViewChild will be available after view init
  }

  scrollToRoles() {
    setTimeout(() => {
      if (this.roleSection && this.ionContent) {
        const element = this.roleSection.nativeElement;
        const yOffset = element.offsetTop - 20;
        this.ionContent.scrollToPoint(0, yOffset, 3000);
      }
    }, 100);
  }

  async checkTeamCode() {
    if (this.code().length !== 5) {
      this.matchedTeam.set(null);
      this.showConfirmation.set(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      // Simulate API call to check if code matches a team
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock response - replace with actual API call
      if (this.code() === '12345') {
        this.matchedTeam.set({
          name: 'U-19 Team',
          clubName: 'FC Barcelona'
        });
        this.showConfirmation.set(true);
        this.scrollToRoles();
      } else {
        this.matchedTeam.set(null);
        this.showConfirmation.set(false);
      }
    } catch (error) {
      console.error('Error checking team code:', error);
      this.matchedTeam.set(null);
      this.showConfirmation.set(false);
    }
  }

  onDigitInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    
    if (value) {
      const digits = [...this.codeDigits()];
      digits[index] = value.slice(-1);
      this.codeDigits.set(digits);
      
      if (index < 4) {
        const inputs = this.codeInputs.toArray();
        inputs[index + 1]?.nativeElement.focus();
      } else {
        this.checkTeamCode();
      }
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        const digits = [...this.codeDigits()];
        digits[index - 1] = '';
        this.codeDigits.set(digits);
        
        const inputs = this.codeInputs.toArray();
        inputs[index - 1]?.nativeElement.focus();
      } else {
        const digits = [...this.codeDigits()];
        digits[index] = '';
        this.codeDigits.set(digits);
      }
      this.showConfirmation.set(false);
      this.matchedTeam.set(null);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      const inputs = this.codeInputs.toArray();
      inputs[index - 1]?.nativeElement.focus();
    } else if (event.key === 'ArrowRight' && index < 4) {
      const inputs = this.codeInputs.toArray();
      inputs[index + 1]?.nativeElement.focus();
    }
  }

  onCodePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 5);
    
    if (pastedData) {
      const digits = pastedData.split('');
      while (digits.length < 5) {
        digits.push('');
      }
      this.codeDigits.set(digits);
      
      const inputs = this.codeInputs.toArray();
      const lastFilledIndex = Math.min(pastedData.length, 4);
      inputs[lastFilledIndex]?.nativeElement.focus();
      
      if (pastedData.length === 5) {
        this.checkTeamCode();
      }
    }
  }

  selectRole(role: string) {
    this.selectedRole.set(role);
  }

  isFormValid(): boolean {
    return this.code().length === 5 && this.selectedRole() !== '' && this.matchedTeam() !== null;
  }

  cancelConfirmation() {
    this.showConfirmation.set(false);
    this.matchedTeam.set(null);
    this.codeDigits.set(['', '', '', '', '']);
    const inputs = this.codeInputs.toArray();
    inputs[0]?.nativeElement.focus();
  }

  async submitJoinRequest() {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting.set(true);

    try {
      // TODO: Implement API call to join team
      console.log('Join team request:', {
        code: this.code(),
        role: this.selectedRole()
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate back to role selection
      this.navigationService.navigateTo(['auth/role-selection']);
    } catch (error) {
      console.error('Error joining team:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack() {
    this.navigationService.goBack();
  }
}
