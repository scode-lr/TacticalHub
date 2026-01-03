import { Routes } from '@angular/router';
import { roleAccessGuard } from '@core/guards/role-access.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [roleAccessGuard],
    loadComponent: () => import('./admin.page').then(m => m.AdminPage),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.ViewerHomePage)
      },
      {
        path: 'inbox',
        loadComponent: () => import('../inbox/inbox.page').then(m => m.InboxPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('../notifications/notifications.page').then(m => m.NotificationsPage)
      },
      {
        path: 'membership',
        loadComponent: () => import('../membership/membership.page').then(m => m.MembershipPage)
      },
      {
        path: 'news',
        loadComponent: () => import('../news/news/news.page').then(m => m.ViewerNewsPage)
      },
      {
        path: 'news/:newsId',
        loadComponent: () => import('../news/news-detail/news-detail.page').then(m => m.NewsDetailPage)
      },
      {
        path: 'params',
        loadComponent: () => import('../parameters/parameters.page').then(m => m.ParametersPage)
      },
      {
        path: 'teams',
        loadComponent: () => import('../placeholder/placeholder.page').then(m => m.PlaceholderPage)
      },
      {
        path: 'club',
        loadComponent: () => import('../placeholder/placeholder.page').then(m => m.PlaceholderPage)
      },
      {
        path: 'matches',
        loadComponent: () => import('../matches/matches.page').then(m => m.ViewerMatchesPage)
      },
      {
        path: 'matches/:matchId',
        loadComponent: () => import('../news/news-detail/news-detail.page').then(m => m.NewsDetailPage)
      },
      {
        path: 'users',
        loadComponent: () => import('../placeholder/placeholder.page').then(m => m.PlaceholderPage)
      }
    ]
  }
];
