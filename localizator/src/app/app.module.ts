import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent, NotificacionMensajeComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {AngularMaterialModule} from "./material.module";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PipesModule} from "./pipes/pipes.module";
import {ComunComponent} from "./comun/comun.component";
import {CommonModule} from "@angular/common";
import {MensajeModule} from "./mensaje/mensaje.module";
import {LoginComponent} from './components/login/login.component';
import {AdminComponent} from "./admin/admin.component";
import {CenterComponent} from './components/center/center.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DateAdapter} from "@angular/material";
import {DateFormat} from "./app.model";
import {StompConfig, StompService} from "@stomp/ng2-stompjs";
import {stompConfig} from "./app.constant";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ComunComponent,
        LoginComponent,
        AdminComponent,
        ComunComponent,
        CenterComponent,
        NotificacionMensajeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        PipesModule,
        CommonModule,
        MensajeModule,
        AppRoutingModule,
        RouterModule,
        ReactiveFormsModule
    ],
    providers: [
        {provide: DateAdapter, useClass: DateFormat},
        StompService,
        {
            provide: StompConfig,
            useValue: stompConfig,
        },
    ],
    bootstrap: [AppComponent],
    entryComponents: [NotificacionMensajeComponent]
})
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
