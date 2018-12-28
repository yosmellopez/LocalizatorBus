import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Device} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {DeviceService} from "../../../services/device.service";

@Component({
    selector: 'app-device-window',
    templateUrl: './device-window.component.html',
    styleUrls: ['./device-window.component.css']
})
export class DeviceWindow implements OnInit {

    isLoadingResults = false;
    idDevice: number;
    insertar = true;
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<DeviceWindow>, @Inject(MAT_DIALOG_DATA) {id, name, uniqueId, phone, disabled}: Device,
                private service: DeviceService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idDevice = id;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            uniqueId: new FormControl(uniqueId, [Validators.required]),
            phone: new FormControl(phone, [Validators.required, Validators.minLength(8)]),
            disabled: new FormControl(disabled, [Validators.required]),
        });
    }

    insertarDevice(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarDevice(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarDevice(this.idDevice, this.form.value).subscribe(resp => {
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
