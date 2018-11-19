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
    {path: 'bus-list', component: BusComponent, data: {animation: true}},
    {path: 'place-list', component: PlaceComponent, data: {animation: true}},
    {path: 'route-list', component: RouteComponent, data: {animation: true}},
    {path: 'travel-list', component: TravelComponent, data: {animation: true}},
    {path: 'dashboard', component: DashboardComponent, data: {animation: true}},
    {path: 'profile', component: UserProfileComponent},
    {
        path: 'notification/:id',
        component: NotificationComponent,
        resolve: {object: NotificacionResolve},
        data: {animation: 'AnimatePage'}
    },
    {path: 'notification', component: NotificationComponent}
];

