import {EventEmitter, Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constant";
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {AppResponse, Notificacion, ResponseApp, Respuesta} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private notificationUrl = SERVER_API_URL + "api/notification";
    public evento: EventEmitter<boolean> = new EventEmitter<boolean>();
    public notificationEmitter: EventEmitter<number> = new EventEmitter();

    constructor(private http: HttpClient) {
    }

    listarNotifications(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Notificacion>> {
        let constUrl = `${this.notificationUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Notificacion>>(constUrl, {observe: "response"});
    }

    listarAllNotificaciones(): Observable<Respuesta<Notificacion>> {
        let constUrl = `${this.notificationUrl}`;
        return this.http.get<AppResponse<Notificacion>>(constUrl, {observe: "response"});
    }

    findNotificacion(id: number): Observable<Respuesta<Notificacion>> {
        let constUrl = `${this.notificationUrl}/${id}`;
        return this.http.get<AppResponse<Notificacion>>(constUrl, {observe: "response"});
    }

    insertarNotificacion(notification: Notificacion): Observable<Respuesta<Notificacion>> {
        return this.http.post<AppResponse<Notificacion>>(this.notificationUrl, notification, {observe: "response"});
    }

    modificarNotificacion(id: number, notification: Notificacion): Observable<Respuesta<Notificacion>> {
        notification.id = id;
        return this.http.put<AppResponse<Notificacion>>(this.notificationUrl + "/" + id, notification, {observe: "response"});
    }

    eliminarNotificacion(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.notificationUrl + "/" + id, {observe: "response"});
    }

    readAllNotifications(): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(`${this.notificationUrl}/readAll`, {observe: "response"});
    }
}
