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
import {TranslateService} from "./services/translate.service";
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {TokenInterceptor} from "./services/token-interceptor";

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
        UserMenuComponent
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
    ],
    providers: [
        {provide: DateAdapter, useClass: DateFormat},
        StompService, {
            provide: StompConfig,
            useValue: stompConfig,
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [NotificacionMensajeComponent]
})
export class AppModule {
    constructor(private dateAdapter: DateAdapter<Date>, private translate: TranslateService) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
