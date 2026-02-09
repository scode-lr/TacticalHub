import { Routes } from '@angular/router';
import { roleAccessGuard } from '@core/guards/role-access.guard';

export const guestRoutes: Routes = [
  {
    path: '',
    canActivate: [roleAccessGuard],
    loadComponent: () => import('./guest.page').then(m => m.GuestPage),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then(m => m.HomePage)
      },
      {
        path: 'news',
        loadComponent: () => import('../news/news/news.page').then(m => m.NewsPage)
      },
      {
        path: 'news/:newsId',
        loadComponent: () => import('../news/news-detail/news-detail.page').then(m => m.NewsDetailPage)
      },
      {
        path: 'information',
        loadComponent: () => import('../information/information.page').then(m => m.InformationPage)
      },
      {
        path: 'matches',
        loadComponent: () => import('../matches/matches.page').then(m => m.MatchesPage)
      },
      {
        path: 'partners',
        loadComponent: () => import('../partners/partners.page').then(m => m.PartnersPage)
      }
    ]
  }
];
