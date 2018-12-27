import {Routes} from '@angular/router';
import {UsuarioComponent} from "./usuario/usuario.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CompanyComponent} from "./company/company.component";
import {DeviceComponent} from "./device/device.component";

export const adminRoutes: Routes = [
    {path: 'usuario-list', component: UsuarioComponent, data: {animation: "UsuarioPage", title: "Lista de Usuarios"}},
    {path: 'company-list', component: CompanyComponent, data: {animation: "CompanyPage", title: "Lista de Usuarios"}},
    {path: 'dashboard', component: DashboardComponent, data: {animation: "AdminPage", title: "Lista de Usuarios"}},
    {path: 'device-list', component: DeviceComponent, data: {animation: "DevicePage", title: "Lista de Usuarios"}}
];
