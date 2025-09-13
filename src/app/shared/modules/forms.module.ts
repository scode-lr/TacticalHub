import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * TacticalFormsModule - Centralized Forms Module
 * 
 * This module provides all form-related functionality including:
 * - Template-driven forms (FormsModule)
 * - Reactive forms (ReactiveFormsModule)
 * - Common form validation utilities
 * 
 * Usage: Import this module in components that need form functionality
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TacticalFormsModule {}