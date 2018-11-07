import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {AppResponse, PassengerTravel, ResponseApp, Respuesta} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class PassengerTravelService {

    private placeUrl = SERVER_API_URL + "api/passengerTravel";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarPassengerTravels(sort: string, order: string, page: number, limit: number): Observable<Respuesta<PassengerTravel>> {
        let constUrl = `${this.placeUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<PassengerTravel>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarAllPlaces(): Observable<Respuesta<PassengerTravel>> {
        let constUrl = `${this.placeUrl}/all`;
        return this.http.get<AppResponse<PassengerTravel>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarPassengerTravel(passengerTravel: PassengerTravel): Observable<Respuesta<PassengerTravel>> {
        return this.http.post<AppResponse<PassengerTravel>>(this.placeUrl, passengerTravel, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarPassengerTravel(passengerTravel: PassengerTravel): Observable<Respuesta<PassengerTravel>> {
        const url = `${this.placeUrl}/${passengerTravel.passenger.id}/${passengerTravel.travel.id}`;
        return this.http.put<AppResponse<PassengerTravel>>(url, passengerTravel, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarPassengerTravel(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.placeUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
