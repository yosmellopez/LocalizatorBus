import {Pipe, PipeTransform} from '@angular/core';
import {Place} from "../app.model";

@Pipe({
    name: 'place'
})
export class PlacePipe implements PipeTransform {

    transform(value: Place, args?: any): any {
        if (value)
            return value.name;
        return "";
    }

}
