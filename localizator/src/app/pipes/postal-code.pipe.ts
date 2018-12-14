import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'postalCode'})
export class PostalCodePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return value ? value : "Sin codigo postal";
    }

}
