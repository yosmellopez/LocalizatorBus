import {Route, RouterModule} from "@angular/router";
import {LoginComponent} from "./components/login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {ComunComponent} from "./comun/comun.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AdminGuard} from "./guards/admin.guard";
import {UsuarioGuard} from "./guards/usuario.guard";
import {RouteInfo} from "./app.model";

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
        children: [{path: 'user', loadChildren: './comun/comun.module#ComunModule'}]
    }
];


export const RUTAS: RouteInfo[] = [
    {
        id: "admin-dashboard",
        path: '/admin/dashboard',
        title: 'dashboard',
        icon: 'dashboard',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["Admin"],
        hasChildren: false,
        routes: []
    },
    {
        id: "user-dashboard",
        path: '/user/dashboard',
        title: 'dashboard',
        icon: 'dashboard',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["User"],
        hasChildren: false,
        routes: []
    },
    {
        id: "admin-actions",
        title: "Administracion",
        icon: "group",
        class: "tag tag-rounded tag-info tag-sm",
        authority: ["Admin"],
        hasChildren: true,
        path: "",
        routes: [{
            path: '/admin/usuario-list',
            title: 'usuario.list',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/company-list',
            title: 'company.list',
            icon: 'business',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-actions",
        title: "GPS y Viajes",
        icon: "gps_fixed",
        class: "tag tag-rounded tag-success tag-sm",
        hasChildren: true,
        path: "",
        authority: ["User", "Admin"],
        routes: [{
            path: '/user/bus-list',
            title: 'bus.list',
            icon: 'directions_bus',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/place-list',
            title: 'place.list',
            icon: 'place',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/route-list',
            title: 'route.list',
            icon: 'directions',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/travel-list',
            title: 'travel.list',
            icon: 'airplanemode_active',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-profile",
        path: '/user/profile',
        title: 'userprofile',
        icon: 'person',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["Admin", "User"],
        hasChildren: false,
        routes: [],
    }, {
        id: "notifications",
        path: '/user/notification',
        title: 'notifications',
        icon: 'notifications',
        class: 'tag tag-rounded tag-danger tag-sm',
        authority: ["Admin", "User"],
        hasChildren: false,
        routes: [],
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
