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
        loadComponent: () => import('../home/home.page').then(m => m.HomePage)
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
        loadComponent: () => import('../news/news/news.page').then(m => m.NewsPage)
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
        loadComponent: () => import('../teams/teams.page').then(m => m.TeamsPage)
      },
      {
        path: 'teams/:teamId',
        loadComponent: () => import('../teams/team-detail/team-detail.page').then(m => m.TeamDetailPage)
      },
      {
        path: 'club',
        loadComponent: () => import('../placeholder/placeholder.page').then(m => m.PlaceholderPage)
      },
      {
        path: 'matches',
        loadComponent: () => import('../matches/matches.page').then(m => m.MatchesPage)
      },
      {
        path: 'matches/:matchId',
        loadComponent: () => import('../news/news-detail/news-detail.page').then(m => m.NewsDetailPage)
      },
      {
        path: 'users',
        loadComponent: () => import('../placeholder/placeholder.page').then(m => m.PlaceholderPage)
      },
      {
        path: 'forms',
        loadComponent: () => import('../forms/admin-forms-list/admin-forms-list.page').then(m => m.AdminFormsListPage)
      },
      {
        path: 'forms/:formId',
        loadComponent: () => import('../forms/admin-form-detail/admin-form-detail.page').then(m => m.AdminFormDetailPage)
      },
      {
        path: 'forms-submissions',
        loadComponent: () => import('../forms-submissions/forms-submissions.page').then(m => m.FormsSubmissionsPage)
      },
      {
        path: 'forms-submissions/:idSubmision',
        loadComponent: () => import('../forms-submissions/forms-submission-detail/forms-submission-detail.page').then(m => m.FormsSubmissionDetailPage)
      },
      {
        path: 'settings-forms',
        loadComponent: () => import('../settings-forms/settings-forms.page').then(m => m.SettingsFormsPage)
      },
      {
        path: 'settings-forms/:formId',
        loadComponent: () => import('../settings-forms/settings-form-detail/settings-form-detail.page').then(m => m.SettingsFormDetailPage)
      }
    ]
  }
];
