import {Component, OnInit} from '@angular/core';

declare function my_init_plugins();

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        my_init_plugins();
    }

}
