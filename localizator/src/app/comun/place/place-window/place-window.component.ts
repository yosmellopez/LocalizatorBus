import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Place} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {PlaceService} from "../../../services/place.service";

@Component({
    selector: 'app-place-window',
    templateUrl: './place-window.component.html',
    styleUrls: ['./place-window.component.css']
})
export class PlaceWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<PlaceWindow>, @Inject(MAT_DIALOG_DATA) {id, name}: Place,
                private service: PlaceService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
        });
    }

    insertarPlace(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarPlace(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarPlace(this.idUser, this.form.value).subscribe(resp => {
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
