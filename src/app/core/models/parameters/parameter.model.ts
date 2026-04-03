export interface Parameter<T = unknown> {
  id: string;
  name: string;
  description: string;
  timeCreated: Date;
  timeModified: Date;
  value: T;
}
