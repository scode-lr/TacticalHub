import { News, NewsCategory, NewsComment } from '../app/core/models/news.model';
import { mockAdminUser, mockCoachUser, mockPlayerUser } from './user.mock';

const mockComments: Record<string, NewsComment[]> = {
  'news-001': [
    {
      id: 'comment-001',
      author: {
        id: mockPlayerUser.id,
        name: `${mockPlayerUser.firstName} ${mockPlayerUser.lastName}`,
        avatarUrl: mockPlayerUser.avatarUrl
      },
      body: 'What an amazing match! The team played brilliantly!',
      createdAt: new Date('2024-11-20T19:00:00'),
      upvotes: 12,
      downvotes: 0,
      replies: [
        {
          id: 'comment-001-1',
          author: {
            id: mockCoachUser.id,
            name: `${mockCoachUser.firstName} ${mockCoachUser.lastName}`,
            avatarUrl: mockCoachUser.avatarUrl
          },
          body: 'Thank you! The players worked very hard for this victory.',
          createdAt: new Date('2024-11-20T19:30:00'),
          upvotes: 8,
          downvotes: 0
        }
      ]
    },
    {
      id: 'comment-002',
      author: {
        id: mockAdminUser.id,
        name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
        avatarUrl: mockAdminUser.avatarUrl
      },
      body: 'Proud of our team! Keep up the great work!',
      createdAt: new Date('2024-11-20T20:15:00'),
      upvotes: 15,
      downvotes: 1
    }
  ],
  'news-003': [
    {
      id: 'comment-003',
      author: {
        id: mockPlayerUser.id,
        name: `${mockPlayerUser.firstName} ${mockPlayerUser.lastName}`,
        avatarUrl: mockPlayerUser.avatarUrl
      },
      body: 'This is incredible news! We did it!',
      createdAt: new Date('2024-11-15T13:00:00'),
      upvotes: 25,
      downvotes: 0
    }
  ]
};

export const mockNews: News[] = [
  {
    id: 'news-001',
    title: 'Great victory in the derby',
    body: 'Our team achieved an impressive 3-1 victory in yesterday\'s derby match. The players showed excellent teamwork and determination throughout the game. Goals were scored by Martinez in the 23rd minute, Rodriguez in the 56th, and Lopez sealed the victory in the 89th minute. The team\'s defensive performance was also outstanding, limiting the opponents to just one goal.',
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
    comments: mockComments['news-001'] || [],
    commentCount: 3
  },
  {
    id: 'news-002',
    title: 'New training schedule for next week',
    body: 'Please note the updated training schedule for next week. Monday and Wednesday sessions will start at 17:00 instead of 18:00. Thursday training is moved to Friday at 16:30 due to facility maintenance. Make sure to arrive 15 minutes early for proper warm-up. Don\'t forget to bring your training gear and water bottles.',
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
    id: 'news-003',
    title: 'Team achieves regional championship qualification',
    body: 'Congratulations to our team for securing a spot in the regional championship! After a season of hard work and dedication, we\'ve earned our place among the top 8 teams in the region. The championship will take place in December. This is a testament to the effort and commitment shown by every player, coach, and supporter.',
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
    comments: mockComments['news-003'] || [],
    commentCount: 1
  },
  {
    id: 'news-004',
    title: 'Annual club meeting - December 5th',
    body: 'The annual club meeting will be held on December 5th at 19:00 in the main hall. All members are invited to attend. We will discuss the season\'s results, budget updates, and plans for next year. There will also be a Q&A session. Light refreshments will be provided. RSVP by November 30th.',
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
    id: 'news-005',
    title: 'Welcome to our new team members',
    body: 'We are excited to welcome three new players to our squad! Please give a warm welcome to Alex Thompson, Sofia Martinez, and David Chen. They bring valuable experience and talent to the team. We look forward to seeing them on the field and wish them success in their journey with us.',
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
    id: 'news-006',
    title: 'Important: Updated COVID-19 protocols',
    body: 'In accordance with the latest health guidelines, we have updated our COVID-19 safety protocols. All players and staff must complete a health screening before entering the facility. Masks are required in common areas. If you experience any symptoms, please stay home and notify the coach immediately. Let\'s keep everyone safe.',
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
    id: 'news-007',
    title: 'Player of the month: Carlos Rodriguez',
    body: 'Congratulations to Carlos Rodriguez for being named Player of the Month for October! Carlos has shown exceptional performance, scoring 6 goals and providing 4 assists. His leadership on and off the field has been inspirational. Carlos will receive a trophy and a gift voucher. Well done, Carlos!',
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
    id: 'news-008',
    title: 'Upcoming away match travel details',
    body: 'For the away match on November 25th, the team bus will depart from the club at 13:00 sharp. Please arrive by 12:45 with all your gear. We will return approximately at 21:00. Pack lunch and snacks for the journey. Don\'t forget your ID and any required documentation. Travel safely!',
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
