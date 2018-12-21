import {HttpHeaders, HttpResponseBase} from "@angular/common/http";
import {NativeDateAdapter} from '@angular/material';

export class Usuario {
    id: number;
    name: string;
    lastname: string;
    dni: string;
    username: string;
    password: string;
    activated: boolean = false;
    email: string;
    companies: Company[] = [];
    rol: Rol;
    language: string = "es";
}

export class Rol {
    id: number;
    name: string;
}

export class MyLocation {
    latitude: number;
    longitude: number;
}

export class Bus {
    id: number;
    siteNumber: number;
    number: number;
    code: string;
    company: Company;
    device: Device;
}

export class Device {
    deviceId: number;
    latitude: number;
    longitude: number;
}

export class Place {
    id: number;
    name: string;
    address: string;
    postalCode: number = 0;
    lat: number = 0;
    lon: number = 0;
    stretch: boolean = false;
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
    canceled: boolean = false;
}

export class Mensaje {
    title: string;
    description: string;
}

export class Localization {
    placeId: number;
    lat: number;
    lon: number;
    licence: string;
    osmType: string;
    displayName: string;
    address: Address;
    boundingbox: any[] = [];
}

export class Address {
    road: string;
    suburb: string;
    hamlet: string;
    county: string;
    state: string;
    country: string;
    countryCode: string;
    postcode: number;
    village: string;
    town: string;
    neighbourhood: string;
}

export class Autocomplete {
    feature_id: number;
    name: string;
    label: string;
    fully_qualified_name: string;
    lat: number;
    lng: number;
    lat_admin_centre: number;
    lng_admin_centre: number;
    placetype: string
    country_code: string;
    municipality: boolean;
    feature_class: string;
    feature_code: string;
    name_ascii: string;
    gtopo30: number;
    timezone: string;
    amenity: string;
    population: number;
    country_name: string;
    score: number;
    zipcode: string[];
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
    existe: boolean = false;
}

export class ResponseApp {
    success: boolean;
    msg: string;
    total: number;
    existe: boolean = false;
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
    isActive: boolean;
    pageTitle: string;
    authority: string[];
    routes: AppRoute[];
    hasChildren: boolean;
}

export declare interface AppRoute {
    path: string;
    title: string;
    icon: string;
    class: string;
    pageTitle: string;
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
