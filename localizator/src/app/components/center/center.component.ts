import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {RouteInfo, Title, Usuario} from "../../app.model";
import {Principal} from "../../services/principal.service";
import {ROUTE_ANIMATIONS_ELEMENTS, routeAnimations} from "../../animations/route.animations";
import {AnimationsService} from "../../animations/animations.service";
import {TranslateService} from "../../services/translate.service";
import {TitleService} from "../../services/title.service";
import {RUTAS} from "../../app.routing";

declare function my_init_plugins();

@Component({
    selector: 'app-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.css'],
    animations: [routeAnimations]
})
export class CenterComponent implements OnInit {
    titulo: string;
    rutas: RouteInfo[] = RUTAS;
    usuario: Usuario = null;
    rol: Promise<String> = Promise.resolve("");
    rutasUsuario: RouteInfo[] = [];
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

    constructor(private router: Router, private location: Location, private principal: Principal, private animation: AnimationsService,
                private service: TranslateService, private titleService: TitleService) {
    }

    ngOnInit(): void {
        this.animation.updateRouteAnimationType(true, true);
        this.principal.identity().then(valor => {
            if (valor) {
                this.usuario = valor;
                this.rol = Promise.resolve(this.usuario.rol.name);
                this.rutas.forEach(ruta => {
                    if (this.hasAuthority(ruta))
                        this.rutasUsuario.push(ruta);
                });
            }
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd)
                this.getTitle();
        });
        this.getTitle();
    }

    getTitle() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        let titulos: Title[] = [];
        for (let item = 0; item < this.rutas.length; item++) {
            let routes = this.rutas[item].routes;
            if (this.rutas[item].hasChildren) {
                for (let i = 0; i < routes.length; i++) {
                    if (titlee.includes(routes[i].path)) {
                        this.titulo = this.service.translate(routes[i].title);
                        titulos.push({title: this.rutas[item].title, active: false});
                        titulos.push({title: this.titulo, active: true});
                    }
                }
            }
            else {
                if (titlee.includes(this.rutas[item].path)) {
                    this.titulo = this.service.translate(this.rutas[item].title);
                    titulos.push({title: this.titulo, active: false});
                }
            }
        }
        this.titleService.emmit(titulos);
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
}
