import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {AngularMaterialModule} from "../material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {Confirm, Information, MensajeError} from "./window.mensaje";
import {UploadWindow} from "./upload-window";

@NgModule({
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
    ],
    declarations: [Information, MensajeError, Confirm, UploadWindow],
    entryComponents: [Information, MensajeError, Confirm, UploadWindow]
})
export class MensajeModule {
}
