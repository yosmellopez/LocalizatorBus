import {Component, Inject, OnInit} from '@angular/core';
import {NotificacionService} from "../../services/notification.service";
import {Notificacion, RouteInfo} from "../../app.model";
import {WebsocketService} from "../../services/websocket.service";
import {Subscription} from "rxjs/index";
import {Message} from '@stomp/stompjs';
import {MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA, MatDialogRef, MatSnackBar, MatSnackBarRef} from "@angular/material";
import {UsuarioWindow} from "../../admin/usuario/usuario-window/usuario-window.component";
import {Router} from "@angular/router";
import {LanguageService} from "../../services/language.service";

const LANGUAGES: RouteInfo[] = [{
    path: "en_EN",
    title: "English",
    class: "grey-text text-darken-1",
    icon: "flag-icon flag-icon-gb",
    authority: []
}, {
    path: "es_ES",
    title: "Español",
    class: "grey-text text-darken-1",
    icon: "flag-icon flag-icon-es",
    authority: []
}];

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    viewProviders: [WebsocketService]
})
export class HeaderComponent implements OnInit {
    languages = LANGUAGES;
    notificaciones: Notificacion[] = [];
    username: string;
    isAdmin: boolean = false;
    private websocketNotification: Subscription;
    private websocketAdminNotification: Subscription;
    private websocketStatus: Subscription;

    constructor(private notificationService: NotificacionService, private websocket: WebsocketService, public snackBar: MatSnackBar, private language: LanguageService) {
        this.username = localStorage.getItem("username");
        this.isAdmin = JSON.parse(localStorage.getItem("isAdmin") == null ? "false" : localStorage.getItem("isAdmin"));
    }

    ngOnInit() {
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
                console.log(resp.body)
            }
        });
    }

    private onReceiveNotification = (message: Message) => {
        console.log(message.body)
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
