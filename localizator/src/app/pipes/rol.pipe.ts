import {Pipe, PipeTransform} from '@angular/core';
import {Rol} from "../app.model";

@Pipe({
    name: 'rol'
})
export class RolPipe implements PipeTransform {

    transform(value: Rol, args?: any): any {
        return value == null ? "" : value.name;
    }

}
