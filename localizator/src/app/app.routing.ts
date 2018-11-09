import {Route, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {ComunComponent} from "./comun/comun.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AdminGuard} from "./guards/admin.guard";
import {UsuarioGuard} from "./guards/usuario.guard";

const routes: Route[] = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [{path: 'admin', loadChildren: './admin/admin.module#AdminModule'}]
    },
    {
        path: '',
        canActivate: [UsuarioGuard],
        component: ComunComponent,
        children: [{path: '', loadChildren: './comun/comun.module#ComunModule'}]
    }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {
}
