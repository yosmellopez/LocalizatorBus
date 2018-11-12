import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {NotificacionService} from "../../services/notification.service";
import {Notificacion, RouteInfo, Title, Usuario} from "../../app.model";
import {WebsocketService} from "../../services/websocket.service";
import {of, Subscription} from "rxjs/index";
import {Message} from '@stomp/stompjs';
import {MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef} from "@angular/material";
import {LanguageService} from "../../services/language.service";
import {TranslateService} from "../../services/translate.service";
import {Principal} from "../../services/principal.service";
import {TitleService} from "../../services/title.service";
import {Observable} from "rxjs/Rx";

const LANGUAGES: RouteInfo[] = [{
    id: "",
    title: "English",
    class: "grey-text text-darken-1",
    icon: "flag-icon flag-icon-gb",
    hasChildren: false,
    authority: [],
    path: "",
    routes: []
}, {
    id: "",
    title: "Español",
    class: "grey-text text-darken-1",
    hasChildren: false,
    path: "",
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
    titulos: Observable<Title[]> = new Observable<Title[]>();
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
                private translate: TranslateService, private principal: Principal, private titleService: TitleService) {
        this.username = localStorage.getItem("username");
        this.isAdmin = JSON.parse(localStorage.getItem("isAdmin") == null ? "false" : localStorage.getItem("isAdmin"));
    }

    ngOnInit() {
        this.principal.getAuthenticationState().subscribe((user: Usuario) => {
            this.usuario = user;
        });
        this.titleService.titleEmitter.subscribe(value => {
            this.titulos = of(value);
        })
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
        });
    }

    changeLanguage(locale: string) {
        this.language.changeLanguage(locale).subscribe(resp => {
            if (resp.body.success) {
                localStorage.setItem("lang", locale);
                this.translate.use(locale);
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
            panelClass: ['blue-snackbar', 'mat-elevation-z5'],
            data: notificacion
        });
    }

    private onStateChange = (state: String) => {
        console.log('WS estado de la conexion ha cambiado ' + state);
    }

    cambiarBarra() {
        this.expandido = !this.expandido;
        document.body.setAttribute("data-layout", this.expandido ? "default-sidebar-1" : "default-sidebar-2");
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