import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@pipes/translate.pipe';

interface InformationSection {
  id: string;
  title: string;
  content: string;
  icon: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-viewer-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, TranslatePipe]
})
export class ViewerInformationPage {
  readonly sections = signal<InformationSection[]>([
    {
      id: 'injury',
      title: 'Què fer si el meu fill té una lesió?',
      content: 'Si el teu fill té una lesió:\n\n1. Informa l\'entrenador immediatament abans del proper entrenament o partit\n2. Consulta amb un professional mèdic per avaluar la gravetat\n3. Proporciona un certificat mèdic si la lesió requereix temps de baixa\n4. No permetis que el teu fill participi en activitats fins a la seva completa recuperació\n5. Segueix el pla de recuperació recomanat pel professional mèdic\n\nPer a lesions greus, contacta amb el club immediatament al número d\'emergència.',
      icon: 'medkit-outline',
      isExpanded: false
    },
    {
      id: 'absence',
      title: 'Com notificar una absència?',
      content: 'Per notificar una absència:\n\n1. Informa l\'entrenador amb almenys 24 hores d\'antelació quan sigui possible\n2. Utilitza l\'aplicació de comunicació del club o envia un missatge directe\n3. Especifica el motiu de l\'absència (malaltia, esdeveniment familiar, etc.)\n4. Indica si l\'absència afecta a entrenaments, partits o tots dos\n5. Actualitza l\'entrenador si el període d\'absència canvia\n\nLa comunicació regular ajuda l\'entrenador a planificar sessions d\'entrenament i alineacions de partit de manera efectiva.',
      icon: 'calendar-outline',
      isExpanded: false
    },
    {
      id: 'equipment',
      title: 'Equipament i uniformes requerits',
      content: 'Cada jugador ha de tenir:\n\n• Uniforme oficial del club (equipació local i visitant)\n• Roba d\'entrenament (pantalons, samarreta, jaqueta d\'entrenament)\n• Botes de futbol apropiades amb tacs\n• Espinilleres (obligatòries per a tots els entrenaments i partits)\n• Ampolla d\'aigua\n• Bossa d\'esport\n\nOpcional però recomanat:\n• Parell extra de mitjons\n• Guants de porter (per a porters)\n• Roba de compressió per a clima fred\n\nTot l\'equipament ha d\'estar marcat amb el nom del jugador.',
      icon: 'shirt-outline',
      isExpanded: false
    },
    {
      id: 'training',
      title: 'Horari d\'entrenaments i assistència',
      content: 'Informació d\'entrenaments:\n\n• Sessions regulars: Dimarts i Dijous, 17:00 - 18:30\n• Es poden programar sessions de cap de setmana abans dels partits\n• Arriba 10-15 minuts abans per preparar-te\n• L\'assistència és obligatòria per a la selecció de l\'equip\n• Faltar a 3 sessions consecutives sense avís pot afectar el temps de joc\n\nCance·lacions per clima:\n• Consulta l\'aplicació del club per a actualitzacions\n• Els entrenadors notificaran abans de les 15:00 el dia de l\'entrenament\n• Es poden programar sessions de recuperació quan sigui possible',
      icon: 'football-outline',
      isExpanded: false
    },
    {
      id: 'contact',
      title: 'Contactes d\'emergència i comunicació',
      content: 'Contactes importants:\n\n• Oficina principal: +34 900 123 456\n• Línia d\'emergència: +34 900 123 999\n• Email: info@club.com\n• Línia directa de l\'entrenador: Disponible a l\'aplicació del club\n\nHorari d\'oficina:\n• Dilluns a Divendres: 9:00 - 20:00\n• Dissabte: 9:00 - 14:00\n• Diumenge: Tancat\n\nPer a assumptes urgents fora de l\'horari d\'oficina, utilitza la línia d\'emergència o contacta el teu entrenador directament a través de l\'aplicació.',
      icon: 'call-outline',
      isExpanded: false
    }
  ]);

  readonly isEmpty = computed(() => this.sections()?.length === 0);

  toggleSection(sectionId: string): void {
    this.sections.update(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  }
}
