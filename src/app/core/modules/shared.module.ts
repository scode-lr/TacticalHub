import { NgModule } from '@angular/core';
import { TacticalIonicModule } from './ionic.module';
import { TacticalFormsModule } from './forms.module';
import { TacticalComponentsModule } from './components.module';

@NgModule({
  imports: [
    TacticalIonicModule,
    TacticalFormsModule,
    TacticalComponentsModule,
  ],
  exports: [
    TacticalIonicModule,
    TacticalFormsModule,
    TacticalComponentsModule,
  ],
})
export class TacticalSharedModule {}
