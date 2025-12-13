import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleAccessGuard } from '@core/guards/role-access.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/welcome',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [authGuard],
    data: { requiresAuth: false },
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
    canActivate: [authGuard],
    children: [
      {
        path: '2/:roleId',
        data: { roleType: 2 },
        canActivate: [roleAccessGuard],
        loadChildren: () => import('./pages/viewer/viewer.routes').then(m => m.viewerRoutes)
      }
    ]
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
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'auth/welcome',
  },
];
