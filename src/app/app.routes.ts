import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard, nonAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
