import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {SERVER_API_URL} from "../app.constant";
import {AppResponse, Company, ResponseApp, Respuesta} from "../app.model";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CompanyService {

    private companyUrl = SERVER_API_URL + "api/company";

    constructor(private http: HttpClient) {
    }

    listarCompanys(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Company>> {
        let constUrl = `${this.companyUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Company>>(constUrl, {observe: "response"});
    }

    listarAllCompanys(): Observable<Respuesta<Company>> {
        let constUrl = `${this.companyUrl}/all`;
        return this.http.get<AppResponse<Company>>(constUrl, {observe: "response"});
    }

    insertarCompany(company: Company): Observable<Respuesta<Company>> {
        return this.http.post<AppResponse<Company>>(this.companyUrl, company, {observe: "response"});
    }

    modificarCompany(id: number, company: Company): Observable<Respuesta<Company>> {
        company.id = id;
        return this.http.put<AppResponse<Company>>(this.companyUrl + "/" + id, company, {observe: "response"});
    }

    eliminarCompany(id: number): Observable<Respuesta<ResponseApp>> {
        return this.http.delete<ResponseApp>(this.companyUrl + "/" + id, {observe: "response"});
    }
}
