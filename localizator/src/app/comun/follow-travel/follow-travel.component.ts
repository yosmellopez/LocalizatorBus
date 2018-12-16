import {Component, OnInit} from '@angular/core';
import {TravelService} from "../../services/travel.service";
import {Travel} from "../../app.model";

@Component({
    selector: 'app-follow-travel',
    templateUrl: './follow-travel.component.html',
    styleUrls: ['./follow-travel.component.css']
})
export class FollowTravelComponent implements OnInit {

    travels: Travel[] = [];

    constructor(private service: TravelService) {
    }

    ngOnInit() {
        this.service.listarTravelsOnCurrentDate().subscribe(resp => {
            if (resp.body.success) {
                this.travels = resp.body.elementos;
            }
        });
    }

}
