import {Injectable} from '@angular/core';
import {TranslateService} from "./translate.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private translate: TranslateService) {
    }

    public getToken(): string {
        return localStorage.getItem('user_token') || "";
    }

    getLang(): string {
        return this.translate.getLang();
    }
}
