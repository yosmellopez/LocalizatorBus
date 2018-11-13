import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Bus, ResponseApp, Respuesta} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class BusService {

    private busUrl = SERVER_API_URL + "api/bus";

    constructor(private http: HttpClient) {
    }

    listarBuss(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Bus>> {
        let constUrl = `${this.busUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Bus>>(constUrl, {observe: "response"});
    }

    listarAllBuss(): Observable<Respuesta<Bus>> {
        let constUrl = `${this.busUrl}/all`;
        return this.http.get<AppResponse<Bus>>(constUrl, {observe: "response"});
    }

    insertarBus(bus: Bus): Observable<Respuesta<Bus>> {
        return this.http.post<AppResponse<Bus>>(this.busUrl, bus, {observe: "response"});
    }

    modificarBus(id: number, bus: Bus): Observable<Respuesta<Bus>> {
        bus.id = id;
        return this.http.put<AppResponse<Bus>>(this.busUrl + "/" + id, bus, {observe: "response"});
    }

    eliminarBus(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.busUrl + "/" + id, {observe: "response"});
    }
}
