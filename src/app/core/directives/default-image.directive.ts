import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: 'img[appDefaultImage], ion-img[appDefaultImage]',
  standalone: true
})
export class DefaultImageDirective {
  @Input() appDefaultImage: string = 'assets/image-non-available.svg';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('ionError')
  @HostListener('error')
  onError() {
    const element = this.el.nativeElement;
    element.src = this.appDefaultImage;
  }
}
