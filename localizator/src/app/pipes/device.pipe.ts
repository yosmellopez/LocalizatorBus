import {Pipe, PipeTransform} from '@angular/core';
import {Device} from "../app.model";

@Pipe({name: 'device'})
export class DevicePipe implements PipeTransform {

    transform(value: Device, args?: any): any {
        if (value)
            return value.name;
        return "";
    }

}
