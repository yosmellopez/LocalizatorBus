import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {AppResponse, Respuesta, Usuario} from "../app.model";
import {Observable} from "rxjs/index";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    loginUrl = SERVER_API_URL + "api/auth/login";
    private usuarioUrl = SERVER_API_URL + "api/usuario";

    constructor(private http: HttpClient) {
    }

    listarUsuarios(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Usuario>> {
        let constUrl = `${this.usuarioUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Usuario>>(constUrl, {observe: "response"});
    }

    insertarUsuario(usuario: Usuario): Observable<Respuesta<Usuario>> {
        usuario.language = localStorage.getItem("lang") || "es";
        return this.http.post<AppResponse<Usuario>>(this.usuarioUrl, usuario, {observe: "response"});
    }

    modificarUsuario(id: number, usuario: Usuario): Observable<Respuesta<Usuario>> {
        usuario.id = id;
        usuario.language = localStorage.getItem("lang") || "es";
        return this.http.put<AppResponse<Usuario>>(this.usuarioUrl + "/" + id, usuario, {observe: "response",});
    }

    eliminarUsuario(id: number): Observable<Respuesta<Usuario>> {
        return this.http.delete<AppResponse<Usuario>>(this.usuarioUrl + "/" + id, {observe: "response",});
    }
}
