import { Team } from "./team.model";

export interface Club {
  id: number;
  name: string;
  code: string;
  description: string;
  location: string;
  logo: string;
  teams?: Team[];
}
