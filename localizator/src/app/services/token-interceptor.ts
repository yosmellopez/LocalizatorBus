import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs/index";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Funciona el interceptor")
        request = request.clone({
            setHeaders: {Authorization: `${this.auth.getToken()}`}
        });
        console.log(request)
        return next.handle(request);
    }
}
