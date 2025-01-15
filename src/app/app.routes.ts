import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard, nonAuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/dashboard/pages/settings/settings.component';
import { AppsComponent } from './pages/dashboard/pages/apps/apps.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: AppsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [nonAuthGuard],
  },
  {
    path: 'register',
    component: AuthComponent,
    canActivate: [nonAuthGuard],
  },
];
