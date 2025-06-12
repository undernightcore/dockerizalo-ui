import { Routes } from '@angular/router';
import { authGuard, nonAuthGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AppsComponent } from './pages/dashboard/pages/apps/apps.component';
import { DetailComponent } from './pages/dashboard/pages/detail/detail.component';
import { BuildsComponent } from './pages/dashboard/pages/detail/pages/builds/builds.component';
import { BuildsDetailComponent } from './pages/dashboard/pages/detail/pages/builds/pages/detail/builds-detail.component';
import { unsavedHomeGuard } from './pages/dashboard/pages/detail/pages/home/guards/unsaved.guard';
import { HomeComponent } from './pages/dashboard/pages/detail/pages/home/home.component';
import { unsavedLabelsGuard } from './pages/dashboard/pages/detail/pages/labels/guards/unsaved.guard';
import { LabelsComponent } from './pages/dashboard/pages/detail/pages/labels/labels.component';
import { unsavedNetworksGuard } from './pages/dashboard/pages/detail/pages/networks/guards/unsaved.guard';
import { NetworksComponent } from './pages/dashboard/pages/detail/pages/networks/networks.component';
import { unsavedPortsGuard } from './pages/dashboard/pages/detail/pages/ports/guards/unsaved.guard';
import { PortsComponent } from './pages/dashboard/pages/detail/pages/ports/ports.component';
import { TriggersComponent } from './pages/dashboard/pages/detail/pages/triggers/triggers.component';
import { unsavedVariablesGuard } from './pages/dashboard/pages/detail/pages/variables/guards/unsaved.guard';
import { VariablesComponent } from './pages/dashboard/pages/detail/pages/variables/variables.component';
import { unsavedVolumesGuard } from './pages/dashboard/pages/detail/pages/volumes/guards/unsaved.guard';
import { VolumesComponent } from './pages/dashboard/pages/detail/pages/volumes/volumes.component';
import { TokensComponent } from './pages/dashboard/pages/settings/pages/tokens/tokens.component';
import { SettingsComponent } from './pages/dashboard/pages/settings/settings.component';

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
        children: [
          {
            path: '',
            component: TokensComponent,
          },
        ],
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
          {
            path: 'variables',
            component: VariablesComponent,
            canDeactivate: [unsavedVariablesGuard],
          },
          {
            path: 'networks',
            component: NetworksComponent,
            canDeactivate: [unsavedNetworksGuard],
          },
          {
            path: 'labels',
            component: LabelsComponent,
            canDeactivate: [unsavedLabelsGuard],
          },
          {
            path: 'triggers',
            component: TriggersComponent,
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
