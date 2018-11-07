import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Respuesta, Place, ResponseApp} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PlaceService {

    private placeUrl = SERVER_API_URL + "api/place";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarPlaces(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Place>> {
        let constUrl = `${this.placeUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Place>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarAllPlaces(): Observable<Respuesta<Place>> {
        let constUrl = `${this.placeUrl}/all`;
        return this.http.get<AppResponse<Place>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarPlace(place: Place): Observable<Respuesta<Place>> {
        return this.http.post<AppResponse<Place>>(this.placeUrl, place, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarPlace(id: number, place: Place): Observable<Respuesta<Place>> {
        place.id = id;
        return this.http.put<AppResponse<Place>>(this.placeUrl + "/" + id, place, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarPlace(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.placeUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
