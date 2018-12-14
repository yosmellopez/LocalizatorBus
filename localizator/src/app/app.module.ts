import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent, NotificacionMensajeComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {AngularMaterialModule} from "./material.module";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app.routing";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PipesModule} from "./pipes/pipes.module";
import {ComunComponent} from "./comun/comun.component";
import {MensajeModule} from "./mensaje/mensaje.module";
import {LoginComponent} from './components/login/login.component';
import {AdminComponent} from "./admin/admin.component";
import {CenterComponent} from './components/center/center.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DateAdapter} from "@angular/material";
import {DateFormat} from "./app.model";
import {StompConfig, StompService} from "@stomp/ng2-stompjs";
import {stompConfig} from "./app.constant";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {TokenInterceptor} from "./services/token-interceptor";
import {AuthService} from "./services/auth.service";
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {DatePipe} from "@angular/common";
import {ChartsModule} from "ng2-charts";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ComunComponent,
        LoginComponent,
        AdminComponent,
        CenterComponent,
        NotificacionMensajeComponent,
        UserMenuComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        HttpClientModule,
        PipesModule,
        MensajeModule,
        AppRoutingModule,
        RouterModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        ChartsModule,
        GooglePlaceModule
    ],
    providers: [
        {provide: DateAdapter, useClass: DateFormat},
        StompService, DatePipe, {
            provide: StompConfig,
            useValue: stompConfig,
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
            deps: [AuthService]
        }, {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [NotificacionMensajeComponent]
})
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
