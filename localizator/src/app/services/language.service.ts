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

    constructor(private http: HttpClient) {
    }

    changeLanguage(locale: string): Observable<Respuesta<ResponseApp>> {
        return this.http.post<ResponseApp>(this.languageUrl, {}, {params: {language: locale}, observe: "response"});
    }
}
