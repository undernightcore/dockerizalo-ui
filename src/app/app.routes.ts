import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { authGuard, nonAuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/dashboard/pages/settings/settings.component';
import { AppsComponent } from './pages/dashboard/pages/apps/apps.component';
import { DetailComponent } from './pages/dashboard/pages/detail/detail.component';
import { HomeComponent } from './pages/dashboard/pages/detail/pages/home/home.component';
import { BuildsComponent } from './pages/dashboard/pages/detail/pages/builds/builds.component';
import { BuildsDetailComponent } from './pages/dashboard/pages/detail/pages/builds/pages/detail/builds-detail.component';
import { VolumesComponent } from './pages/dashboard/pages/detail/pages/volumes/volumes.component';
import { unsavedHomeGuard } from './pages/dashboard/pages/detail/pages/home/guards/unsaved.guard';
import { unsavedVolumesGuard } from './pages/dashboard/pages/detail/pages/volumes/guards/unsaved.guard';
import { PortsComponent } from './pages/dashboard/pages/detail/pages/ports/ports.component';
import { unsavedPortsGuard } from './pages/dashboard/pages/detail/pages/ports/guards/unsaved.guard';

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
      {
        path: 'apps/:appId',
        component: DetailComponent,
        children: [
          {
            path: '',
            component: HomeComponent,
            canDeactivate: [unsavedHomeGuard],
          },
          {
            path: 'builds',
            component: BuildsComponent,
            children: [
              { path: '', component: BuildsDetailComponent },
              { path: ':buildId', component: BuildsDetailComponent },
            ],
          },
          {
            path: 'volumes',
            component: VolumesComponent,
            canDeactivate: [unsavedVolumesGuard],
          },
          {
            path: 'ports',
            component: PortsComponent,
            canDeactivate: [unsavedPortsGuard],
          },
        ],
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
