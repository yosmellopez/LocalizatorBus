import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {adminRoutes} from "./admin-routing.module";
import {UsuarioComponent} from './usuario/usuario.component';
import {AngularMaterialModule} from "../material.module";
import {PipesModule} from "../pipes/pipes.module";
import {UsuarioWindow} from './usuario/usuario-window/usuario-window.component';
import {MensajeModule} from "../mensaje/mensaje.module";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordLenghtModule} from "../password-lenght/password-lenght.module";
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from "@angular/common";


@NgModule({
    imports: [
        AngularMaterialModule,
        PipesModule,
        CommonModule,
        RouterModule.forChild(adminRoutes),
        MensajeModule,
        ReactiveFormsModule,
        PasswordLenghtModule
    ],
    declarations: [UsuarioComponent, UsuarioWindow, DashboardComponent],
    entryComponents: [UsuarioWindow]
})
export class AdminModule {
}
