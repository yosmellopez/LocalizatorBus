import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../services/account.service";
import {Principal} from "../../services/principal.service";
import {Router} from "@angular/router";

declare function my_init_plugins();

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', './style.css']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    mensaje: string;

    constructor(private accoutService: AccountService, private principal: Principal, private router: Router) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        my_init_plugins();
        localStorage.removeItem("user_token");
    }

    iniciarSesion() {
        if (this.form.valid) {
            this.accoutService.iniciarSesion(this.form.value).subscribe(response => {
                if (response.body.success) {
                    const usuario = response.body.elemento;
                    localStorage.setItem("user_token", response.headers.get("Authorization"));
                    localStorage.setItem("username", usuario.username);
                    this.principal.authenticate(usuario);
                    this.principal.hasAuthority("Admin").then(has => {
                        if (has) {
                            localStorage.setItem("isAdmin", "true");
                            this.router.navigate(["/admin/usuario-list"]);
                        } else {
                            localStorage.setItem("isAdmin", "false");
                            this.router.navigate(["/travel-list"]);
                        }
                    });
                } else {
                    this.mensaje = response.body.msg;
                    this.form.controls['password'].setValue("");
                }
            });
        }
    }
}
