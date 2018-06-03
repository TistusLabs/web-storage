import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WsComponent } from './ws/ws.component';
import { SharedComponent } from './shared/shared.component';
import { RecentComponent } from './recent/recent.component';
import { HistoryComponent } from './history/history.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path      : '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },{
    path      : 'auth',
    component : AuthComponent
  },{
    path      : 'ws',
    component : WsComponent,
    canActivate : [AuthGuard],
    children  : [
      {
        path  : 'dashboard',
        component : DashboardComponent
      },{
        path      : 'shared',
        component : SharedComponent
      },{
        path      : 'recent',
        component : RecentComponent
      },{
        path      : 'history',
        component : HistoryComponent
      }
    ]
  }
];

@NgModule({
  exports : [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule { }
