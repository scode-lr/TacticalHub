import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { ViewerMenuComponent } from '@components/viewer-menu/viewer-menu.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,
    ViewerMenuComponent
  ]
})
export class ViewerPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Viewer roleId:', params['roleId']);
    });
  }
}
