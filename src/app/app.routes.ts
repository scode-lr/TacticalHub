import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

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
    path: 'auth/signin',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'auth/signup',
    redirectTo: 'signup',
    pathMatch: 'full',
  },
  {
    path: 'auth/loading',
    loadComponent: () => import('./pages/auth/loading/loading.page').then(m => m.LoadingPage),
  },
  {
    path: 'auth/role-selection',
    loadComponent: () => import('./pages/auth/role-selection/role-selection.page').then(m => m.RoleSelectionPage),
  },
  {
    path: 'teams-search',
    loadComponent: () => import('./pages/teams-search/teams-search.page').then(m => m.TeamsSearchPage),
  },
  {
    path: 'player-register',
    loadComponent: () => import('./pages/player-register/player-register.page').then(m => m.PlayerRegisterPage),
  },
  {
    path: 'invitation/:uuid',
    loadComponent: () => import('./pages/invitation/invitation.page').then(m => m.InvitationPage),
  },
  {
    path: 'app',
    redirectTo: 'layouts/my-teams',
    pathMatch: 'full',
  },
  {
    path: 'layouts',
    loadComponent: () => import('./pages/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
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
    path: '**',
    redirectTo: 'welcome',
  },
];
