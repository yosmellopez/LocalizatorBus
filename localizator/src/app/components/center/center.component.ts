import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Location} from "@angular/common";
import {Router, RouterOutlet} from "@angular/router";
import {RouteInfo, Usuario} from "../../app.model";
import {Principal} from "../../services/principal.service";
import {routerTransition} from "../../animations";

const RUTAS: RouteInfo[] = [
    {
        path: '/admin/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        class: 'waves-effect waves-cyan',
        authority: ["Admin"]
    },
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'dashboard',
        class: 'waves-effect waves-cyan',
        authority: ["User"]
    },
    {
        path: '/user-profile',
        title: 'Perfil de Usuario',
        icon: 'person',
        class: 'waves-effect waves-cyan',
        authority: ["Admin", "User"]
    },
    {
        path: '/admin/usuario-list',
        title: 'Lista de Usuarios',
        icon: 'group',
        class: 'waves-effect waves-cyan',
        authority: ["Admin"]
    },
    {
        path: '/bus-list',
        title: 'Lista de Buses',
        icon: 'directions_bus',
        class: 'waves-effect waves-cyan',
        authority: ["User"]
    },
    {
        path: '/place-list',
        title: 'Lista de Lugares',
        icon: 'place',
        class: 'waves-effect waves-cyan',
        authority: ["User"]
    },
    {
        path: '/route-list',
        title: 'Lista de Rutas',
        icon: 'directions',
        class: 'waves-effect waves-cyan',
        authority: ["User"]
    },
    {
        path: '/travel-list',
        title: 'Lista de Viajes',
        icon: 'airplanemode_active',
        class: 'waves-effect waves-cyan',
        authority: ["User"]
    },
];

@Component({
    selector: 'app-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.css'],
    animations: [
        routerTransition
    ]
})
export class CenterComponent implements OnInit {
    titulo: string;
    rutas: RouteInfo[] = RUTAS;
    usuario: Usuario = new Usuario();
    rutasUsuario: RouteInfo[] = [];

    constructor(private router: Router, private location: Location, private principal: Principal) {
    }

    ngOnInit(): void {
        this.principal.identity().then(valor => {
            if (valor) {
                this.usuario = valor;
                this.rutas.forEach(ruta => {
                    if (this.hasAuthority(ruta))
                        this.rutasUsuario.push(ruta);
                });
            }
        });
    }

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        for (var item = 0; item < this.rutas.length; item++) {
            if (this.rutas[item].path === titlee) {
                this.titulo = this.rutas[item].title;
                return this.rutas[item].title;
            }
        }
        return 'Dashboard';
    }

    cerrarSession() {
        localStorage.removeItem("user_token");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("username");
        this.principal.logout();
        this.router.navigate(["/login"]);
    }

    hasAuthority(menuItem: RouteInfo) {
        return menuItem.authority.includes(this.usuario.rol.name);
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
