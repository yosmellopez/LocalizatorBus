import {Pipe, PipeTransform} from '@angular/core';
import {Passenger} from "../app.model";

@Pipe({
    name: 'dni'
})
export class DniPipe implements PipeTransform {

    transform(value: Passenger, args?: any): any {
        if (value)
            return value.dni;
        return "";
    }

}
