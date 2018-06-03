import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body/body.component';
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
    path      : 'ws/:id',
    component : WsComponent,
    canActivate : [AuthGuard],
    children  : [
      {
        path  : 'dashboard',
        component : DashboardComponent,
        outlet: 'sub'
      },{
        path      : 'shared',
        component : SharedComponent,
        outlet: 'sub'
      },{
        path      : 'recent',
        component : RecentComponent,
        outlet: 'sub'
      },{
        path      : 'history',
        component : HistoryComponent,
        outlet: 'sub'
      }
    ]
  }
];

@NgModule({
  exports : [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})

export class AppRoutingModule { }
