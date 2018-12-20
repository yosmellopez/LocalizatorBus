import {StompConfig} from "@stomp/ng2-stompjs";

export const SERVER_API_URL = localStorage.getItem("serverUrl");
export const TRACCAR_SERVER_API_URL = "http://localhost:8082";
export const TRACCAR_WEBSOCKET_API_URL = "ws://localhost:8082/api/socket";
export const uri: string = localStorage.getItem("socketDir") + 'configuracion/websocket';
export const NOTIFICATION_TOPIC: string = '/buslocator/notificacion';

export const stompConfig: StompConfig = {
    url: uri,
    headers: {},
    heartbeat_in: 0,
    heartbeat_out: 20000,
    reconnect_delay: 5000,
    debug: false,
};
