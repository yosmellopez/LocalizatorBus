import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    pageEvent: EventEmitter<boolean> = new EventEmitter();

    constructor() {
    }
}
