import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {Usuario} from "../../app.model";
import {Principal} from "../../services/principal.service";

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    usuario: Usuario = new Usuario();

    constructor(private principal: Principal) {
    }

    ngOnInit() {
        this.principal.identity().then(usuario => this.usuario = usuario);
    }

}
