import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Travel} from "../../app.model";

declare var google;

@Component({
    selector: 'app-tab-map',
    templateUrl: './tab-map.component.html',
    styleUrls: ['./tab-map.component.css']
})
export class TabMapComponent implements OnInit, AfterViewInit {
    map = null;
    marker = null;
    infoWindow = null;
    @ViewChild("mapa") public mapa: ElementRef;
    @Input("travel") travel: Travel;

    constructor() {
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        let me = this;
        let bus = this.travel.bus;
        let location = new google.maps.LatLng(bus.device.latitude, bus.device.longitude);
        let mapProp = {center: location, zoom: 13, mapTypeId: google.maps.MapTypeId.ROADMAP};
        this.map = new google.maps.Map(this.mapa.nativeElement, mapProp);
        this.infoWindow = new google.maps.InfoWindow();
        this.marker = new google.maps.Marker({
            map: this.map,
            position: location,
            draggable: true,
            title: "Mi Ubicación"
        });
        google.maps.event.addListener(this.marker, 'dragend', function (evt) {
            me.infoWindow.open(me.map, me.marker);
        });
    }

}
