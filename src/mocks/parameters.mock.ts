import { InformationParameter } from '@core/models/parameters/information-param.model';
import { Parameter } from '../app/core/models/parameters/parameter.model';
import { ActionParameter } from '@core/models/parameters/action-param.model';
import { ParameterType } from '../app/core/models/parameters/parameter-type.enum';

export const mockActionCards: ActionParameter[] = [
  {
    id: 1,
    type: 'register-player',
    icon: 'person-add-outline',
    title: 'Registrar jugador',
    description: 'Registrar un nou jugador al club de futbol',
    fields: [
    {
      name: 'firstName',
      label: 'Nombre del jugador',
      type: 'text',
      required: true,
      placeholder: 'Nombre del jugador',
      minLength: 2,
      maxLength: 50
    },
    {
      name: 'lastName',
      label: 'Apellido del jugador',
      type: 'text',
      required: true,
      placeholder: 'Apellido del jugador',
      minLength: 2,
      maxLength: 50
    },
    {
      name: 'dateOfBirth',
      label: 'Fecha de nacimiento',
      type: 'date',
      required: true,
      placeholder: 'Selecciona fecha de nacimiento'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      placeholder: 'Correo electrónico',
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'tel',
      required: true,
      placeholder: 'Teléfono',
    },
    {
      name: 'previousClub',
      label: 'Club anterior',
      type: 'text',
      required: false,
      placeholder: 'Club anterior',
      maxLength: 100
    },
    {
      name: 'position',
      label: 'Posición',
      type: 'select',
      required: true,
      placeholder: 'Posición',
      options: [
        { value: 'goalkeeper', label: 'Portero' },
        { value: 'defender', label: 'Defensor' },
        { value: 'midfielder', label: 'Mediocampista' },
        { value: 'forward', label: 'Delantero' }
      ]
    },
    {
      name: 'notes',
      label: 'Notas adicionales',
      type: 'textarea',
      required: false,
      placeholder: 'Notas adicionales',
      maxLength: 500
    }
  ]
  },
  {
    id: 2,
    type: 'become-member',
    icon: 'card-outline',
    title: 'Hacerse miembro',
    description: 'Hacerse miembro del club para beneficios exclusivos',
    fields: [
    {
      name: 'firstName',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre',
      minLength: 2,
      maxLength: 50
    },
    {
      name: 'lastName',
      label: 'Apellido',
      type: 'text',
      required: true,
      placeholder: 'Apellido',
      minLength: 2,
      maxLength: 50
    },
    {
      name: 'dateOfBirth',
      label: 'Fecha de nacimiento',
      type: 'date',
      required: true,
      placeholder: 'Selecciona fecha de nacimiento'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      required: true,
      placeholder: 'Correo electrónico',
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'tel',
      required: true,
      placeholder: 'Teléfono',
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: true,
      placeholder: 'Dirección',
      maxLength: 200
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      required: true,
      placeholder: 'Ciudad',
      maxLength: 100
    },
    {
      name: 'postalCode',
      label: 'Código postal',
      type: 'text',
      required: true,
      placeholder: 'Código postal',
    },
    {
      name: 'membershipType',
      label: 'Tipo de membresía',
      type: 'select',
      required: true,
      placeholder: 'Selecciona tipo de membresía',
      options: [
        { value: 'basic', label: 'Básica' },
        { value: 'premium', label: 'Premium' },
        { value: 'family', label: 'Familiar' }
      ]
    },
    {
      name: 'comments',
      label: 'Comentarios',
      type: 'textarea',
      required: false,
      placeholder: 'user.action.form.commentsPlaceholder',
      maxLength: 500
    }
  ]
  }
];

export const mockInformationSections: InformationParameter[] = [
  {
    id: 1,
    title: 'Què fer si el meu fill té una lesió?',
    content: 'Si el teu fill té una lesió:\n\n1. Informa l\'entrenador immediatament abans del proper entrenament o partit\n2. Consulta amb un professional mèdic per avaluar la gravetat\n3. Proporciona un certificat mèdic si la lesió requereix temps de baixa\n4. No permetis que el teu fill participi en activitats fins a la seva completa recuperació\n5. Segueix el pla de recuperació recomanat pel professional mèdic\n\nPer a lesions greus, contacta amb el club immediatament al número d\'emergència.',
    icon: 'medkit-outline',
    isExpanded: false
  },
  {
    id: 2,
    title: 'Com notificar una absència?',
    content: 'Per notificar una absència:\n\n1. Informa l\'entrenador amb almenys 24 hores d\'antelació quan sigui possible\n2. Utilitza l\'aplicació de comunicació del club o envia un missatge directe\n3. Especifica el motiu de l\'absència (malaltia, esdeveniment familiar, etc.)\n4. Indica si l\'absència afecta a entrenaments, partits o tots dos\n5. Actualitza l\'entrenador si el període d\'absència canvia\n\nLa comunicació regular ajuda l\'entrenador a planificar sessions d\'entrenament i alineacions de partit de manera efectiva.',
    icon: 'calendar-outline',
    isExpanded: false
  },
  {
    id: 3,
    title: 'Equipament i uniformes requerits',
    content: 'Cada jugador ha de tenir:\n\n• Uniforme oficial del club (equipació local i visitant)\n• Roba d\'entrenament (pantalons, samarreta, jaqueta d\'entrenament)\n• Botes de futbol apropiades amb tacs\n• Espinilleres (obligatòries per a tots els entrenaments i partits)\n• Ampolla d\'aigua\n• Bossa d\'esport\n\nOpcional però recomanat:\n• Parell extra de mitjons\n• Guants de porter (per a porters)\n• Roba de compressió per a clima fred\n\nTot l\'equipament ha d\'estar marcat amb el nom del jugador.',
    icon: 'shirt-outline',
    isExpanded: false
  },
  {
    id: 4,
    title: 'Horari d\'entrenaments i assistència',
    content: 'Informació d\'entrenaments:\n\n• Sessions regulars: Dimarts i Dijous, 17:00 - 18:30\n• Es poden programar sessions de cap de setmana abans dels partits\n• Arriba 10-15 minuts abans per preparar-te\n• L\'assistència és obligatòria per a la selecció de l\'equip\n• Faltar a 3 sessions consecutives sense avís pot afectar el temps de joc\n\nCance·lacions per clima:\n• Consulta l\'aplicació del club per a actualitzacions\n• Els entrenadors notificaran abans de les 15:00 el dia de l\'entrenament\n• Es poden programar sessions de recuperació quan sigui possible',
    icon: 'football-outline',
    isExpanded: false
  },
  {
    id: 5,
    title: 'Contactes d\'emergència i comunicació',
    content: 'Contactes importants:\n\n• Oficina principal: +34 900 123 456\n• Línia d\'emergència: +34 900 123 999\n• Email: info@club.com\n• Línia directa de l\'entrenador: Disponible a l\'aplicació del club\n\nHorari d\'oficina:\n• Dilluns a Divendres: 9:00 - 20:00\n• Dissabte: 9:00 - 14:00\n• Diumenge: Tancat\n\nPer a assumptes urgents fora de l\'horari d\'oficina, utilitza la línia d\'emergència o contacta el teu entrenador directament a través de l\'aplicació.',
    icon: 'call-outline',
    isExpanded: false
  }
];

export const mockParameters = new Map<string, Parameter>([
  [
    ParameterType.ActionCards,
    {
      id: ParameterType.ActionCards,
      name: 'Action Cards',
      description: 'Available action cards for member role',
      timeCreated: new Date('2024-01-01'),
      timeModified: new Date('2024-01-01'),
      value: mockActionCards
    }
  ],
  [
    ParameterType.InformationSections,
    {
      id: ParameterType.InformationSections,
      name: 'Information Sections',
      description: 'FAQ and information sections for members',
      timeCreated: new Date('2024-01-01'),
      timeModified: new Date('2024-01-01'),
      value: mockInformationSections
    }
  ]
]);