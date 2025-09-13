import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Team {
  id: string;
  name: string;
  location: string;
  membersCount: number;
  level: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  joinRequests?: number;
  createdAt: Date;
  tags?: string[];
}

export interface TeamSearchFilters {
  searchTerm?: string;
  level?: string;
  location?: string;
  isPublic?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public teams$ = this.teamsSubject.asObservable();

  private mockTeams: Team[] = [
    {
      id: '1',
      name: 'Barcelona FC Academy',
      location: 'Barcelona, Spain',
      membersCount: 25,
      level: 'Professional',
      description: 'Elite football training academy focusing on technical skills and tactical awareness. We train 5 days a week with professional coaches.',
      imageUrl: 'https://via.placeholder.com/60x60?text=BAR',
      isPublic: true,
      joinRequests: 5,
      createdAt: new Date('2023-01-15'),
      tags: ['Elite', 'Professional', 'Technical']
    },
    {
      id: '2',
      name: 'Manchester United Youth',
      location: 'Manchester, UK',
      membersCount: 18,
      level: 'Semi-Professional',
      description: 'Youth development program for aspiring football players aged 16-21. Focus on physical and mental development.',
      imageUrl: 'https://via.placeholder.com/60x60?text=MAN',
      isPublic: true,
      joinRequests: 12,
      createdAt: new Date('2023-02-20'),
      tags: ['Youth', 'Development', 'Physical Training']
    },
    {
      id: '3',
      name: 'Local Lions FC',
      location: 'Madrid, Spain',
      membersCount: 32,
      level: 'Amateur',
      description: 'Community football club welcoming players of all skill levels. Weekly training sessions and friendly matches.',
      imageUrl: 'https://via.placeholder.com/60x60?text=LIO',
      isPublic: true,
      joinRequests: 3,
      createdAt: new Date('2023-03-10'),
      tags: ['Community', 'Friendly', 'All Levels']
    },
    {
      id: '4',
      name: 'Bayern Munich Reserves',
      location: 'Munich, Germany',
      membersCount: 22,
      level: 'Professional',
      description: 'Reserve team for Bayern Munich with focus on advanced tactics and high-intensity training.',
      imageUrl: 'https://via.placeholder.com/60x60?text=BAY',
      isPublic: false,
      joinRequests: 8,
      createdAt: new Date('2023-01-05'),
      tags: ['Reserve', 'Tactical', 'High Intensity']
    },
    {
      id: '5',
      name: 'Paris Saint-Germain Youth',
      location: 'Paris, France',
      membersCount: 28,
      level: 'Semi-Professional',
      description: 'Youth academy known for developing world-class talent. State-of-the-art facilities and expert coaching staff.',
      imageUrl: 'https://via.placeholder.com/60x60?text=PSG',
      isPublic: true,
      joinRequests: 15,
      createdAt: new Date('2023-02-01'),
      tags: ['Academy', 'World Class', 'Modern Facilities']
    },
    {
      id: '6',
      name: 'Chelsea FC Academy',
      location: 'London, UK',
      membersCount: 20,
      level: 'Professional',
      description: 'Premier League academy with emphasis on physical and mental development. Comprehensive training program.',
      imageUrl: 'https://via.placeholder.com/60x60?text=CHE',
      isPublic: false,
      joinRequests: 7,
      createdAt: new Date('2023-01-20'),
      tags: ['Premier League', 'Comprehensive', 'Elite']
    },
    {
      id: '7',
      name: 'Real Madrid Juvenil',
      location: 'Madrid, Spain',
      membersCount: 26,
      level: 'Professional',
      description: 'La Liga youth team focusing on technical excellence and competitive play at the highest level.',
      imageUrl: 'https://via.placeholder.com/60x60?text=RM',
      isPublic: false,
      joinRequests: 20,
      createdAt: new Date('2023-01-10'),
      tags: ['La Liga', 'Technical', 'Competitive']
    },
    {
      id: '8',
      name: 'Arsenal Development Squad',
      location: 'London, UK',
      membersCount: 19,
      level: 'Semi-Professional',
      description: 'Development squad for promising young players. Focus on improving individual skills and team tactics.',
      imageUrl: 'https://via.placeholder.com/60x60?text=ARS',
      isPublic: true,
      joinRequests: 9,
      createdAt: new Date('2023-02-15'),
      tags: ['Development', 'Individual Skills', 'Team Tactics']
    }
  ];

  constructor() {
    this.teamsSubject.next(this.mockTeams);
  }

  async getAllTeams(): Promise<Team[]> {
    // Simulate API call
    await this.delay(1000);
    return [...this.mockTeams];
  }

  async searchTeams(filters: TeamSearchFilters): Promise<Team[]> {
    // Simulate API call
    await this.delay(800);
    
    let filteredTeams = [...this.mockTeams];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredTeams = filteredTeams.filter(team => 
        team.name.toLowerCase().includes(searchLower) ||
        team.location.toLowerCase().includes(searchLower) ||
        team.level.toLowerCase().includes(searchLower) ||
        team.description.toLowerCase().includes(searchLower) ||
        (team.tags && team.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (filters.level) {
      filteredTeams = filteredTeams.filter(team => 
        team.level.toLowerCase() === filters.level!.toLowerCase()
      );
    }

    if (filters.location) {
      filteredTeams = filteredTeams.filter(team => 
        team.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.isPublic !== undefined) {
      filteredTeams = filteredTeams.filter(team => team.isPublic === filters.isPublic);
    }

    return filteredTeams;
  }

  async getTeamById(id: string): Promise<Team | null> {
    // Simulate API call
    await this.delay(500);
    
    const team = this.mockTeams.find(t => t.id === id);
    return team || null;
  }

  async joinTeam(teamId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call
      await this.delay(1200);
      
      const team = this.mockTeams.find(t => t.id === teamId);
      if (!team) {
        return { success: false, message: 'Team not found' };
      }

      // Simulate joining logic
      if (team.isPublic) {
        return { 
          success: true, 
          message: `Successfully joined ${team.name}!` 
        };
      } else {
        return { 
          success: true, 
          message: `Join request sent to ${team.name}. You'll be notified when approved.` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to join team. Please try again.' 
      };
    }
  }

  async createTeam(teamData: Partial<Team>): Promise<{ success: boolean; message: string; teamId?: string }> {
    try {
      // Simulate API call
      await this.delay(1500);
      
      const newTeam: Team = {
        id: this.generateTeamId(),
        name: teamData.name || 'New Team',
        location: teamData.location || 'Unknown Location',
        membersCount: 1, // Creator is the first member
        level: teamData.level || 'Amateur',
        description: teamData.description || 'No description provided',
        imageUrl: teamData.imageUrl || 'https://via.placeholder.com/60x60?text=NT',
        isPublic: teamData.isPublic ?? true,
        joinRequests: 0,
        createdAt: new Date(),
        tags: teamData.tags || []
      };

      // Add to mock data
      this.mockTeams.push(newTeam);
      this.teamsSubject.next([...this.mockTeams]);

      return { 
        success: true, 
        message: `Team "${newTeam.name}" created successfully!`,
        teamId: newTeam.id
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to create team. Please try again.' 
      };
    }
  }

  getLevelColor(level: string): string {
    switch (level.toLowerCase()) {
      case 'professional':
        return 'danger';
      case 'semi-professional':
        return 'warning';
      case 'amateur':
        return 'success';
      default:
        return 'medium';
    }
  }

  getAvailableLevels(): string[] {
    return ['Amateur', 'Semi-Professional', 'Professional'];
  }

  getAvailableLocations(): string[] {
    const locations = [...new Set(this.mockTeams.map(team => team.location))];
    return locations.sort();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateTeamId(): string {
    return 'team_' + Math.random().toString(36).substr(2, 9);
  }
}