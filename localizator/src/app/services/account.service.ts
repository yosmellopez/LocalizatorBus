import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Respuesta, Usuario} from "../app.model";

@Injectable({providedIn: 'root'})
export class AccountService {

    constructor(private http: HttpClient) {
    }

    get(): Observable<Respuesta<Usuario>> {
        return this.http.get<AppResponse<Usuario>>(SERVER_API_URL + 'api/account', {observe: 'response'});
    }

    save(account: Usuario): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(SERVER_API_URL + 'api/account', account, {observe: 'response'});
    }

    iniciarSesion(values: any): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(SERVER_API_URL + 'api/auth/login', values, {observe: 'response'});
    }
}
