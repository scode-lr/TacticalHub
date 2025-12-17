import { Component, signal, computed } from '@angular/core';
import { Match } from '@models/match.model';
import { mockMatches } from '@mocks/match.mock';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';
import { MatchCardComponent } from '@components/match-card/match-card.component';

@Component({
  selector: 'app-viewer-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe, MatchCardComponent]
})
export class ViewerMatchesPage {
  readonly currentWeekStart = signal<Date>(this.getStartOfWeek(new Date()));
  readonly matches = signal<Match[]>(mockMatches);

  readonly currentWeekMatches = computed(() => {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return this.matches().filter(match => {
      const matchDate = new Date(match.date);
      return matchDate >= start && matchDate < end;
    });
  });

  readonly saturdayMatches = computed(() => {
    return this.currentWeekMatches()
      .filter(match => new Date(match.date).getDay() === 6)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  readonly sundayMatches = computed(() => {
    return this.currentWeekMatches()
      .filter(match => new Date(match.date).getDay() === 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  readonly weekLabel = computed(() => {
    const start = this.currentWeekStart();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Format: "DD MMM - DD MMM"
    const startStr = start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

    return `${startStr} - ${endStr}`;
  });

  nextWeek() {
    const next = new Date(this.currentWeekStart());
    next.setDate(next.getDate() + 7);
    this.currentWeekStart.set(next);
  }

  prevWeek() {
    const prev = new Date(this.currentWeekStart());
    prev.setDate(prev.getDate() - 7);
    this.currentWeekStart.set(prev);
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
