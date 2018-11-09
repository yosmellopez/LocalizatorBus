import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from "@angular/router";
import {routesComun} from "./comun-routing.module";
import {PlaceComponent} from "./place/place.component";
import {BusComponent} from "./bus/bus.component";
import {UserProfileComponent} from './user-profile/user-profile.component';
import {RouteComponent} from './route/route.component';
import {TravelComponent} from './travel/travel.component';
import {AngularMaterialModule} from "../material.module";
import {PipesModule} from "../pipes/pipes.module";
import {BusWindow} from './bus/bus-window/bus-window.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PlaceWindow} from './place/place-window/place-window.component';
import {RouteWindow} from './route/route-window/route-window.component';
import {TravelWindow} from './travel/travel-window/travel-window.component';
import {DateAdapter} from "@angular/material";
import {DateFormat} from "../app.model";
import {DashboardComponent} from './dashboard/dashboard.component';
import {NotificationComponent} from '../components/notification/notification.component';
import {AmazingTimePickerModule} from "amazing-time-picker";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";


@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        PipesModule,
        ReactiveFormsModule,
        AmazingTimePickerModule,
        RouterModule.forChild(routesComun),
        NgxMaterialTimepickerModule
    ],
    declarations: [BusComponent, PlaceComponent, UserProfileComponent, RouteComponent, TravelComponent, BusWindow, PlaceWindow, RouteWindow, TravelWindow, DashboardComponent, NotificationComponent],
    entryComponents: [BusWindow, PlaceWindow, RouteWindow, TravelWindow],
    providers: [
        {provide: DateAdapter, useClass: DateFormat},
    ],
})
export class ComunModule {
    constructor(private dateAdapter: DateAdapter<Date>) {
        dateAdapter.setLocale('en-in'); // DD/MM/YYYY
    }
}
