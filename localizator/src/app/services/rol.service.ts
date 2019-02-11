import {EventEmitter, Injectable} from '@angular/core';
import {SERVER_API_URL} from '../app.constant';
import {Observable, of} from 'rxjs/index';
import {AppResponse, Company, Respuesta, Rol} from '../app.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

type ListResponse = Respuesta<Rol>;

@Injectable({
    providedIn: 'root'
})
export class RolService extends EventEmitter<ListResponse> {
    private rolUrl = SERVER_API_URL + 'api/roles';
    private response: ListResponse;

    constructor(private  http: HttpClient) {
        super();
    }

    listarRoles() {
        if (this.response) {
            this.emit(this.response)
        } else {
            this.http.get<AppResponse<Rol>>(this.rolUrl, {observe: 'response'}).subscribe(resp => {
                this.response = resp;
                this.emit(this.response);
            });
        }
    }
}
