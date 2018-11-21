import {HttpHeaders, HttpResponseBase} from "@angular/common/http";
import {NativeDateAdapter} from '@angular/material';

export class Usuario {
    id: number;
    name: string;
    lastname: string;
    dni: string;
    username: string;
    password: string;
    activated: boolean;
    email: string;
    rol: Rol
}

export class Rol {
    id: number;
    name: string;
}

export class Bus {
    id: number;
    siteNumber: number;
    number: number;
    code: string;
    company: Company
}

export class Place {
    id: number;
    name: string;
}

export class Route {
    id: number;
    code: string;
    origin: Place;
    destiny: Place;
    expandido: boolean;
    places: Place[];
}

export class Passenger {
    id: number;
    name: string;
    lastname: string;
    dni: string;
}

export class PassengerTravel {
    passenger: Passenger;
    travel: Travel;
    place: Place;
}


export class Travel {
    id: number;
    active: boolean = false;
    route: Route;
    travelDate: Date;
    travelTime: Date;
    arriveDate: Date;
    arriveTime: Date;
    bus: Bus;
    expandido: boolean = false;
    passengerTravels: PassengerTravel[];
}

export class Imagen {
    id: number;
    titulo: string;
    direccion: string;
}

export class Notificacion {
    id: number;
    title: string;
    description: string;
    fecha: Date;
    mensaje: string;
    icono: string;
}

export class Company {
    id: number;
    name: string;
    busCount: number;
}

export class Mensaje {
    title: string;
    description: string;
}

export class ObjectParam<T> {
    object: T;
}

export class AppResponse<T> {
    success: boolean;
    msg: string;
    elemento?: T;
    elementos?: T[];
    total: number;
}

export class ResponseApp {
    success: boolean;
    msg: string;
    total: number;
}

export declare class Respuesta<T> extends HttpResponseBase {
    body: AppResponse<T>;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    url: string;
}

export declare interface RouteInfo {
    id: string;
    path: string;
    title: string;
    icon: string;
    class: string;
    authority: string[];
    routes: AppRoute[];
    hasChildren: boolean;
}

export declare interface AppRoute {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export declare class Title {
    title: string;
    active: boolean;
}


export class DateFormat extends NativeDateAdapter {
    useUtcForDisplay = true;

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}
