import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL, TRACCAR_SERVER_API_URL} from "../app.constant";
import {AppResponse, Autocomplete, Localization, Place, ResponseApp, Respuesta} from "../app.model";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PlaceService {

    private placeUrl = SERVER_API_URL + "api/place";
    private traccarUrl = TRACCAR_SERVER_API_URL + "/api/server";

    constructor(private http: HttpClient) {
    }

    listarPlaces(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Place>> {
        let constUrl = `${this.placeUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Place>>(constUrl, {observe: "response"});
    }

    listarAllPlaces(): Observable<Respuesta<Place>> {
        let constUrl = `${this.placeUrl}/all`;
        return this.http.get<AppResponse<Place>>(constUrl, {observe: "response"});
    }

    insertarPlace(place: Place): Observable<Respuesta<Place>> {
        return this.http.post<AppResponse<Place>>(this.placeUrl, place, {observe: "response"});
    }

    modificarPlace(id: number, place: Place): Observable<Respuesta<Place>> {
        place.id = id;
        return this.http.put<AppResponse<Place>>(this.placeUrl + "/" + id, place, {observe: "response"});
    }

    eliminarPlace(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.placeUrl + "/" + id, {observe: "response"});
    }

    findPlaceByCoord(lat: any, lon: any): Observable<Respuesta<Localization>> {
        const apiUrl = `${this.placeUrl}/findProperties`;
        return this.http.get<AppResponse<Localization>>(apiUrl, {params: {lat: lat, lon: lon}, observe: "response"});
    }

    autocompletePlace(query: string): Observable<Respuesta<Autocomplete>> {
        const apiUrl = `${this.placeUrl}/autocomplete`;
        return this.http.get<AppResponse<Autocomplete>>(apiUrl, {params: {query: query}, observe: "response"});
    }

    findDevices(): Observable<Respuesta<Autocomplete>> {
        return this.http.get<AppResponse<Autocomplete>>(this.traccarUrl, {observe: "response"});
    }
}
