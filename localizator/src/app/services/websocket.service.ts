import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {map} from 'rxjs/operators';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {DEVICE_TOPIC, NOTIFICATION_TOPIC} from "../app.constant";

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private messageNotificacion: Observable<Message>;
    private messageAdminNotificacion: Observable<Message>;
    private messageDevice: Observable<Message>;
    public wsstate: Observable<string>;

    constructor(private stompService: StompService) {
    }

    public connectWebSocket(username: string, isAdmin: boolean) {
        this.wsstate = this.stompService.state.pipe(map((state: number) => StompState[state]));
        this.messageNotificacion = this.stompService.subscribe(`${NOTIFICATION_TOPIC}/${username}`);
        if (isAdmin)
            this.messageAdminNotificacion = this.stompService.subscribe(`${NOTIFICATION_TOPIC}/admin`);
    }

    public connectDeviceSocket() {
        this.messageDevice = this.stompService.subscribe(`${DEVICE_TOPIC}`);
    }

    public getSocketStateObservable(): Observable<string> {
        return this.wsstate;
    }

    public getMessageNotificacion(): Observable<Message> {
        return this.messageNotificacion;
    }

    public getMessageAdminNotificacion(): Observable<Message> {
        return this.messageAdminNotificacion;
    }

    public getMessageDevice(): Observable<Message> {
        return this.messageDevice;
    }
}
