import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WsComponent } from './ws/ws.component';
import { SharedComponent } from './shared/shared.component';
import { RecentComponent } from './recent/recent.component';
import { HistoryComponent } from './history/history.component';
import { SignupComponent } from './signup/signup.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  }, {
    path: 'auth',
    component: AuthComponent
  }, {
    path: 'signup',
    component: SignupComponent
  }, {
    path: 'ws',
    component: WsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'shared',
        component: SharedComponent
      }, {
        path: 'recent',
        component: RecentComponent
      }, {
        path: 'history',
        component: HistoryComponent
      }
    ],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
})

export class AppRoutingModule { }
