import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/signin',
    pathMatch: 'full',
  },
  {
    path: 'auth/signin',
    loadComponent: () => import('./auth/signin/signin.page').then((m) => m.SigninPage),
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./auth/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'teams-search',
    loadComponent: () => import('./teams-search/teams-search.page').then((m) => m.TeamsSearchPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '**',
    redirectTo: 'auth/signin',
  },
];
