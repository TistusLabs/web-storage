import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyContentService } from './services/mycontent.service';
import { AuthService } from './services/auth.service';
import { UIHelperService } from './services/uihelper.service';
import { AuditTrailService } from './services/audittrail.service';

import { AuthGuard } from './auth.guard';
// TypeScript syntax configuration
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WsComponent } from './ws/ws.component';
import { RecentComponent } from './recent/recent.component';
import { HistoryComponent } from './history/history.component';
import { SignupComponent } from './signup/signup.component';
import { PreloaderLineDirective } from './directives/preloader-line.directive';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { AudittrailComponent } from './audittrail/audittrail.component';
import { TrashComponent } from './trash/trash.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    SidenavComponent,
    AuthComponent,
    DashboardComponent,
    WsComponent,
    RecentComponent,
    HistoryComponent,
    SignupComponent,
    PreloaderLineDirective,
    UsersComponent,
    GroupsComponent,
    AudittrailComponent,
    TrashComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    DataTablesModule
  ],
  providers: [
    MyContentService,
    UIHelperService,
    AuthService,
    AuthGuard,
    AuditTrailService
  ],
  entryComponents: [
    AppComponent,
    DashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
