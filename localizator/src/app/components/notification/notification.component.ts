import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Notificacion, ObjectParam} from "../../app.model";
import {NotificacionService} from "../../services/notification.service";

declare function my_init_plugins();

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    notificacion: Notificacion = new Notificacion();

    constructor(private route: ActivatedRoute, private service: NotificacionService) {

    }

    ngOnInit() {
        my_init_plugins();
        this.route.data.subscribe((datos: ObjectParam<Notificacion>) => {
            this.notificacion = datos.object;
            this.service.modificarNotificacion(this.notificacion.id, this.notificacion).subscribe(resp => {
                if (resp.body.success) {
                    this.service.evento.emit(true);
                }
            });
        });
    }

}
