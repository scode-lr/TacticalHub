import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full',
  },
  {
    path: 'auth/signin',
    loadComponent: () => import('./pages/auth/signin/signin.page').then((m) => m.SigninPage),
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./pages/auth/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'teams-search',
    loadComponent: () => import('./pages/teams-search/teams-search.page').then((m) => m.TeamsSearchPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'my-teams',
    loadComponent: () => import('./pages/my-teams/my-teams.page').then((m) => m.MyTeamsPage),
  },
  {
    path: '**',
    redirectTo: 'auth/signin',
  },
];
