import { Routes } from '@angular/router';
import { roleAccessGuard } from '@core/guards/role-access.guard';

export const viewerRoutes: Routes = [
  {
    path: '',
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
        path: 'forms',
        loadComponent: () => import('../forms/forms.page').then(m => m.FormsPage)
      },
      {
        path: 'forms/:formId',
        loadComponent: () => import('../form-detail/form-detail.page').then(m => m.FormDetailPage)
      },
      {
        path: 'information',
        loadComponent: () => import('../information/information.page').then(m => m.InformationPage)
      },
      {
        path: 'proposals',
        loadComponent: () => import('../proposals/proposals.page').then(m => m.ViewerProposalsPage)
      },
      {
        path: 'matches',
        loadComponent: () => import('../matches/matches.page').then(m => m.MatchesPage)
      },
      {
        path: 'matches/:matchId',
        loadComponent: () => import('../match-detail/match-detail.page').then(m => m.MatchDetailPage)
      },
      {
        path: 'teams',
        loadComponent: () => import('../teams/teams.page').then(m => m.TeamsPage)
      },
      {
        path: 'partners',
        loadComponent: () => import('../partners/partners.page').then(m => m.PartnersPage)
      },
      {
        path: 'forms',
        loadComponent: () => import('../forms/forms-list/forms-list.page').then(m => m.FormsListPage)
      },
      {
        path: 'forms/:formId',
        loadComponent: () => import('../forms/form-submit/form-submit.page').then(m => m.FormSubmitPage)
      }
    ]
  }
];
