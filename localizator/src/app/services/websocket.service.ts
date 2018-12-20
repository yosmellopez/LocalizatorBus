import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {map} from 'rxjs/operators';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {NOTIFICATION_TOPIC, TRACCAR_WEBSOCKET_API_URL} from "../app.constant";

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private messageNotificacion: Observable<Message>;
    private messageAdminNotificacion: Observable<Message>;
    private traccarWeb: Observable<Message>;
    public wsstate: Observable<string>;

    constructor(private stompService: StompService) {
    }

    public connectWebSocket(username: string, isAdmin: boolean) {
        this.wsstate = this.stompService.state.pipe(map((state: number) => StompState[state]));
        this.messageNotificacion = this.stompService.subscribe(`${NOTIFICATION_TOPIC}/${username}`);
        if (isAdmin)
            this.messageAdminNotificacion = this.stompService.subscribe(`${NOTIFICATION_TOPIC}/admin`);
    }

    public connectTraccarWebSocket() {
        this.traccarWeb = this.stompService.subscribe(TRACCAR_WEBSOCKET_API_URL);
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

    getTraccarWeb(): Observable<Message> {
        return this.traccarWeb;
    }
}
