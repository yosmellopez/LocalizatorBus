import {Component, OnInit} from '@angular/core';
import {NotificacionService} from "../../services/notification.service";
import {Observable, of} from "rxjs";

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
    cantidadNotificaciones: Observable<number> = new Observable();

    constructor(private notificationService: NotificacionService) {
    }

    ngOnInit() {
        this.notificationService.notificationEmitter.subscribe(cantidad => {
            this.cantidadNotificaciones = of(cantidad);
        });
    }

}
