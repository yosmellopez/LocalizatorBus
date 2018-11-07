import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constant";
import {Observable} from "rxjs/index";
import {AppResponse, Respuesta, Rol} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private rolUrl = SERVER_API_URL + "api/roles";
    private token: string = "";

    constructor(private  http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarRoles(): Observable<Respuesta<Rol>> {
        return this.http.get<AppResponse<Rol>>(this.rolUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
