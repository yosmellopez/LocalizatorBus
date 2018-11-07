import {Pipe, PipeTransform} from '@angular/core';
import {Passenger} from "../app.model";

@Pipe({
    name: 'passenger'
})
export class PassengerPipe implements PipeTransform {

    transform(value: Passenger, args?: any): any {
        if (value)
            return value.name + " " + value.lastname;
        return "";
    }

}
