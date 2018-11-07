import {EventEmitter, Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constant";
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {AppResponse, ResponseApp, Respuesta, Notificacion} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private notificationUrl = SERVER_API_URL + "api/notification";
    private token: string = "";
    public evento: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarAllNotificaciones(): Observable<Respuesta<Notificacion>> {
        let constUrl = `${this.notificationUrl}`;
        return this.http.get<AppResponse<Notificacion>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    findNotificacion(id: number): Observable<Respuesta<Notificacion>> {
        let constUrl = `${this.notificationUrl}/${id}`;
        return this.http.get<AppResponse<Notificacion>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarNotificacion(notification: Notificacion): Observable<Respuesta<Notificacion>> {
        return this.http.post<AppResponse<Notificacion>>(this.notificationUrl, notification, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarNotificacion(id: number, notification: Notificacion): Observable<Respuesta<Notificacion>> {
        notification.id = id;
        return this.http.put<AppResponse<Notificacion>>(this.notificationUrl + "/" + id, notification, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarNotificacion(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.notificationUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
