import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Respuesta, Usuario} from "../app.model";

@Injectable({providedIn: 'root'})
export class AccountService {
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    get(): Observable<Respuesta<Usuario>> {
        return this.http.get<AppResponse<Usuario>>(SERVER_API_URL + 'api/account', {
            observe: 'response',
            headers: {"Authorization": this.token}
        });
    }

    save(account: Usuario): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(SERVER_API_URL + 'api/account', account, {
            observe: 'response',
            headers: {"Authorization": this.token}
        });
    }

    iniciarSesion(values: any): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(SERVER_API_URL + 'api/auth/login', values, {observe: 'response'});
    }
}
