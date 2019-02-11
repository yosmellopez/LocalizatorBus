import {EventEmitter, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {SERVER_API_URL} from '../app.constant';
import {AppResponse, Company, ResponseApp, Respuesta} from '../app.model';
import {HttpClient} from '@angular/common/http';

type ListResponse = Respuesta<Company>;

@Injectable({providedIn: 'root'})
export class CompanyService extends EventEmitter<ListResponse> {

    private companyUrl = SERVER_API_URL + 'api/company';
    private response: ListResponse;

    constructor(private http: HttpClient) {
        super();
    }

    listarCompanys(sort: string, order: string, page: number, limit: number): Observable<ListResponse> {
        let constUrl = `${this.companyUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Company>>(constUrl, {observe: 'response'});
    }

    listarAllCompanys() {
        if (this.response) {
            this.emit(this.response);
        } else {
            let constUrl = `${this.companyUrl}/all`;
            this.http.get<AppResponse<Company>>(constUrl, {observe: 'response'}).subscribe(resp => {
                this.response = resp;
                this.emit(this.response);
            });
        }
    }

    insertarCompany(company: Company): Observable<ListResponse> {
        return this.http.post<AppResponse<Company>>(this.companyUrl, company, {observe: 'response'});
    }

    modificarCompany(id: number, company: Company): Observable<ListResponse> {
        company.id = id;
        return this.http.put<AppResponse<Company>>(this.companyUrl + '/' + id, company, {observe: 'response'});
    }

    eliminarCompany(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.companyUrl + '/' + id, {observe: 'response'});
    }
}
