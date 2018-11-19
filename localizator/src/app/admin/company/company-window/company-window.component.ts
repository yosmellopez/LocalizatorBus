import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Company} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {CompanyService} from "../../../services/company.service";

@Component({
    selector: 'app-company-window',
    templateUrl: './company-window.component.html',
    styleUrls: ['./company-window.component.css']
})
export class CompanyWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<CompanyWindow>, @Inject(MAT_DIALOG_DATA) {id, name, busCount}: Company,
                private service: CompanyService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            busCount: new FormControl(busCount, [Validators.required]),
        });
    }

    insertarCompany(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarCompany(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarCompany(this.idUser, this.form.value).subscribe(resp => {
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
