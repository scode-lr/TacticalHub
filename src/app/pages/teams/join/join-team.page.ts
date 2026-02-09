import { Component, inject, signal, computed, ElementRef, ViewChildren, QueryList, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { UserService } from '@core/services/user.service';
import { Team } from '@core/models/team.model';
import { Role, RoleStatus, RoleType } from '@core/models/role.model';
import { mockTeams } from '../../../../mocks';
import { addIcons } from 'ionicons';
import { arrowBackOutline, clipboardOutline, eyeOutline, checkmarkCircle, closeOutline } from 'ionicons/icons';
import { environment } from '@environment';

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
export class JoinTeamPage implements OnInit, AfterViewInit {
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('roleSection', { read: ElementRef }) roleSection?: ElementRef<HTMLElement>;
  @ViewChild('teamSection', { read: ElementRef }) teamSection?: ElementRef<HTMLElement>;
  @ViewChild(IonContent) ionContent?: IonContent;

  readonly codeDigits = signal<string[]>(['', '', '', '', '']);
  readonly code = computed(() => this.codeDigits().join(''));
  readonly selectedRole = signal<string>('');
  readonly selectedTeam = signal<number>(0);
  readonly isSubmitting = signal<boolean>(false);
  readonly matchedTeam = signal<{ name: string; clubName: string } | null>(null);
  readonly showConfirmation = signal<boolean>(false);
  readonly isPrivateApp = environment.private;
  readonly showBackButton = signal<boolean>(false);
  readonly isGuestMode = signal<boolean>(false);
  readonly availableTeams = signal<Team[]>(mockTeams);

  readonly buttonText = computed(() => {
    if (this.isSubmitting()) {
      return this.selectedRole() === 'Viewer' ? 'joinTeam.joiningInstant' : 'common.submitting';
    }
    return this.selectedRole() === 'Viewer' ? 'joinTeam.joinInstant' : 'joinTeam.submitRequest';
  });

  constructor() {
    addIcons({ arrowBackOutline, clipboardOutline, eyeOutline, checkmarkCircle, closeOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isGuestMode.set(params['guest'] === 'true');
    });

    if (this.isGuestMode()) {
      this.showBackButton.set(false);
    } else {
      const user = this.userService.getStoredUser();
      const hasRoles = (user?.roles?.length ?? 0) > 0;
      this.showBackButton.set(hasRoles);
    }
  }

  ngAfterViewInit() {
    if (this.isPrivateApp) {
      this.matchedTeam.set({
        name: environment.name,
        clubName: environment.name
      });
      this.showConfirmation.set(true);
    }
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

  scrollToTeams() {
    setTimeout(() => {
      if (this.teamSection && this.ionContent) {
        const element = this.teamSection.nativeElement;
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
    if (role !== 'Coach') {
      this.selectedTeam.set(0);
    } else {
      this.scrollToTeams();
    }
  }

  selectTeam(teamId: number) {
    this.selectedTeam.set(teamId);
  }

  isFormValid(): boolean {
    if (this.isPrivateApp) {
      if (this.selectedRole() === 'Coach') {
        return this.selectedRole() !== '' && this.selectedTeam() !== 0;
      }
      return this.selectedRole() !== '';
    }
    if (this.selectedRole() === 'Coach') {
      return this.code().length === 5 && this.selectedRole() !== '' && this.selectedTeam() !== 0 && this.matchedTeam() !== null;
    }
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
    const role = this.selectedRole();

    try {
      if (role === 'Viewer') {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.navigationService.navigateTo(['teams/selection']);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentUser = this.userService.getCurrentUser();
        if (currentUser) {
          const selectedTeamData = this.availableTeams().find(t => t.id === this.selectedTeam());
          const teamName = selectedTeamData ? `${selectedTeamData.name} ${selectedTeamData.category}` : undefined;
          
          const pendingRole : Role = {
            id: Math.floor(Math.random() * 1000000),
            name: 'Coach',
            type: RoleType.Coach,
            club: {
              id: Math.floor(Math.random() * 1000000),
              name: this.matchedTeam()?.clubName || 'Club',
              code: '',
              logoUrl: '',
              description: '',
              location: ''
            },
            description: 'Pending approval',
            permissions: [],
            team: teamName,
            createdAt: new Date(),
            status: RoleStatus.Pending
          };
          
          const updatedUser = {
            ...currentUser,
            roles: [...(currentUser.roles || []), pendingRole]
          };
          
          this.userService.setUser(updatedUser);
        }
        
        this.navigationService.navigateTo(['teams/selection']);
      }
    } catch (error) {
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack() {
    this.navigationService.navigateTo(['teams/selection']);
  }

  skipForNow() {
    this.navigationService.navigateTo(['layouts/my-teams']);
  }
}
