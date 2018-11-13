import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {AppResponse, ResponseApp, Respuesta, Route} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    private routeUrl = SERVER_API_URL + "api/route";

    constructor(private http: HttpClient) {
    }

    listarRoutes(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Route>>(constUrl, {observe: "response",});
    }

    listarAllRoutes(): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}/all`;
        return this.http.get<AppResponse<Route>>(constUrl, {observe: "response",});
    }

    findOneRoutes(id: number): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}/${id}`;
        return this.http.get<AppResponse<Route>>(constUrl, {observe: "response",});
    }


    insertarRoute(route: Route): Observable<Respuesta<Route>> {
        return this.http.post<AppResponse<Route>>(this.routeUrl + "?lang=en", route, {observe: "response",});
    }

    modificarRoute(id: number, route: Route): Observable<Respuesta<Route>> {
        route.id = id;
        return this.http.put<AppResponse<Route>>(this.routeUrl + "/" + id, route, {observe: "response",});
    }

    eliminarRoute(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.routeUrl + "/" + id, {observe: "response",});
    }
}
