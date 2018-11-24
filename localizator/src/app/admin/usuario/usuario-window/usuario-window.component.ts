import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {UsuarioService} from "../../../services/usuario.service";
import {Rol, Usuario} from "../../../app.model";
import {RolService} from "../../../services/rol.service";

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

    constructor(public dialogRef: MatDialogRef<UsuarioWindow>, @Inject(MAT_DIALOG_DATA) {id, name, lastname, username, email, password, activated, rol}: Usuario,
                private service: UsuarioService, private rolService: RolService, private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.activated = activated;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            lastname: new FormControl(lastname, [Validators.required]),
            username: new FormControl(username, [Validators.required]),
            password: new FormControl(password),
            passwordRepeat: new FormControl(password),
            activated: new FormControl(activated),
            email: new FormControl(email, [Validators.required]),
            rol: new FormControl(rol, [Validators.required]),
        });
        if (this.insertar) {
            this.form.controls['password'].setValidators([Validators.required]);
            this.form.controls['passwordRepeat'].setValidators([Validators.required, this.noIgualPasswordRepeat.bind(this.form)]);
        }
        else {
            this.form.controls['passwordRepeat'].setValidators([this.noIgualPasswordRepeat.bind(this.form)]);
        }
    }

    ngOnInit() {
        this.rolService.listarRoles().subscribe(resp => {
            if (resp.body.success)
                this.roles = resp.body.elementos;
        });
    }


    insertarUsuario(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarUsuario(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarUsuario(this.idUser, this.form.value).subscribe(resp => {
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
}
