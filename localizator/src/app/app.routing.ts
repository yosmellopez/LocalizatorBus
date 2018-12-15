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
        isActive: false,
        pageTitle: 'welcome',
        authority: ["Administrador"],
        hasChildren: false,
        routes: []
    },
    {
        id: "user-dashboard",
        path: '/user/dashboard',
        title: 'dashboard',
        icon: 'dashboard',
        pageTitle: 'welcome',
        class: 'tag tag-rounded tag-danger tag-sm',
        isActive: false,
        authority: ["Usuario"],
        hasChildren: false,
        routes: []
    },
    {
        id: "admin-actions",
        title: "adminTitle",
        icon: "group",
        class: "tag tag-rounded tag-info tag-sm",
        isActive: false,
        authority: ["Administrador"],
        hasChildren: true,
        pageTitle: 'Welcome',
        path: "",
        routes: [{
            path: '/admin/usuario-list',
            title: 'usuario.list',
            pageTitle: 'usuario.list',
            icon: 'supervisor_account',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/admin/company-list',
            title: 'company.list',
            pageTitle: 'company.list',
            icon: 'business',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-actions",
        title: "gpsTravel",
        icon: "gps_fixed",
        class: "tag tag-rounded tag-success tag-sm",
        isActive: false,
        hasChildren: true,
        path: "",
        pageTitle: '',
        authority: ["Usuario", "Administrador"],
        routes: [{
            path: '/user/bus-list',
            title: 'bus.list',
            pageTitle: 'bus.list',
            icon: 'directions_bus',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/place-list',
            title: 'place.list',
            pageTitle: 'place.list',
            icon: 'place',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/route-list',
            title: 'route.list',
            pageTitle: 'route.list',
            icon: 'directions',
            class: 'waves-effect waves-cyan',
        }, {
            path: '/user/travel-list',
            title: 'travel.list',
            pageTitle: 'travel.list',
            icon: 'airplanemode_active',
            class: 'waves-effect waves-cyan',
        }]
    }, {
        id: "user-profile",
        path: '/user/profile',
        title: 'userprofile',
        icon: 'person',
        pageTitle: 'userprofile',
        class: 'tag tag-rounded tag-danger tag-sm',
        isActive: false,
        authority: ["Administrador", "Usuario"],
        hasChildren: false,
        routes: [],
    }, {
        id: "notifications",
        path: '/user/notification',
        title: 'notifications',
        icon: 'notifications',
        pageTitle: 'notifications',
        class: 'tag tag-rounded tag-danger tag-sm',
        isActive: false,
        authority: ["Administrador", "Usuario"],
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
