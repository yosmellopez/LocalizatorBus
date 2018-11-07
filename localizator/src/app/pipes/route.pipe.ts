import {Pipe, PipeTransform} from '@angular/core';
import {Route} from "../app.model";

@Pipe({
    name: 'route'
})
export class RoutePipe implements PipeTransform {

    transform(value: Route, args?: any): any {
        return value.code + ' - ' + value.origin.name + ' - ' + value.destiny.name;
    }

}
