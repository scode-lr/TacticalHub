import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@pipes/translate.pipe';

const LABEL_KEYS = ['auth.strengthWeak', 'auth.strengthFair', 'auth.strengthGood', 'auth.strengthStrong'];
const LABEL_COLORS = ['#c0392b', '#8a6a06', '#5f7a3d', '#3a6b28'];
const BAR_COLORS = ['#c0392b', '#e8b400', '#8a9e5a', '#4c8f34'];
const BAR_OFF = '#e6e2d8';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss'
})
export class PasswordStrengthComponent {
  readonly password = input<string>('');

  readonly lenOk = computed(() => this.password().length >= 6);
  readonly upperOk = computed(() => /[A-Z]/.test(this.password()));
  readonly numOk = computed(() => /[0-9]/.test(this.password()));
  private readonly hasSpecial = computed(() => /[^A-Za-z0-9]/.test(this.password()));

  // 1 = too short/weak, 2 = fair, 3 = good, 4 = strong — mirrors the existing
  // password validators (required, minLength 6); this only adds a visual signal.
  readonly score = computed(() => {
    const pw = this.password();
    if (!pw) return 0;
    if (!this.lenOk()) return 1;
    return 1 + [this.upperOk(), this.numOk(), this.hasSpecial()].filter(Boolean).length;
  });

  readonly labelKey = computed(() => {
    if (!this.password()) return null;
    if (!this.lenOk()) return 'auth.strengthTooShort';
    return LABEL_KEYS[this.score() - 1];
  });

  readonly labelColor = computed(() => (this.lenOk() ? LABEL_COLORS[this.score() - 1] : LABEL_COLORS[0]));

  barColor(segment: number): string {
    return this.score() >= segment ? BAR_COLORS[segment - 1] : BAR_OFF;
  }
}
