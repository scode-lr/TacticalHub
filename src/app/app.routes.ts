import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/welcome',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'welcome',
        loadComponent: () => import('./pages/auth/welcome/welcome.page').then(m => m.WelcomePage),
      },
      {
        path: 'signin',
        loadComponent: () => import('./pages/auth/signin/signin.page').then(m => m.SigninPage),
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/auth/signup/signup.page').then(m => m.SignupPage),
      },
      {
        path: 'loading',
        loadComponent: () => import('./pages/auth/loading/loading.page').then(m => m.LoadingPage),
      }
    ]
  },
  {
    path: 'app',
    redirectTo: 'layouts/my-teams',
    pathMatch: 'full',
  },
  {
    path: 'layouts',
    loadComponent: () => import('./pages/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'my-teams',
        pathMatch: 'full',
      },
      {
        path: 'my-teams',
        loadComponent: () => import('./pages/layouts/my-teams/my-teams.page').then(m => m.MyTeamsPage),
      }
    ],
  },

  {
    path: 'teams',
    canActivate: [authGuard],
    children: [
      {
        path: 'selection',
        loadComponent: () => import('./pages/teams/selection/selection.page').then(m => m.RoleSelectionPage),
      },
      {
        path: 'join',
        loadComponent: () => import('./pages/teams/join/join-team.page').then(m => m.JoinTeamPage),
      },
      {
        path: 'invitation/:uuid',
        loadComponent: () => import('./pages/teams/invitation/invitation.page').then(m => m.InvitationPage),
      }
    ]
  },

  {
    path: 'teams-search',
    loadComponent: () => import('./pages/teams-search/teams-search.page').then(m => m.TeamsSearchPage),
    canActivate: [authGuard]
  },
  {
    path: 'player-register',
    loadComponent: () => import('./pages/player-register/player-register.page').then(m => m.PlayerRegisterPage),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'auth/welcome',
  },
];
