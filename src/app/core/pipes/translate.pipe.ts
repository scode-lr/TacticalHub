import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@services/i18n/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: string, params?: Record<string, any>): string {
    return this.translationService.instant(key, params);
  }
}
