import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyContentService } from './services/mycontent.service';
import { AuthService } from './services/auth.service';
import { UIHelperService } from './services/uihelper.service';
import { AuditTrailService } from './services/audittrail.service';
import { BroadcasterService } from "ng-broadcaster";

import { AuthGuard } from './auth.guard';
// TypeScript syntax configuration
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import { DataTablesModule } from 'angular-datatables';
import { GroupByPipe } from "./groupby.pipe";
import { FilterSearchPipe } from "./filtersearch.pipe";

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
import { ProfileComponent } from './profile/profile.component';
import {OrderModule} from 'ngx-order-pipe';

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
        TrashComponent,
        GroupByPipe,
        ProfileComponent,
        FilterSearchPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        DataTablesModule,
        OrderModule
    ],
    providers: [
        MyContentService,
        UIHelperService,
        AuthService,
        AuthGuard,
        AuditTrailService,
        GroupByPipe,
        BroadcasterService
    ],
    entryComponents: [
        AppComponent,
        DashboardComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
