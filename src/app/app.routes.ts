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
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./pages/auth/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
      }
    ]
  },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: '1/:roleId',
        data: { roleType: 1 },
        canActivate: [roleAccessGuard],
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes)
      },
      {
        path: '3/:roleId',
        data: { roleType: 3 },
        canActivate: [roleAccessGuard],
        loadChildren: () => import('./pages/member/member.routes').then(m => m.memberRoutes)
      },
      {
        path: '4/:clubId',
        data: { roleType: 4 },
        canActivate: [roleAccessGuard],
        loadChildren: () => import('./pages/guest/guest.routes').then(m => m.guestRoutes)
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
