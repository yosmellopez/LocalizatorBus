import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {
    DateAdapter, ErrorStateMatcher,
    MAT_DATE_FORMATS,
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
    MatStepper,
    MatTableDataSource
} from "@angular/material";
import {Bus, Passenger, PassengerTravel, Place, Route, Travel} from "../../../app.model";
import {Information, MensajeError} from "../../../mensaje/window.mensaje";
import {TravelService} from "../../../services/travel.service";
import {RouteService} from "../../../services/route.service";
import {BusService} from "../../../services/bus.service";
import {PassengerService} from "../../../services/passenger.service";
import {PlaceService} from "../../../services/place.service";
import {PassengerTravelService} from "../../../services/passenger-travel.service";
import {Subject} from "rxjs/index";
import {WTimeDialogComponent} from "../../../components/time-control/w-time-dialog.component";

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-travel-window',
    templateUrl: './travel-window.component.html',
    styleUrls: ['./travel-window.component.css'],
    providers: [{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class TravelWindow implements OnInit {

    isLoadingResults = false;
    idTravel: number;
    insertar = true;
    travelInsertado: boolean = false;
    formViaje: FormGroup;
    formPasajero: FormGroup;
    routes: Route[];
    buses: Bus[];
    places: Place[];
    step = 0;
    insertarPassenger: boolean = true;
    minDate: Date = new Date();
    displayedColumns: string[] = ['name', 'lastname', 'dni', 'place', 'acciones'];
    datos: Array<PassengerTravel> = new Array<PassengerTravel>();
    dataSource = new MatTableDataSource<PassengerTravel>();
    newTravel: Travel;
    newPassenger: Passenger;
    currentPlace: Place;
    currentPassengerTravel: PassengerTravel;
    passengerSubcription: Subject<Passenger> = new Subject<Passenger>();
    @ViewChild(MatStepper) steeper: MatStepper;
    matcher = new MyErrorStateMatcher();
    private hour = 10;
    private minute = 25;
    private meridien = 'PM';

    constructor(public dialogRef: MatDialogRef<TravelWindow>, @Inject(MAT_DIALOG_DATA) {id, active, travelDate, arriveDate, bus, route, passengerTravels, expandido, arriveTime, travelTime}: Travel,
                private service: TravelService, private routeService: RouteService, private busService: BusService, private passengerService: PassengerService,
                private placeService: PlaceService, private passengerTravelService: PassengerTravelService, private dialog: MatDialog) {
        if (id) {
            this.insertar = false;
            this.travelInsertado = true;
            this.places = route.places;
            this.newTravel = {
                id: id,
                active: active,
                route: route,
                travelDate: travelDate,
                arriveDate: arriveDate,
                bus: bus,
                passengerTravels: passengerTravels,
                expandido: expandido,
                travelTime: travelTime,
                arriveTime: arriveTime
            };
            passengerTravels.forEach(passengerTravel => {
                this.datos.push(passengerTravel);
            });
        }
        this.idTravel = id;
        this.formViaje = new FormGroup({
            active: new FormControl(active),
            travelDate: new FormControl(travelDate ? new Date(travelDate) : '', [Validators.required]),
            travelTime: new FormControl(travelTime ? this.convertDate(new Date(travelTime)) : '', [Validators.required]),
            arriveDate: new FormControl(arriveDate ? new Date(arriveDate) : '', [Validators.required]),
            arriveTime: new FormControl(arriveTime ? this.convertDate(new Date(arriveTime)) : '', [Validators.required]),
            bus: new FormControl(bus, [Validators.required]),
            route: new FormControl(route, [Validators.required]),
        });
        this.formPasajero = new FormGroup({
            place: new FormControl('', [Validators.required]),
            passenger: new FormGroup({
                name: new FormControl('', [Validators.required]),
                lastname: new FormControl('', [Validators.required]),
                dni: new FormControl('', [Validators.required])
            }),
        });
        this.formViaje.controls['route'].valueChanges.subscribe(value => {
            if (this.newTravel)
                this.newTravel.route = value;
            this.filterPlace(value);
        });
        this.dataSource = new MatTableDataSource<PassengerTravel>(this.datos);
        // this.matcher = new MyErrorStateMatcher();
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    insertarTravel(): void {
        if (this.formViaje.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarTravel(this.formViaje.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.travelInsertado = true;
                        this.steeper.next();
                        this.newTravel = resp.body.elemento;
                        this.idTravel = appResp.elemento.id;
                        this.dialog.open(Information, {width: "400px", data: {mensaje: appResp.msg}});
                    } else {
                        this.steeper.previous();
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarTravel(this.idTravel, this.formViaje.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.travelInsertado = true;
                        this.newTravel = resp.body.elemento;
                        this.steeper.next();
                        this.dialog.open(Information, {width: "400px", data: {mensaje: appResp.msg}});
                    } else {
                        this.steeper.previous();
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            }
        }
    }

    addPassenger() {
        if (this.formPasajero.valid) {
            if (this.newPassenger) {
                this.currentPlace = this.formPasajero.controls['place'].value;
                console.log(this.formPasajero.controls['passenger'].value)
                this.passengerService.modificarPassenger(this.newPassenger.id, this.formPasajero.controls['passenger'].value).subscribe(resp => {
                    if (resp.body.success) {
                        this.newPassenger = resp.body.elemento;
                        this.currentPassengerTravel.passenger = this.newPassenger;
                        this.currentPassengerTravel.place = this.currentPlace;
                        this.editPassengerTravel();
                    }
                });
            } else {
                this.passengerService.insertarPassenger(this.formPasajero.value.passenger).subscribe(resp => {
                    if (resp.body.success) {
                        this.newPassenger = resp.body.elemento;
                        this.currentPlace = this.formPasajero.controls['place'].value;
                        this.passengerSubcription.next(this.newPassenger);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: resp.body.msg}});
                    }
                });
            }
        }
    }

    finishTravel(passengerNew: Passenger) {
        let passengerTravel: PassengerTravel = new PassengerTravel();
        passengerTravel.passenger = passengerNew;
        passengerTravel.place = this.currentPlace;
        passengerTravel.travel = this.newTravel;
        this.passengerTravelService.insertarPassengerTravel(passengerTravel).subscribe(response => {
            if (response.body.success) {
                this.datos.push(response.body.elemento);
                this.dataSource = new MatTableDataSource<PassengerTravel>(this.datos);
                this.dialog.open(Information, {
                    width: "300px",
                    data: {mensaje: "Pasajero insertado exitosamente"}
                });
                this.newPassenger = null;
                this.insertarPassenger = true;
                this.formPasajero.reset();
                this.formPasajero.clearValidators();
                this.formPasajero.clearAsyncValidators();
            } else {
                this.dialog.open(MensajeError, {width: "400px", data: {mensaje: response.body.msg}});
            }
        });
    }

    editPassengerTravel() {
        this.passengerTravelService.modificarPassengerTravel(this.currentPassengerTravel).subscribe(resp => {
            if (resp.body.success) {
                this.currentPassengerTravel = resp.body.elemento;
                let passengerTravel = this.dataSource.data.filter(value => this.currentPassengerTravel.passenger.id === value.passenger.id);
                if (passengerTravel.length > 0) {
                    passengerTravel[0] = this.currentPassengerTravel;
                    this.formPasajero.reset({place: null, passenger: {name: '', lastname: '', dni: ''}});
                    this.formPasajero.setErrors(null);
                }
                this.dialog.open(Information, {width: "300px", data: {mensaje: "Pasajero modificado exitosamente"}});
                this.newPassenger = null;
                this.insertarPassenger = true;
            } else {
                this.dialog.open(MensajeError, {width: "300px", data: {mensaje: resp.body.msg}});
            }
        });
    }

    ngOnInit() {
        this.routeService.listarAllRoutes().subscribe(response => {
            this.routes = response.body.elementos;
        });
        this.busService.listarAllBuss().subscribe(response => {
            this.buses = response.body.elementos;
        });
        if (this.insertar) {
            this.placeService.listarAllPlaces().subscribe(resp => {
                this.places = resp.body.elementos;
            });
        }
        this.passengerSubcription.subscribe(passenger => {
            this.finishTravel(passenger);
        });
    }

    compararRoutes(inicio: Route, fin: Route) {
        return inicio && fin && inicio.id === fin.id;
    };

    compararBuses(inicio: Bus, fin: Bus) {
        return inicio && fin && inicio.id === fin.id;
    };

    compararLugares(inicio: Place, fin: Place) {
        return inicio && fin && inicio.id === fin.id;
    };

    onNoClick(): void {
        this.dialogRef.close(false);
        this.passengerSubcription.complete();
    }

    private filterPlace(value: Route) {
        this.routeService.findOneRoutes(value.id).subscribe(resp => {
            if (resp.body.success) {
                this.places = resp.body.elemento.places;
            }
        });
    }

    editarPassenger($event: Event, element: PassengerTravel) {
        this.insertarPassenger = false;
        this.currentPassengerTravel = element;
        this.newPassenger = element.passenger;
        const valor: any = element;
        this.formPasajero.patchValue(valor);
    }

    finalizar() {
        this.dialogRef.close(this.newTravel);
    }

    private getTime(): string {
        return `${this.hour < 10 ? '0' + this.hour : this.hour}:${this.minute < 10 ? '0' + this.minute : this.minute} ${this.meridien}`;
    }

    showPicker($event, control: FormControl) {
        this.getTimeElement(control);
        let dialogRef = this.dialog.open(WTimeDialogComponent, {
            maxHeight: "300px",
            data: {
                hour: this.hour,
                minute: this.minute,
                meriden: this.meridien
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined) {
                return;
            } else if (result !== -1) {
                this.hour = result.hour;
                this.minute = result.minute;
                this.meridien = result.meriden;
                control.setValue(this.getTime());
            }
        });
        return false;
    }

    private getTimeElement(control: FormControl) {
        let time: string = control.value;
        if (time) {
            this.hour = Number.parseInt(time.substr(0, 2));
            this.minute = Number.parseInt(time.substr(3, 5));
            this.meridien = time.substr(6, 8);
        } else {
            let fecha: Date = new Date();
            this.hour = fecha.getHours();
            this.minute = fecha.getMinutes();
            // this.meridien = fecha.getTimezoneOffset();
        }
    }

    private convertDate(fecha: Date) {
        return `${fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes()}`;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
