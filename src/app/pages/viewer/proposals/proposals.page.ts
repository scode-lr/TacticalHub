import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';

@Component({
  selector: 'app-viewer-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class ViewerProposalsPage {}
