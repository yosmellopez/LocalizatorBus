import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

declare function my_init_plugins();

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    isLoading: boolean = false;
    email: string;
    mensaje: string;

    constructor(private account: AccountService, private router: Router) {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
        });
        this.form.controls['email'].valueChanges.subscribe(email => {
            this.email = email;
        });
    }

    ngOnInit() {
        my_init_plugins();
    }

    resetPassword() {
        this.isLoading = true;
        this.account.restorePassword(this.email).subscribe(resp => {
            this.isLoading = false;
            if (resp.body.success) {
                this.mensaje = 'Se ha enviado una dirección para su restablecimiento.';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 5000);
            } else {
                this.mensaje = resp.body.msg;
            }
        });
    }
}
