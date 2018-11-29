import {EventEmitter, Injectable} from '@angular/core';
import {Title} from "../app.model";

@Injectable({
    providedIn: 'root'
})
export class TitleService {
    titleEmitter: EventEmitter<Title[]> = new EventEmitter<Title[]>();
    pageTitleEmitter: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    emmit(titulos: Title[], pageTitle: string) {
        this.titleEmitter.emit(titulos);
        this.pageTitleEmitter.emit(pageTitle);
    }
}
