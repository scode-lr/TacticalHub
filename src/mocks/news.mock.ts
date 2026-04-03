import { News, NewsCategory, NewsComment } from '../app/core/models/news.model';
import { mockAdminUser, mockCoachUser, mockPlayerUser } from './user.mock';

const mockComments: Record<number, NewsComment[]> = {
  1: [
    {
      id: 1,
      author: {
        id: mockPlayerUser.id,
        name: `${mockPlayerUser.firstName} ${mockPlayerUser.lastName}`,
        avatarUrl: mockPlayerUser.avatarUrl
      },
      body: 'Quin partit tan increïble! L\'equip va jugar brillantment!',
      createdAt: new Date('2024-11-20T19:00:00'),
      upvotes: 12,
      downvotes: 0,
      replies: [
        {
          id: 10001,
          author: {
            id: mockCoachUser.id,
            name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
            avatarUrl: mockCoachUser.avatarUrl
          },
          body: 'Gràcies! Els jugadors van treballar molt dur per aquesta victòria.',
          createdAt: new Date('2024-11-20T19:30:00'),
          upvotes: 8,
          downvotes: 0
        }
      ]
    },
    {
      id: 2,
      author: {
        id: mockAdminUser.id,
        name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
        avatarUrl: mockAdminUser.avatarUrl
      },
      body: 'Orgullós del nostre equip! Continueu amb el gran treball!',
      createdAt: new Date('2024-11-20T20:15:00'),
      upvotes: 15,
      downvotes: 1
    }
  ],
  3: [
    {
      id: 3,
      author: {
        id: mockPlayerUser.id,
        name: `${mockPlayerUser.firstName} ${mockPlayerUser.lastName}`,
        avatarUrl: mockPlayerUser.avatarUrl
      },
      body: 'Aquesta és una notícia increïble! Ho hem aconseguit!',
      createdAt: new Date('2024-11-15T13:00:00'),
      upvotes: 25,
      downvotes: 0
    }
  ]
};

export const mockNews: News[] = [
  {
    id: 1,
    title: 'Gran victòria en el derbi',
    body: 'El nostre equip va aconseguir una impressionant victòria per 3-1 en el derbi d\'ahir. Els jugadors van mostrar un excel·lent treball en equip i determinació durant tot el partit. Els gols van ser marcats per Martínez al minut 23, Rodríguez al 56, i López va segellar la victòria al minut 89. El rendiment defensiu de l\'equip també va ser destacat, limitant els oponents a només un gol.',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
    author: {
      id: mockCoachUser.id,
      name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
      avatarUrl: mockCoachUser.avatarUrl
    },
    category: NewsCategory.Match,
    publishedAt: new Date('2024-11-20T18:30:00'),
    createdAt: new Date('2024-11-20T18:30:00'),
    upvotes: 156,
    downvotes: 3,
    userVote: null,
    comments: mockComments[1] || [],
    commentCount: 3
  },
  {
    id: 2,
    title: 'Nou horari d\'entrenament per a la setmana vinent',
    body: 'Si us plau, tingueu en compte l\'horari d\'entrenament actualitzat per a la setmana vinent. Les sessions de dilluns i dimecres començaran a les 17:00 en lloc de les 18:00. L\'entrenament de dijous es trasllada a divendres a les 16:30 degut al manteniment de les instal·lacions. Assegureu-vos d\'arribar 15 minuts abans per al calfament adequat. No oblideu portar el vostre equipament d\'entrenament i ampolles d\'aigua.',
    imageUrl: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&h=400&fit=crop',
    author: {
      id: mockAdminUser.id,
      name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
      avatarUrl: mockAdminUser.avatarUrl
    },
    category: NewsCategory.Training,
    publishedAt: new Date('2024-11-18T09:00:00'),
    createdAt: new Date('2024-11-18T09:00:00'),
    upvotes: 89,
    downvotes: 12,
    userVote: null,
    comments: [],
    commentCount: 0
  },
  {
    id: 3,
    title: 'L\'equip aconsegueix la classificació pel campionat regional',
    body: 'Felicitats al nostre equip per assegurar un lloc al campionat regional! Després d\'una temporada de treball dur i dedicació, ens hem guanyat el nostre lloc entre els 8 millors equips de la regió. El campionat tindrà lloc al desembre. Això és un testimoni de l\'esforç i el compromís mostrat per cada jugador, entrenador i seguidor.',
    imageUrl: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&h=400&fit=crop',
    author: {
      id: mockAdminUser.id,
      name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
      avatarUrl: mockAdminUser.avatarUrl
    },
    category: NewsCategory.Achievement,
    publishedAt: new Date('2024-11-15T12:00:00'),
    createdAt: new Date('2024-11-15T12:00:00'),
    upvotes: 234,
    downvotes: 2,
    userVote: 'up',
    comments: mockComments[3] || [],
    commentCount: 1
  },
  {
    id: 4,
    title: 'Reunió anual del club - 5 de desembre',
    body: 'La reunió anual del club se celebrarà el 5 de desembre a les 19:00 a la sala principal. Tots els membres estan convidats a assistir. Discutirem els resultats de la temporada, actualitzacions del pressupost i plans per al proper any. També hi haurà una sessió de preguntes i respostes. Es proporcionarà un refrigeri lleuger. Confirmeu l\'assistència abans del 30 de novembre.',
    author: {
      id: mockAdminUser.id,
      name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
      avatarUrl: mockAdminUser.avatarUrl
    },
    category: NewsCategory.Event,
    publishedAt: new Date('2024-11-12T10:30:00'),
    createdAt: new Date('2024-11-12T10:30:00'),
    upvotes: 45,
    downvotes: 5,
    userVote: null,
    comments: [],
    commentCount: 0
  },
  {
    id: 5,
    title: 'Benvinguts als nostres nous membres de l\'equip',
    body: 'Estem emocionats de donar la benvinguda a tres nous jugadors a la nostra plantilla! Si us plau, doneu una càlida benvinguda a Alex Thompson, Sofia Martínez i David Chen. Aporten valuosa experiència i talent a l\'equip. Esperem veure\'ls al camp i els desitgem èxit en el seu viatge amb nosaltres.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop',
    author: {
      id: mockCoachUser.id,
      name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
      avatarUrl: mockCoachUser.avatarUrl
    },
    category: NewsCategory.General,
    publishedAt: new Date('2024-11-10T14:15:00'),
    createdAt: new Date('2024-11-10T14:15:00'),
    upvotes: 67,
    downvotes: 1,
    userVote: null,
    comments: [],
    commentCount: 0
  },
  {
    id: 6,
    title: 'Important: Protocols COVID-19 actualitzats',
    body: 'D\'acord amb les últimes directrius sanitàries, hem actualitzat els nostres protocols de seguretat COVID-19. Tots els jugadors i personal han de completar un control de salut abans d\'entrar a les instal·lacions. Les mascaretes són obligatòries a les zones comunes. Si experimenteu qualsevol símptoma, si us plau, quedeu-vos a casa i notifiqueu l\'entrenador immediatament. Mantinguem tothom segur.',
    author: {
      id: mockAdminUser.id,
      name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
      avatarUrl: mockAdminUser.avatarUrl
    },
    category: NewsCategory.Announcement,
    publishedAt: new Date('2024-11-08T08:00:00'),
    createdAt: new Date('2024-11-08T08:00:00'),
    upvotes: 34,
    downvotes: 8,
    userVote: null,
    comments: [],
    commentCount: 0
  },
  {
    id: 7,
    title: 'Jugador del mes: Carlos Rodríguez',
    body: 'Felicitats a Carlos Rodríguez per ser nomenat Jugador del Mes d\'octubre! Carlos ha mostrat un rendiment excepcional, marcant 6 gols i proporcionant 4 assistències. El seu lideratge dins i fora del camp ha estat inspirador. Carlos rebrà un trofeu i un val regal. Ben fet, Carlos!',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=400&fit=crop',
    author: {
      id: mockCoachUser.id,
      name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
      avatarUrl: mockCoachUser.avatarUrl
    },
    category: NewsCategory.Achievement,
    publishedAt: new Date('2024-11-01T16:00:00'),
    createdAt: new Date('2024-11-01T16:00:00'),
    upvotes: 178,
    downvotes: 4,
    userVote: null,
    comments: [],
    commentCount: 0
  },
  {
    id: 8,
    title: 'Detalls del viatge pel proper partit fora de casa',
    body: 'Pel partit fora de casa del 25 de novembre, l\'autobús de l\'equip sortirà del club a les 13:00 en punt. Si us plau, arribeu a les 12:45 amb tot el vostre equipament. Tornarem aproximadament a les 21:00. Porteu dinar i aperitius per al viatge. No oblideu el vostre DNI i qualsevol documentació requerida. Viatgeu amb seguretat!',
    author: {
      id: mockCoachUser.id,
      name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
      avatarUrl: mockCoachUser.avatarUrl
    },
    category: NewsCategory.Match,
    publishedAt: new Date('2024-11-22T11:00:00'),
    createdAt: new Date('2024-11-22T11:00:00'),
    upvotes: 92,
    downvotes: 2,
    userVote: null,
    comments: [],
    commentCount: 0
  }
];

export const mockNewsByCategory = (category: NewsCategory): News[] => {
  return mockNews.filter(news => news.category === category);
};

export const mockRecentNews = (limit: number = 5): News[] => {
  return mockNews.slice(0, limit);
};
