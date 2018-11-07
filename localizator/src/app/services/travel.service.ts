import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {AppResponse, Travel, ResponseApp, Respuesta} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class TravelService {

    private travelUrl = SERVER_API_URL + "api/travel";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarTravels(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Travel>> {
        let constUrl = `${this.travelUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Travel>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarTravel(travel: Travel): Observable<Respuesta<Travel>> {
        return this.http.post<AppResponse<Travel>>(this.travelUrl + "?lang=en", travel, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarTravel(id: number, travel: Travel): Observable<Respuesta<Travel>> {
        travel.id = id;
        return this.http.put<AppResponse<Travel>>(this.travelUrl + "/" + id, travel, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarTravel(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.travelUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
