import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { MyContentService } from  './services/mycontent.service';

@NgModule({
    declarations: [
        AppComponent,
        TopbarComponent,
        SidenavComponent,
        BodyComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        MyContentService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
