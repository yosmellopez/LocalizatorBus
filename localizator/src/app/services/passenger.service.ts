import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Respuesta, Passenger, ResponseApp} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PassengerService {

    private passengerUrl = SERVER_API_URL + "api/passenger";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarPassengers(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Passenger>> {
        let constUrl = `${this.passengerUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Passenger>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarAllPassengers(): Observable<Respuesta<Passenger>> {
        let constUrl = `${this.passengerUrl}/all`;
        return this.http.get<AppResponse<Passenger>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarPassenger(passenger: Passenger): Observable<Respuesta<Passenger>> {
        return this.http.post<AppResponse<Passenger>>(this.passengerUrl, passenger, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarPassenger(id: number, passenger: Passenger): Observable<Respuesta<Passenger>> {
        passenger.id = id;
        return this.http.put<AppResponse<Passenger>>(this.passengerUrl + "/" + id, passenger, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarPassenger(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.passengerUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
