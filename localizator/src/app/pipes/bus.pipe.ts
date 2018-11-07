import { Pipe, PipeTransform } from '@angular/core';
import {Bus} from "../app.model";

@Pipe({
  name: 'bus'
})
export class BusPipe implements PipeTransform {

  transform(value: Bus, args?: any): any {
    return value.code;
  }

}
