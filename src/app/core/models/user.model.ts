import { Role } from "./role.model";

export class User {
  id!: string;
  email!: string;
  roles!: Role[];
  firstName!: string;
  lastName!: string;
  avatarUrl?: string;
  prefixPhoneNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  createdAt!: Date;

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getInitials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  getAge(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
