import { ExportEntityType } from './export-profile.model';

export enum ExternalIntegrationProvider {
  GoogleSheets = 1
}

export enum ExternalIntegrationDestinationType {
  Spreadsheet = 1,
  Webhook = 2
}

export interface ExternalIntegration {
  id: number;
  clubId: number;
  entityType: ExportEntityType;
  sourceId: number | null;
  exportProfileId: number;
  provider: ExternalIntegrationProvider;
  destinationType: ExternalIntegrationDestinationType;
  name: string;
  isEnabled: boolean;
  configurationJson: string;
  createdAt: string;
  updatedAt: string;
  lastSyncAt: string | null;
  lastError: string | null;
  pendingSyncItems: number;
}

export interface GoogleSheetsConfiguration {
  spreadsheetId: string;
  sheetName: string;
}

export interface SaveExternalIntegrationRequest {
  exportProfileId: number;
  provider: ExternalIntegrationProvider;
  destinationType: ExternalIntegrationDestinationType;
  name: string;
  isEnabled: boolean;
  configurationJson: string;
}

export interface CreateGoogleSheetsIntegrationRequest {
  name: string;
  sheetName: string;
  shareWithEmail: string;
}

export interface CreateGoogleSheetsIntegrationResponse {
  integrationId: number;
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetName: string;
}

export interface ExternalIntegrationTestResult {
  success: boolean;
  message: string;
}

export interface ExternalSyncResult {
  processed: number;
  synced: number;
  failed: number;
  pending: number;
  message?: string | null;
}
