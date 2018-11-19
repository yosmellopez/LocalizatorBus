import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs/index";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth)
            request = request.clone({
                setHeaders: {Authorization: `${this.auth.getToken()}`},
                setParams: {lang: this.auth.getLang()}
            });
        return next.handle(request);
    }
}
