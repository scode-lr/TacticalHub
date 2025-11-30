import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '@models/match.model';

@Component({
    selector: 'app-match-card',
    templateUrl: './match-card.component.html',
    styleUrls: ['./match-card.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class MatchCardComponent {
    @Input({ required: true }) match!: Match;
}
