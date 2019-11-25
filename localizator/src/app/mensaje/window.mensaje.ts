import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import {Mensaje} from "../app.model";

@Component({
    selector: 'confirm-mensaje',
    templateUrl: './confirm.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class Confirm {
    accion: string = "Eliminar";

    constructor(public dialogRef: MatDialogRef<Confirm>, @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data.accion) {
            this.accion = data.accion;
        }
    }

    confirmar(confirm: boolean): void {
        this.dialogRef.close(confirm);
    }
}

@Component({
    selector: 'information-mensaje',
    templateUrl: './information.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class Information {
    constructor(public dialogRef: MatDialogRef<Information>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    cerrarDialog(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'error-mensaje',
    templateUrl: './error.message.html',
    styleUrls: ['./mensaje.component.css'],
})
export class MensajeError {
    constructor(public dialogRef: MatDialogRef<MensajeError>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    cerrarDialog(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'mensaje-toast',
    templateUrl: './mensaje.toast.html',
    styleUrls: ['./mensaje.component.css'],
})
export class MensajeToast {
    mensaje: Mensaje;
    success: boolean = true;

    constructor(public snackbarRef: MatSnackBarRef<MensajeToast>, @Inject(MAT_SNACK_BAR_DATA) mensaje: Mensaje) {
        this.mensaje = mensaje;
    }

    cerrarSnackbar() {
        this.snackbarRef.dismiss();
    }
}
