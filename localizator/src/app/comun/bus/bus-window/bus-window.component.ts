import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Bus} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {BusService} from "../../../services/bus.service";

@Component({
    selector: 'app-bus-window',
    templateUrl: './bus-window.component.html',
    styleUrls: ['./bus-window.component.css']
})
export class BusWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<BusWindow>, @Inject(MAT_DIALOG_DATA) {id, code, siteNumber, number}: Bus,
                private service: BusService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            code: new FormControl(code, [Validators.required]),
            number: new FormControl(number, [Validators.required]),
            siteNumber: new FormControl(siteNumber, [Validators.required]),
        });
    }

    insertarBus(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarBus(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarBus(this.idUser, this.form.value).subscribe(resp => {
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
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
