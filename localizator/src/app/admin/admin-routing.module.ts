import {Routes} from '@angular/router';
import {UsuarioComponent} from "./usuario/usuario.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CompanyComponent} from "./company/company.component";

export const adminRoutes: Routes = [
    {path: 'usuario-list', component: UsuarioComponent, data: {animation: "UsuarioPage"}},
    {path: 'company-list', component: CompanyComponent, data: {animation: "UsuarioPage"}},
    {path: 'dashboard', component: DashboardComponent, data: {animation: "AdminPage"}}
];
