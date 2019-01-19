import {Injectable, Type} from '@angular/core';
import {Posicion} from '../app.model';

@Injectable({providedIn: 'root'})
export class ModalPositionCache {
    private _cache = new Map<Type<any>, Posicion>();

    set(dialog: Type<any>, position: Posicion) {
        this._cache.set(dialog, position);
    }

    get(dialog: Type<any>): Posicion | null {
        return this._cache.get(dialog);
    }
}
