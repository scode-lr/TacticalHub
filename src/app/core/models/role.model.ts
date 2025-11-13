import { Club } from "./club.model";

export interface Role {
  id: string;
  name: string;
  club: Club;
  description: string;
  permissions: string[];
  team?: string;
  createdAt: Date;
}
