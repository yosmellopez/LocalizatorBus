import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {AppService} from "../services/app.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    expandido: Observable<boolean> = new Observable();

    constructor(private appService: AppService) {
    }

    ngOnInit() {
        this.appService.pageEvent.subscribe(value => {
            this.expandido = of(value);
        })
    }

}
