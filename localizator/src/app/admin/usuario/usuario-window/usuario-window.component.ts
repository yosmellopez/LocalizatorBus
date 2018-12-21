import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {UsuarioService} from "../../../services/usuario.service";
import {Company, Rol, Usuario} from "../../../app.model";
import {RolService} from "../../../services/rol.service";
import {CompanyService} from "../../../services/company.service";

@Component({
    selector: 'app-usuario-window',
    templateUrl: './usuario-window.component.html',
    styleUrls: ['./usuario-window.component.css']
})
export class UsuarioWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    activated: boolean;
    form: FormGroup;
    roles: Rol[];
    companies: Company[];
    isAdmin: boolean = true;
    isEmpty: boolean = false;

    constructor(public dialogRef: MatDialogRef<UsuarioWindow>, @Inject(MAT_DIALOG_DATA) {id, name, lastname, username, email, password, activated, rol, companies}: Usuario,
                private service: UsuarioService, private rolService: RolService, private dialog: MatDialog, private companyService: CompanyService) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.activated = activated;
        this.isAdmin = rol ? rol.id === 1 : true;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            lastname: new FormControl(lastname, [Validators.required]),
            username: new FormControl(username, [Validators.required]),
            password: new FormControl(password),
            passwordRepeat: new FormControl(password),
            activated: new FormControl(activated),
            email: new FormControl(email, [Validators.required, Validators.email]),
            rol: new FormControl(rol, [Validators.required]),
            company: new FormControl(companies.pop(), [Validators.required]),
        });
        if (this.insertar) {
            this.form.controls['password'].setValidators([Validators.required]);
            this.form.controls['passwordRepeat'].setValidators([Validators.required, this.noIgualPasswordRepeat.bind(this.form)]);
            this.form.controls['company'].disable();
        }
        else {
            this.form.controls['passwordRepeat'].setValidators([this.noIgualPasswordRepeat.bind(this.form)]);
            if (this.isAdmin)
                this.form.controls['company'].disable();
        }
        this.form.controls['rol'].valueChanges.subscribe((value: Rol) => {
            this.isAdmin = value.id === 1;
            if (!this.isAdmin) {
                this.form.controls['company'].enable();
            } else
                this.form.controls['company'].disable();
        });
    }

    ngOnInit() {
        this.rolService.listarRoles().subscribe(resp => {
            if (resp.body.success)
                this.roles = resp.body.elementos;
        });
        this.companyService.listarAllCompanys().subscribe(resp => {
            if (resp.body.success)
                this.companies = resp.body.elementos;
        });
    }


    insertarUsuario(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            let usuario: Usuario = this.form.value;
            usuario.companies = [];
            let company: Company = this.form.controls['company'].value;
            if (company) {
                usuario.companies.push(company);
            }
            if (this.insertar) {
                this.service.insertarUsuario(usuario).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarUsuario(this.idUser, usuario).subscribe(resp => {
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

    noIgualPasswordRepeat(control: FormControl) {
        let formulario: any = this;
        if (formulario.controls['password'].value !== control.value) {
            return {noigual: true};
        }
        return null;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    compararRoles(inicio: Rol, fin: Rol) {
        return inicio && fin && inicio.id === fin.id;
    }

    compararCompanies(inicio: Company, fin: Company) {
        return inicio && fin && inicio.id === fin.id;
    }

}
