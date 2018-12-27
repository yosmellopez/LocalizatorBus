import {EventEmitter, Injectable} from '@angular/core';
import {Titulo} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    titleEmitter: EventEmitter<Titulo[]> = new EventEmitter<Titulo[]>();
    pageTitleEmitter: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    emmit(titulos: Titulo[], pageTitle: string) {
        this.titleEmitter.emit(titulos);
        this.pageTitleEmitter.emit(pageTitle);
    }
}
