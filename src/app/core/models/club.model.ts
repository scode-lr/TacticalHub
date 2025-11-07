export class Club {
  id!: string;
  name!: string;
  description!: string;
  location!: string;
  logoUrl!: string;
  level?: string;
  membersCount?: number;
  teamsCount?: number;

  hasMultipleTeams(): boolean {
    return this.teamsCount ? this.teamsCount > 1 : false;
  }

  getShortDescription(maxLength: number = 100): string {
    if (this.description.length <= maxLength) {
      return this.description;
    }
    return this.description.substring(0, maxLength) + '...';
  }
}
