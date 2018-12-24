import {Injectable} from '@angular/core';
import {StompConfig, StompService} from "@stomp/ng2-stompjs";
import {TRACCAR_WEBSOCKET_API_URL} from "../app.constant";

@Injectable()
export class TraccarStompService extends StompService {

}

export function traccarStompServiceFactory() {
    let configService: StompConfig = {
        url: () => {
            return new WebSocket(TRACCAR_WEBSOCKET_API_URL);
        },
        headers: {},
        heartbeat_in: 0,
        heartbeat_out: 20000,
        reconnect_delay: 5000,
        debug: false
    };
    return new TraccarStompService(configService);
}
