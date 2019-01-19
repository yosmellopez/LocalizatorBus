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
import {CompanyComponent} from './company/company.component';
import {CompanyWindow} from './company/company-window/company-window.component';
import {DeviceComponent} from './device/device.component';
import {DeviceWindow} from './device/device-window/device-window.component';
import {DirectiveModule} from '../directives/directive.module';

@NgModule({
    imports: [
        AngularMaterialModule,
        PipesModule,
        CommonModule,
        RouterModule.forChild(adminRoutes),
        MensajeModule,
        ReactiveFormsModule,
        PasswordLenghtModule,
        DirectiveModule
    ],
    declarations: [UsuarioComponent, UsuarioWindow, DashboardComponent, CompanyComponent, CompanyWindow, DeviceComponent, DeviceWindow],
    entryComponents: [UsuarioWindow, CompanyWindow, DeviceWindow]
})
export class AdminModule {
}
