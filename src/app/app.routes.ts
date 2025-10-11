import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'app/teams-search',
    pathMatch: 'full',
  },

  // Authentication routes (standalone pages)
  {
    path: 'auth/signin',
    loadComponent: () => import('./pages/auth/signin/signin.page').then(m => m.SigninPage),
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./pages/auth/signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'teams-search',
    loadComponent: () => import('./pages/teams-search/teams-search.page').then(m => m.TeamsSearchPage),
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
    redirectTo: 'auth/signin',
  },
];
