import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {ResponseApp, Respuesta} from "../app.model";
import {SERVER_API_URL} from "../app.constant";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private languageUrl = SERVER_API_URL + "api/language/change";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    changeLanguage(locale: string): Observable<Respuesta<ResponseApp>> {
        return this.http.post<ResponseApp>(this.languageUrl, {}, {
            params: {lang: locale},
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
