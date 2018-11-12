import {EventEmitter, Injectable} from '@angular/core';
import {Title} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    titleEmitter: EventEmitter<Title[]> = new EventEmitter<Title[]>();

    constructor() {
    }

    emmit(titulos: Title[]) {
        this.titleEmitter.emit(titulos);
    }
}
