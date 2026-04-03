import { Component, Input, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '@models/match.model';
import { NavigationService } from '@services/navigation.service';

@Component({
    selector: 'app-match-card',
    templateUrl: './match-card.component.html',
    styleUrls: ['./match-card.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class MatchCardComponent {
    @Input({ required: true }) match!: Match;

    private navigationService = inject(NavigationService);

    get hasStarted(): boolean {
        return this.match.resultLocal > 0 || this.match.resultAway > 0;
    }

    get displayLocalScore(): string {
        return this.hasStarted ? this.match.resultLocal.toString() : '-';
    }

    get displayAwayScore(): string {
        return this.hasStarted ? this.match.resultAway.toString() : '-';
    }

    goToDetail(): void {
        const { roleType, roleId } = this.navigationService.extractRoleDetails();
        this.navigationService.navigateTo([`/app/${roleType}/${roleId}`, 'matches', this.match.id.toString()]);
    }
}
