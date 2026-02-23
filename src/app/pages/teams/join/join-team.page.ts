import { Component, inject, signal, computed, ElementRef, ViewChildren, QueryList, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '@services/navigation.service';
import { TranslatePipe } from '@pipes/translate.pipe';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { UserService } from '@core/services/user.service';
import { RolesService } from '@core/services/roles.service';
import { RoleType } from '@core/models/role.model';
import { Team } from '@core/models/team.model';
import { RoleUtils } from '@core/utils/role.utils';
import { mockTeams } from '../../../../mocks';
import { addIcons } from 'ionicons';
import { arrowBackOutline, clipboardOutline, eyeOutline, checkmarkCircle, closeOutline } from 'ionicons/icons';
import { environment } from '@environment';
import { ClubService } from '@services/club.service';

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
  private readonly rolesService = inject(RolesService);
  private readonly route = inject(ActivatedRoute);
  private readonly clubService = inject(ClubService);

  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('roleSection', { read: ElementRef }) roleSection?: ElementRef<HTMLElement>;
  @ViewChild('teamSection', { read: ElementRef }) teamSection?: ElementRef<HTMLElement>;
  @ViewChild(IonContent) ionContent?: IonContent;

  readonly codeDigits = signal<string[]>(['', '', '', '', '']);
  readonly code = computed(() => this.codeDigits().join(''));
  readonly selectedRole = signal<RoleType | null>(null);
  readonly selectedTeam = signal<number>(0);
  readonly isSubmitting = signal<boolean>(false);
  readonly matchedTeam = signal<{ name: string; clubName: string } | null>(null);
  readonly showConfirmation = signal<boolean>(false);
  readonly isPrivateApp = environment.private;
  readonly roleType = RoleType;
  readonly showBackButton = signal<boolean>(false);
  readonly isGuestMode = signal<boolean>(false);
  readonly availableTeams = signal<Team[]>(mockTeams);
  readonly clubId = computed(() => this.isPrivateApp ? this.clubService.getInternalClubId() ?? 0 : 0);

  readonly buttonText = computed(() => {
    const roleId = this.selectedRole();
    if (this.isSubmitting()) {
      return roleId !== null && RoleUtils.isViewer(roleId) ? 'joinTeam.joiningInstant' : 'common.submitting';
    }
    return roleId !== null && RoleUtils.isViewer(roleId) ? 'joinTeam.joinInstant' : 'joinTeam.submitRequest';
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

  // Todo: Replace with real API call
  async checkClubCode() {
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
        this.checkClubCode();
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
        this.checkClubCode();
      }
    }
  }

  selectRole(role: RoleType) {
    this.selectedRole.set(role);
    if (role !== RoleType.Coach) {
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
      if (this.selectedRole() === RoleType.Coach) {
        return this.selectedRole() !== null && this.selectedTeam() !== 0;
      }
      return this.selectedRole() !== null;
    }
    if (this.selectedRole() === RoleType.Coach) {
      return this.code().length === 5 && this.selectedRole() !== null && this.selectedTeam() !== 0 && this.matchedTeam() !== null;
    }
    return this.code().length === 5 && this.selectedRole() !== null && this.matchedTeam() !== null;
  }

  cancelConfirmation() {
    this.showConfirmation.set(false);
    this.matchedTeam.set(null);
    this.codeDigits.set(['', '', '', '', '']);
    const inputs = this.codeInputs.toArray();
    inputs[0]?.nativeElement.focus();
  }

  async submitBind() {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting.set(true);
    const role = this.selectedRole();

    try {
        if (role === null) {
          return;
        }

        const boundRole = await this.rolesService.bindRole({
          roleId: role,
          clubId: this.clubId(),
          teamSeasonId: this.selectedTeam()
        });
        console.log('Bound Role:', boundRole);
        if(!boundRole){
          return;
        }

        await this.userService.fetchUserProfile();
        console.log('User profile updated with new role. Navigating to appropriate page...',RoleUtils.isViewer(boundRole.roleId));
        if(RoleUtils.isViewer(boundRole.roleId)) {
          this.navigationService.navigateTo([`app/3/${boundRole.roleId}`]);
          return;
        }
        this.navigationService.navigateTo(['teams/selection']);
    } catch (error) {
      console.error('Error binding role:', error);
      return;
    } finally {
      this.isSubmitting.set(false);
      this.selectedRole.set(null);
      this.selectedTeam.set(0);
      this.codeDigits.set(['', '', '', '', '']);
    }
  }

  goBack() {
    this.navigationService.navigateTo(['teams/selection']);
  }

  skipForNow() {
    this.navigationService.navigateTo(['layouts/my-teams']);
  }
}
