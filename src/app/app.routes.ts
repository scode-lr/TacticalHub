import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default redirect to welcome page
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

  // Welcome page (app init page)
  {
    path: 'welcome',
    loadComponent: () => import('./pages/auth/welcome/welcome.page').then(m => m.WelcomePage),
  },

  // Authentication routes (standalone pages)
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
    path: 'teams-search',
    loadComponent: () => import('./pages/teams-search/teams-search.page').then(m => m.TeamsSearchPage),
  },
  {
    path: 'player-register',
    loadComponent: () => import('./pages/player-register/player-register.page').then(m => m.PlayerRegisterPage),
  },
  // Invitation route with UUID parameter
  {
    path: 'invitation/:uuid',
    loadComponent: () => import('./pages/invitation/invitation.page').then(m => m.InvitationPage),
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/layouts/dashboard/dashboard.page').then(m => m.DashboardPage),
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
