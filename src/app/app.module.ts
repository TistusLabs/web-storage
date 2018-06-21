import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyContentService } from  './services/mycontent.service';
import { AuthService } from  './services/auth.service';

import { AuthGuard } from './auth.guard';
// TypeScript syntax configuration
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";

import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WsComponent } from './ws/ws.component';
import { SharedComponent } from './shared/shared.component';
import { RecentComponent } from './recent/recent.component';
import { HistoryComponent } from './history/history.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidenavComponent,
    AuthComponent,
    DashboardComponent,
    WsComponent,
    SharedComponent,
    RecentComponent,
    HistoryComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    MyContentService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
