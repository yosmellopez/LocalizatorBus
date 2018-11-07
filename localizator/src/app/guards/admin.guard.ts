import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Principal} from "../services/principal.service";

declare function my_init_plugins();

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private principal: Principal, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        my_init_plugins();
        return this.principal.hasAuthority("Admin").then(authenticated => {
            if (authenticated) {
                return Promise.resolve(authenticated);
            } else {
                this.router.navigate(["/login"]);
                return Promise.resolve(false);
            }
        });
    }
}
