import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {BusComponent} from "./bus/bus.component";
import {PlaceComponent} from "./place/place.component";
import {RouteComponent} from "./route/route.component";
import {TravelComponent} from "./travel/travel.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {NotificationComponent} from "../components/notification/notification.component";
import {Injectable} from "@angular/core";
import {NotificacionService} from "../services/notification.service";
import {Notificacion} from "../app.model";
import {Observable} from "rxjs/index";
import {map} from "rxjs/internal/operators";


@Injectable({providedIn: 'root'})
export class NotificacionResolve implements Resolve<Notificacion> {

    constructor(private service: NotificacionService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Notificacion> | Promise<Notificacion> | Notificacion {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.findNotificacion(id).pipe(map(resp => {
                if (resp.ok)
                    return resp.body.elemento
                return new Notificacion();
            })).toPromise();
        }
        return Promise.resolve(new Notificacion());
    }
}

export const routesComun: Routes = [
    {path: 'user-profile', component: UserProfileComponent},
    {path: 'bus-list', component: BusComponent},
    {path: 'place-list', component: PlaceComponent},
    {path: 'route-list', component: RouteComponent},
    {path: 'travel-list', component: TravelComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'notification', component: NotificationComponent},
    {path: 'notification/:id', component: NotificationComponent, resolve: {object: NotificacionResolve}},
];

