import {Pipe, PipeTransform} from '@angular/core';
import {Company} from "../app.model";

@Pipe({
    name: 'company'
})
export class CompanyPipe implements PipeTransform {

    transform(value: Company, args?: any): any {
        if (value)
            return value.name;
        return "";
    }

}
