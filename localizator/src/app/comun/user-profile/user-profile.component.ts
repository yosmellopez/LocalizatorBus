import {Component, OnInit} from '@angular/core';

declare function my_init_plugins();

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        my_init_plugins();
    }

}
