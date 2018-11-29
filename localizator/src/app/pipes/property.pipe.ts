import {Pipe, PipeTransform} from '@angular/core';
import {Observable, of} from "rxjs";

@Pipe({name: 'property'})
export class PropertyPipe implements PipeTransform {

    transform(value: any, args?: any): Observable<string> {
        if (value) {
            return of(value[args]);
        }
        return of("");
    }

}
