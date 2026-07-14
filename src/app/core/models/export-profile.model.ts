export enum ExportEntityType {
  FormSubmission = 1,
  Player = 2
}

export enum ExportColumnSourceKind {
  System = 1,
  FormField = 2,
  PlayerProperty = 3,
  CustomMetadata = 4
}

export interface ExportColumn {
  id: number | null;
  sourceKind: ExportColumnSourceKind;
  sourceKey: string;
  header: string;
  order: number;
  isEnabled: boolean;
  format?: string | null;
}

export interface ExportProfile {
  id: number | null;
  clubId: number;
  entityType: ExportEntityType;
  sourceId: number | null;
  name: string;
  isDefault: boolean;
  columns: ExportColumn[];
}

export interface SaveExportColumnRequest {
  sourceKind: ExportColumnSourceKind;
  sourceKey: string;
  header: string;
  order: number;
  isEnabled: boolean;
  format?: string | null;
}

export interface SaveExportProfileRequest {
  name?: string | null;
  columns: SaveExportColumnRequest[];
}
