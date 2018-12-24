import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators} from "@angular/forms";
import {
    ErrorStateMatcher,
    MAT_DATE_FORMATS,
    MAT_DIALOG_DATA, MatAutocompleteSelectedEvent,
    MatDialog,
    MatDialogRef,
    MatSnackBar,
    MatStepper,
    MatTableDataSource
} from "@angular/material";
import {Bus, Passenger, PassengerTravel, Place, Route, Travel} from "../../../app.model";
import {Confirm, Information, MensajeError, MensajeToast} from "../../../mensaje/window.mensaje";
import {TravelService} from "../../../services/travel.service";
import {RouteService} from "../../../services/route.service";
import {BusService} from "../../../services/bus.service";
import {PassengerService} from "../../../services/passenger.service";
import {PlaceService} from "../../../services/place.service";
import {PassengerTravelService} from "../../../services/passenger-travel.service";
import {forkJoin, Subject} from "rxjs/index";
import {WTimeDialogComponent} from "../../../components/time-control/w-time-dialog.component";
import {DatePipe} from "@angular/common";
import {PlaceWindow} from "../../place/place-window/place-window.component";
import {SelectionModel} from "@angular/cdk/collections";

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
    pasajeroInsertado: boolean = false;
    formViaje: FormGroup;
    formPasajero: FormGroup;
    routes: Route[];
    buses: Bus[];
    places: Place[];
    @ViewChild("dniInput") dniInput: ElementRef;
    passengers: Passenger[] = [];
    filteredPassengers: Passenger[] = [];
    step = 0;
    insertarPassenger: boolean = true;
    minTravelDate: Date = new Date();
    minArriveDate: Date = new Date();
    displayedColumns: string[] = ['seleccionado', 'name', 'lastname', 'dni', 'place', 'acciones'];
    datos: Array<PassengerTravel> = new Array<PassengerTravel>();
    dataSource = new MatTableDataSource<PassengerTravel>();
    selection = new SelectionModel<PassengerTravel>(true, []);
    newTravel: Travel;
    newPassenger: Passenger;
    currentPlace: Place;
    selectedRoute: Route;
    matcher: ErrorStateMatcher = new ErrorStateMatcher();
    currentPassengerTravel: PassengerTravel;
    passengerSubcription: Subject<Passenger> = new Subject<Passenger>();
    huboCambios: boolean = false;
    @ViewChild(MatStepper) steeper: MatStepper;
    private hour = 10;
    private minute = 25;
    private meridiem = 'PM';

    constructor(public dialogRef: MatDialogRef<TravelWindow>, @Inject(MAT_DIALOG_DATA) {id, active, travelDate, arriveDate, bus, route, passengerTravels, expandido, arriveTime, travelTime, late}: Travel,
                private service: TravelService, private routeService: RouteService, private busService: BusService, private passengerService: PassengerService, private datePipe: DatePipe,
                private placeService: PlaceService, private passengerTravelService: PassengerTravelService, private dialog: MatDialog, private snackBar: MatSnackBar) {
        if (id) {
            this.insertar = false;
            this.travelInsertado = true;
            this.selectedRoute = route;
            this.places = route.places;
            this.newTravel = {
                id: id, active: active, route: route, travelDate: travelDate, arriveDate: arriveDate, bus: bus, late: late,
                passengerTravels: passengerTravels, expandido: expandido, travelTime: travelTime, arriveTime: arriveTime
            };
            this.minTravelDate = new Date(travelDate);
            this.minArriveDate = new Date(arriveDate);
            passengerTravels.forEach(passengerTravel => {
                this.datos.push(passengerTravel);
            });
        }
        this.idTravel = id;
        this.formViaje = new FormGroup({
            active: new FormControl(active),
            late: new FormControl(late),
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
            if (this.newPassenger && this.pasajeroInsertado) {
                this.currentPlace = this.formPasajero.controls['place'].value;
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
                        if (!resp.body.existe) {
                            this.passengers.push(this.newPassenger);
                        }
                        this.huboCambios = true;
                        this.passengerSubcription.next(this.newPassenger);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: resp.body.msg}});
                    }
                });
            }
            this.filteredPassengers = this.passengers;
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
                this.pasajeroInsertado = true;
                this.formPasajero.reset();
            } else {
                this.dialog.open(MensajeError, {width: "400px", data: {mensaje: response.body.msg}});
                this.pasajeroInsertado = false;
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
                this.dialog.open(Information, {width: "350px", data: {mensaje: "Pasajero modificado exitosamente"}});
                this.newPassenger = null;
                this.insertarPassenger = true;
                this.huboCambios = true;
            } else {
                this.dialog.open(MensajeError, {width: "350px", data: {mensaje: resp.body.msg}});
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
        this.passengerService.listarAllPassengers().subscribe(resp => {
            if (resp.body.success)
                this.passengers = resp.body.elementos;
            this.filteredPassengers = this.passengers;
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

    seleccionarPassenger(event: MatAutocompleteSelectedEvent) {
        let elementos: Passenger[] = this.passengers.filter(option => option.dni === event.option.value);
        if (elementos.length != 0) {
            this.formPasajero.get("passenger").patchValue(elementos[0]);
        }
    }

    filterDnis() {
        let dni = this.dniInput.nativeElement.value;
        this.filteredPassengers = this.passengers.filter(passenger => passenger.dni.startsWith(dni));
    }

    onNoClick(): void {
        if (this.newTravel && this.insertar)
            this.service.finalizeTravel(this.newTravel.id).subscribe(resp => {
                this.dialogRef.close(resp);
            });
        else {
            if (this.huboCambios) {
                this.dialogRef.close(this.newTravel);
            } else {
                this.dialogRef.close(false);
                this.passengerSubcription.complete();
            }
        }
    }

    private filterPlace(value: Route) {
        this.selectedRoute = value;
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
        this.service.finalizeTravel(this.newTravel.id).subscribe(resp => {
            this.dialogRef.close(resp);
        });
    }

    private getTime(): string {
        return `${this.hour < 10 ? '0' + this.hour : this.hour}:${this.minute < 10 ? '0' + this.minute : this.minute} ${this.meridiem}`;
    }

    showPicker($event, control: AbstractControl) {
        this.getTimeElement(control);
        let dialogRef = this.dialog.open(WTimeDialogComponent, {
            maxHeight: "300px",
            data: {hour: this.hour, minute: this.minute, meriden: this.meridiem}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined) {
                return;
            } else if (result !== -1) {
                this.hour = result.hour;
                this.minute = result.minute;
                this.meridiem = result.meriden;
                control.setValue(this.getTime());
            }
        });
        return false;
    }

    private getTimeElement(control: AbstractControl) {
        let time: string = control.value;
        if (time) {
            this.hour = Number.parseInt(time.substr(0, 2));
            this.minute = Number.parseInt(time.substr(3, 5));
            this.meridiem = time.substr(6, 8);
        } else {
            let fecha: Date = new Date();
            this.hour = fecha.getHours();
            this.minute = fecha.getMinutes();
            // this.meridiem = fecha.getTimezoneOffset();
        }
    }

    private convertDate(fecha: Date) {
        let meridiano: string = this.datePipe.transform(fecha, "a");
        return `${fecha.getHours() < 10 ? '0' + fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0' + fecha.getMinutes() : fecha.getMinutes()} ${meridiano}`;
    }

    findPassenger(value: number) {
        this.passengerService.buscarPassenger(value).subscribe(resp => {
            if (resp.body.success) {
                this.formPasajero.get("passenger").patchValue(resp.body.elemento);
            } else {
                this.snackBar.openFromComponent(MensajeToast, {
                    duration: 5000,
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    panelClass: ['failure-snackbar', 'mat-elevation-z5'],
                    data: {title: "Pasajero no encontrado", description: resp.body.msg}
                });
            }
        });
    }

    newPlace() {
        let placedialogRef = this.dialog.open(PlaceWindow, {
            width: '700px', data: new Place()
        });
        placedialogRef.afterClosed().subscribe(respuesta => {
            if (respuesta && respuesta.success) {
                this.places.push(respuesta.elemento);
                this.routeService.addPlaceToRoute(this.selectedRoute.id, respuesta.elemento).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {width: '350px', data: {mensaje: 'Lugar añadido a la ruta exitosmente'}});
                    }
                });
            }
        });
    }

    eliminarPassengersTravel(event: Event): void {
        event.stopPropagation();
        let passegersTravel = this.selection.selected;
        if (passegersTravel.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los pasajeros: <br>- ' + passegersTravel.map(passengerTravel => `${passengerTravel.passenger.name} ${passengerTravel.passenger.lastname}`).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    passegersTravel.forEach(passenger => {
                        allProgressObservables.push(this.passengerTravelService.eliminarPassengerTravel(passenger.passenger.id, this.newTravel.id));
                    });
                    forkJoin(allProgressObservables).subscribe(response => {
                        let completo = true;
                        response.forEach(resp => {
                            if (!resp.body.success) {
                                completo = false;
                            }
                        });
                        todos.next(completo);
                    });
                    todos.subscribe(value => {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: value ? 'Se ha eliminado todos los pasajeros.' : 'No se eliminaron correctamente todos los pasajeros'}
                        });
                        this.selection.clear();
                        this.passengerTravelService.listarPassengerTravelByTravel(this.newTravel.id).subscribe(resp => {
                            if (resp.body.success) {
                                this.dataSource = new MatTableDataSource(resp.body.elementos);
                                this.newTravel.passengerTravels = resp.body.elementos;
                                this.huboCambios = true;
                            }
                        });
                    });
                }
            });
        }
    }

    getTotal() {
        return this.dataSource.data.length;
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
