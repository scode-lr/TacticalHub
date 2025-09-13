import { NgModule } from '@angular/core';
import { TacticalIonicModule } from './ionic.module';
import { TacticalFormsModule } from './forms.module';

@NgModule({
  imports: [
    TacticalIonicModule,
    TacticalFormsModule,
  ],
  exports: [
    TacticalIonicModule,
    TacticalFormsModule,
  ],
})
export class TacticalSharedModule {}
