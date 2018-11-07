import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {AppResponse, Route, ResponseApp, Respuesta} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    private routeUrl = SERVER_API_URL + "api/route";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarRoutes(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Route>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarAllRoutes(): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}/all`;
        return this.http.get<AppResponse<Route>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    findOneRoutes(id: number): Observable<Respuesta<Route>> {
        let constUrl = `${this.routeUrl}/${id}`;
        return this.http.get<AppResponse<Route>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }


    insertarRoute(route: Route): Observable<Respuesta<Route>> {
        return this.http.post<AppResponse<Route>>(this.routeUrl + "?lang=en", route, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarRoute(id: number, route: Route): Observable<Respuesta<Route>> {
        route.id = id;
        return this.http.put<AppResponse<Route>>(this.routeUrl + "/" + id, route, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarRoute(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.routeUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
