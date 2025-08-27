export interface DiveLog {
  id: string;
  date: string;
  location: string;
  depth: number; // in meters
  duration: number; // in minutes
  airTemperature: number; // in Celsius
  waterTemperature: number; // in Celsius
  visibility: number; // in meters
  notes: string;
  equipment: Equipment[];
  photos?: string[];
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  serialNumber?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
}

export enum EquipmentType {
  TANK = 'tank',
  REGULATOR = 'regulator',
  BCD = 'bcd',
  WETSUIT = 'wetsuit',
  MASK = 'mask',
  FINS = 'fins',
  COMPUTER = 'computer',
  OTHER = 'other'
}

export interface DiveSite {
  id: string;
  name: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  maxDepth: number;
  description: string;
  difficulty: DifficultyLevel;
  features: string[];
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface DivePlan {
  id: string;
  date: string;
  site: DiveSite;
  plannedDepth: number;
  plannedDuration: number;
  divers: string[];
  equipment: Equipment[];
  emergencyContacts: string[];
  weatherConditions?: string;
  tideInfo?: string;
}