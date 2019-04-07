import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private lang: string = '';

    constructor() {
    }

    public getToken(): string {
        return localStorage.getItem('user_token') || '';
    }

    getLang(): string {
        this.lang = localStorage.getItem('lang') || 'es';
        return this.lang;
    }
}
