import { NgModule } from '@angular/core';
import { TacticalIonicModule } from './ionic.module';
import { TacticalFormsModule } from './forms.module';

/**
 * TacticalSharedModule - Main Shared Module
 * 
 * This module combines all commonly used modules across the TacticalHub application:
 * - All Ionic components (TacticalIonicModule)
 * - Form functionality (TacticalFormsModule)
 * 
 * Benefits:
 * - Reduces boilerplate imports in components
 * - Centralized module management
 * - Consistent component availability
 * - Easy maintenance and updates
 * 
 * Usage: Import this module in standalone components or feature modules
 * instead of importing individual Ionic components
 */
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