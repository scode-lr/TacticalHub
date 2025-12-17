import { Routes } from '@angular/router';
import { roleAccessGuard } from '@core/guards/role-access.guard';

export const viewerRoutes: Routes = [
  {
    path: '',
    data: { roleId: 2 },
    canActivate: [roleAccessGuard],
    loadComponent: () => import('./viewer.page').then(m => m.ViewerPage),
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
        path: 'news',
        loadComponent: () => import('../news/news/news.page').then(m => m.ViewerNewsPage)
      },
      {
        path: 'news/:newsId',
        loadComponent: () => import('../news/news-detail/news-detail.page').then(m => m.NewsDetailPage)
      },
      {
        path: 'action',
        loadComponent: () => import('../action/action.page').then(m => m.ViewerActionPage)
      },
      {
        path: 'action/:type',
        loadComponent: () => import('../action-form/action-form.page').then(m => m.ActionFormPage)
      },
      {
        path: 'information',
        loadComponent: () => import('../information/information.page').then(m => m.ViewerInformationPage)
      },
      {
        path: 'proposals',
        loadComponent: () => import('../proposals/proposals.page').then(m => m.ViewerProposalsPage)
      },
      {
        path: 'matches',
        loadComponent: () => import('../matches/matches.page').then(m => m.ViewerMatchesPage)
      },
      {
        path: 'partners',
        loadComponent: () => import('../partners/partners.page').then(m => m.ViewerPartnersPage)
      }
    ]
  }
];
