import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {RouteInfo, Titulo, Usuario} from "../../app.model";
import {Principal} from "../../services/principal.service";
import {ROUTE_ANIMATIONS_ELEMENTS, routeAnimations} from "../../animations/route.animations";
import {AnimationsService} from "../../animations/animations.service";
import {TranslateService} from "../../services/translate.service";
import {TitleService} from "../../services/title.service";
import {RUTAS} from "../../app.routing";
import {NotificacionService} from "../../services/notification.service";
import {Observable, of} from "rxjs";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.css'],
    animations: [routeAnimations]
})
export class CenterComponent implements OnInit {
    titulo: string;
    ruta: string;
    usuario: Usuario = null;
    rol: Promise<String> = Promise.resolve("");
    rutas: RouteInfo[] = RUTAS;
    rutasUsuario: RouteInfo[] = [];
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    cantidadNotificaciones: Observable<number> = new Observable();
    currentClass: string = "";

    constructor(private router: Router, private location: Location, private principal: Principal, private animation: AnimationsService, private titleService: Title,
                private service: TranslateService, private tituloService: TitleService, private notificationService: NotificacionService) {
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
                this.principal.usuarioEmitter.emit(this.ruta.includes("dashboard") ? this.usuario.name : "");
            }
        });
        this.notificationService.notificationEmitter.subscribe(cantidad => {
            this.cantidadNotificaciones = of(cantidad);
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.getTitle();
                this.titleService.setTitle("Prueba");
            }
        });
        this.service.languageEmitter.subscribe(value => {
            this.getTitle();
        });
        this.getTitle();
    }

    getTitle() {
        let titlee = this.ruta = this.location.prepareExternalUrl(this.location.path());
        let titulos: Titulo[] = [];
        let pageTitle: string = "";
        for (let item = 0; item < this.rutas.length; item++) {
            let routes = this.rutas[item].routes;
            if (this.rutas[item].hasChildren) {
                for (let i = 0; i < routes.length; i++) {
                    if (titlee.includes(routes[i].path)) {
                        this.titulo = this.service.translate(routes[i].title);
                        titulos.push({title: this.service.translate(this.rutas[item].title), active: false});
                        titulos.push({title: this.titulo, active: true});
                        pageTitle = this.service.translate(routes[i].pageTitle);
                    }
                }
            }
            else {
                if (titlee.includes(this.rutas[item].path)) {
                    this.titulo = this.service.translate(this.rutas[item].title);
                    pageTitle = this.service.translate(this.rutas[item].pageTitle);
                    titulos.push({title: this.titulo, active: false});
                }
            }
        }
        this.tituloService.emmit(titulos, pageTitle);
        this.principal.identity().then(valor => {
            if (valor) {
                this.principal.usuarioEmitter.emit(this.ruta.includes("dashboard") ? `${this.usuario.name} ${this.usuario.lastname}` : "");
            }
        });
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
