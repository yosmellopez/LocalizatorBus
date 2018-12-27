import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {NotificacionService} from "../../services/notification.service";
import {Notificacion, RouteInfo, Titulo, Usuario} from "../../app.model";
import {WebsocketService} from "../../services/websocket.service";
import {Observable, of, Subscription} from "rxjs/index";
import {Message} from '@stomp/stompjs';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from "@angular/material";
import {LanguageService} from "../../services/language.service";
import {TranslateService} from "../../services/translate.service";
import {Principal} from "../../services/principal.service";
import {TitleService} from "../../services/title.service";
import {Howl, Howler} from 'howler';
import {AppService} from "../../services/app.service";

declare function my_init_plugins();

const LANGUAGES: RouteInfo[] = [{
    id: "",
    title: "English",
    class: "grey-text text-darken-1",
    isActive: false,
    icon: "flag-icon flag-icon-gb",
    hasChildren: false,
    authority: [],
    pageTitle: "",
    path: "en",
    routes: []
}, {
    id: "",
    title: "Español",
    class: "grey-text text-darken-1",
    isActive: false,
    hasChildren: false,
    pageTitle: "",
    path: "es",
    icon: "flag-icon flag-icon-es",
    authority: [],
    routes: []
}];

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    viewProviders: [WebsocketService]
})
export class HeaderComponent implements OnInit {
    languages = LANGUAGES;
    titulos: Observable<Titulo[]> = new Observable<Titulo[]>();
    pageTitle: Observable<string> = new Observable<string>();
    usuarioTitle: Observable<string> = new Observable<string>();
    notificaciones: Notificacion[] = [];
    username: string;
    isAdmin: boolean = false;
    usuario: Usuario = null;
    expandido: boolean = true;
    @ViewChild("body") body: ElementRef;
    private websocketNotification: Subscription;
    private websocketAdminNotification: Subscription;
    private websocketStatus: Subscription;

    constructor(private notificationService: NotificacionService, private websocket: WebsocketService, public snackBar: MatSnackBar, private language: LanguageService,
                private translate: TranslateService, private principal: Principal, private titleService: TitleService, private appService: AppService) {
        this.username = localStorage.getItem("username");
        this.isAdmin = JSON.parse(localStorage.getItem("isAdmin") == null ? "false" : localStorage.getItem("isAdmin"));
    }

    ngOnInit() {
        my_init_plugins();
        this.principal.getAuthenticationState().subscribe((user: Usuario) => {
            this.usuario = user;
        });
        this.titleService.titleEmitter.subscribe(value => {
            this.titulos = of(value);
        });
        this.titleService.pageTitleEmitter.subscribe(value => {
            this.pageTitle = of(value);
        });
        this.principal.usuarioEmitter.subscribe(texto => {
            this.usuarioTitle = of(texto);
        });
        this.websocket.connectWebSocket(this.username, this.isAdmin);
        this.websocketNotification = this.websocket.getMessageNotificacion().subscribe(this.onReceiveNotification);
        if (this.isAdmin)
            this.websocketAdminNotification = this.websocket.getMessageAdminNotificacion().subscribe(this.onReceiveNotification);
        this.websocketStatus = this.websocket.getSocketStateObservable().subscribe(this.onStateChange);
        this.listarNotificaciones();
        this.notificationService.evento.subscribe(() => {
            this.listarNotificaciones();
        });
    }

    private listarNotificaciones() {
        this.notificationService.listarAllNotificaciones().subscribe(resp => {
            if (resp.body.success)
                this.notificaciones = resp.body.elementos;
            this.notificationService.notificationEmitter.emit(this.notificaciones.length);
        });
    }

    changeLanguage(locale: string) {
        this.language.changeLanguage(locale).subscribe(resp => {
            if (resp.body.success) {
                this.translate.setLang(locale);
            }
        });
    }

    private onReceiveNotification = (message: Message) => {
        const notificacion: Notificacion = JSON.parse(message.body);
        this.notificaciones.push(notificacion);
        this.snackBar.openFromComponent(NotificacionMensajeComponent, {
            duration: 10000,
            horizontalPosition: "left",
            verticalPosition: "bottom",
            panelClass: ['blue-snackbar'],
            data: notificacion
        });
        this.notificationService.notificationEmitter.emit(this.notificaciones.length);
        let sound = new Howl({src: ['assets/sound.mp3']});
        sound.play();
        console.log("Recibida la notificacion")
    }

    private onStateChange = (state: String) => {
        console.log('Cambiando estado del WebSocket a: ' + state);
    }

    cambiarBarra() {
        this.expandido = !this.expandido;
        document.body.setAttribute("data-layout", this.expandido ? "default-sidebar-1" : "default-sidebar-2");
        this.appService.pageEvent.emit(this.expandido);
    }

    crearNotificacion() {
        let notificacion: Notificacion = {
            title: "Notificacion de Prueba",
            mensaje: "Hace unos segundos",
            icono: "",
            fecha: new Date(),
            description: "Esta es una notificacion de prueba para ver lo que sucede con las notificaciones",
            id: 20
        };
        this.snackBar.openFromComponent(NotificacionMensajeComponent, {
            duration: 100000,
            horizontalPosition: "left",
            verticalPosition: "bottom",
            panelClass: ['blue-snackbar'],
            data: notificacion,
            announcementMessage: "Esto es una prueba"
        });
    }
}

@Component({
    selector: 'notificacion-mensaje',
    templateUrl: 'notificacion-mensaje.html',
    styleUrls: ['./header.component.css']
})
export class NotificacionMensajeComponent {
    notification: Notificacion;

    constructor(public snackbarRef: MatSnackBarRef<NotificacionMensajeComponent>, @Inject(MAT_SNACK_BAR_DATA) notificacion: Notificacion) {
        this.notification = notificacion;
    }

    cerrarSnackbar() {
        this.snackbarRef.dismiss();
    }
}
