import { Pipe, PipeTransform } from '@angular/core';
import { ensureRichTextHtml } from '@core/utils/rich-text.util';

@Pipe({
  name: 'richText',
  standalone: true
})
export class RichTextPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return ensureRichTextHtml(value);
  }
}
