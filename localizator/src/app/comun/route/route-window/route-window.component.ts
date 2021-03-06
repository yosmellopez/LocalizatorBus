import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {Place, Route} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {RouteService} from "../../../services/route.service";
import {PlaceService} from "../../../services/place.service";

@Component({
    selector: 'app-route-window',
    templateUrl: './route-window.component.html',
    styleUrls: ['./route-window.component.css']
})
export class RouteWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    form: FormGroup;
    lugares: Place[];
    lugaresSeleccionados: Place[] = [];
    panelOpenState = false;

    constructor(public dialogRef: MatDialogRef<RouteWindow>, @Inject(MAT_DIALOG_DATA) {id, code, origin, destiny, places}: Route,
                private service: RouteService, private placeService: PlaceService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            code: new FormControl(code, [Validators.required]),
            origin: new FormControl(origin, [Validators.required]),
            destiny: new FormControl(destiny, [Validators.required]),
            places: new FormControl(places, []),
        });
    }

    insertarRoute(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarRoute(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarRoute(this.idUser, this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            }
        }
    }

    ngOnInit() {
        this.placeService.listarAllPlaces().subscribe(response => {
            this.lugares = response.body.elementos;
        });
    }

    mostrarElementos(cantidad: number, places: Place[]): string {
        let cadena: string = "";
        let tam: number = places.length;
        for (let i: number = 0; i < cantidad && i < tam; i++) {
            cadena += (i != 0 ? ', ' : '') + places[i].name;
        }
        return cadena;
    }

    compararLugares(inicio: Place, fin: Place) {
        return inicio && fin && inicio.id === fin.id;
    };

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
