import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Device, ResponseApp, Respuesta} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class DeviceService {

    private deviceUrl = SERVER_API_URL + "api/device";

    constructor(private http: HttpClient) {
    }

    listarDevices(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Device>> {
        let constUrl = `${this.deviceUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Device>>(constUrl, {observe: "response"});
    }

    listarAllDevices(): Observable<Respuesta<Device>> {
        let constUrl = `${this.deviceUrl}/all`;
        return this.http.get<AppResponse<Device>>(constUrl, {observe: "response"});
    }

    insertarDevice(device: Device): Observable<Respuesta<Device>> {
        return this.http.post<AppResponse<Device>>(this.deviceUrl, device, {observe: "response"});
    }

    modificarDevice(id: number, device: Device): Observable<Respuesta<Device>> {
        device.deviceId = id;
        return this.http.put<AppResponse<Device>>(this.deviceUrl + "/" + id, device, {observe: "response"});
    }

    eliminarDevice(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.deviceUrl + "/" + id, {observe: "response"});
    }
}
