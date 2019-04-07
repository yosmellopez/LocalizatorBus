import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Principal } from '../../services/principal.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

declare function my_init_plugins();

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', './style.css']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    mensaje: string;
    isLoading: boolean = false;
    @ViewChild('password') passwordField: ElementRef;

    constructor(private accountService: AccountService, private principal: Principal, private router: Router) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        my_init_plugins();
        localStorage.removeItem('user_token');
    }

    iniciarSesion() {
        if (this.form.valid) {
            this.isLoading = true;
            this.accountService.iniciarSesion(this.form.value).pipe(catchError((resp) => {
                this.isLoading = false;
                this.mensaje = resp.status == 0 ? 'No se ha podido conectar al servidor' : resp.message;
                return [];
            })).subscribe(response => {
                if (response.body.success) {
                    const usuario = response.body.elemento;
                    localStorage.setItem('user_token', response.headers.get('Authorization'));
                    localStorage.setItem('username', usuario.username);
                    this.principal.authenticate(usuario);
                    this.principal.hasAuthority('Administrador').then(has => {
                        if (has) {
                            localStorage.setItem('isAdmin', 'true');
                            this.router.navigate(['/admin/usuario-list']);
                        } else {
                            localStorage.setItem('isAdmin', 'false');
                            this.router.navigate(['/user/travel-list']);
                        }
                    });
                } else {
                    this.isLoading = false;
                    this.mensaje = response.body.msg;
                    this.passwordField.nativeElement.focus();
                    // this.form.controls['password'].setValue("");
                }
            });
        }
    }
}
