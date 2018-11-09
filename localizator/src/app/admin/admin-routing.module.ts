import {Routes} from '@angular/router';
import {UsuarioComponent} from "./usuario/usuario.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const adminRoutes: Routes = [
    {path: 'usuario-list', component: UsuarioComponent, data: {animation: "UsuarioPage"}},
    {path: 'dashboard', component: DashboardComponent, data: {animation: "AdminPage"}}
];
