import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Bus, Company, Device} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {BusService} from "../../../services/bus.service";
import {CompanyService} from "../../../services/company.service";
import {Principal} from "../../../services/principal.service";
import {DeviceService} from "../../../services/device.service";

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
    companies: Company[] = [];
    devices: Device[] = [];

    constructor(public dialogRef: MatDialogRef<BusWindow>, @Inject(MAT_DIALOG_DATA) {id, code, siteNumber, number, company, device}: Bus,
                private service: BusService, private deviceService: DeviceService, private dialog: MatDialog, private companyService: CompanyService, private principal: Principal) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            code: new FormControl(code, [Validators.required]),
            number: new FormControl(number, [Validators.required]),
            siteNumber: new FormControl(siteNumber, [Validators.required]),
            company: new FormControl(company, [Validators.required]),
            device: new FormControl(device, [Validators.required]),
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
        this.companyService.listarAllCompanys().subscribe(resp => {
            if (resp.body.success) {
                this.companies = resp.body.elementos;
                this.principal.hasAuthority("Usuario").then(isUser => {
                    if (isUser) {
                        let company = this.companies.find((value: Company, index: number) => index == 0);
                        this.form.controls['company'].setValue(company);
                    }
                });
            }
        });
        this.deviceService.listarAllDevices().subscribe(resp => {
            if (resp.body.success) {
                this.devices = resp.body.elementos;
            }
        });

    }

    compararCompanies(inicio: Company, fin: Company) {
        return inicio && fin && inicio.id === fin.id;
    }

    compararDevices(inicio: Device, fin: Device) {
        return inicio && fin && inicio.deviceId === fin.deviceId;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
