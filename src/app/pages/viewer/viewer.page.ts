import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ViewerMenuComponent } from '@components/viewer-menu/viewer-menu.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { RoleSelectorComponent } from '@components/role-selector/role-selector.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    ViewerMenuComponent,
    UserHeaderComponent,
    RoleSelectorComponent
  ]
})
export class ViewerPage  {
  private readonly route = inject(ActivatedRoute);
}
