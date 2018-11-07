import {Pipe, PipeTransform} from '@angular/core';
import {Usuario} from "../app.model";

@Pipe({
    name: 'usuario'
})
export class UsuarioPipe implements PipeTransform {

    transform(value: Usuario, args?: any): any {
        return value == null ? "" : value.name + " " + value.lastname;
    }

}
