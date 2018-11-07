import {NgModule} from "@angular/core";
import {PasswordLenghtComponent} from "./password-lenght.component";
import {CommonModule} from "@angular/common";
import {AngularMaterialModule} from "../material.module";

@NgModule({
    imports: [CommonModule, AngularMaterialModule],
    exports: [PasswordLenghtComponent],
    declarations: [PasswordLenghtComponent],
    providers: []
})
export class PasswordLenghtModule {

}
