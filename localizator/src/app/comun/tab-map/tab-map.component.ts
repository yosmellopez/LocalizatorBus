import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DevicePosition, TraccarDevice, Travel} from "../../app.model";
import {TRACCAR_WEBSOCKET_API_URL} from "../../app.constant";

declare var google;
declare var ol;

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
    devicePositions: DevicePosition[] = [];
    devices: TraccarDevice[] = [];
    device: TraccarDevice;

    constructor() {
    }

    ngOnInit(): void {
        let socket = new WebSocket(TRACCAR_WEBSOCKET_API_URL);
        socket.onmessage = this.onReceiveNotification;
    }

    ngAfterViewInit(): void {
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
        // google.maps.event.addListener(this.marker, 'dragend', function (evt) {
        //     me.infoWindow.open(me.map, me.marker);
        // });
        // this.inipTraccarMap();
    }

    private onReceiveNotification = (event) => {
        let datos = JSON.parse(event.data);
        if (datos.positions) {
            this.devicePositions = datos.positions;
            if (this.device) {
                let filteredPositions = this.devicePositions.filter(value => value.deviceId == this.device.id);
                if (filteredPositions.length !== 0) {
                    let devicePosition = filteredPositions[0];
                    let location = new google.maps.LatLng(devicePosition.latitude, devicePosition.longitude);
                    this.map.setCenter(location);
                    this.marker.setPosition(location);
                }
            }
        }
        if (datos.devices) {
            this.devices = datos.devices;
            let traccarDevices = this.devices.filter(value => value.uniqueId == this.travel.bus.device.uniqueId);
            if (traccarDevices.length !== 0) {
                this.device = traccarDevices[0];
            }
        }
    }

    inipTraccarMap() {
        let me = this;
        let url = "http://localhost:8082";
        let token = (window.location.search.match(/token=([^&#]+)/) || [])[1];
        let style = function (label) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: 'teal'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 2
                    }),
                    radius: 7
                }),
                text: new ol.style.Text({
                    text: label,
                    fill: new ol.style.Fill({
                        color: 'black'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    }),
                    font: 'bold 12px sans-serif',
                    offsetY: -16
                })
            });
        };
        let source = new ol.source.Vector();
        let markers = {};
        let map = new ol.Map({
            layers: [new ol.layer.Tile({source: new ol.source.OSM()}),
                new ol.layer.Vector({source: source})
            ],
            target: "map",
            view: new ol.View({
                center: ol.proj.fromLonLat([0, 0]),
                zoom: 2
            })
        });

        let ajax = function (method, url, callback) {
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open(method, url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    callback(JSON.parse(xhr.responseText));
                }
            };
            if (method == 'POST') {
                xhr.setRequestHeader('Content-type', 'application/json');
            }
            xhr.send()
        };

        ajax('GET', url + '/api/server', function (server) {
            ajax('GET', url + '/api/session?token=' + token, function (user) {

                map.getView().setCenter(ol.proj.fromLonLat([
                    user.longitude || server.longitude || 0.0,
                    user.latitude || server.latitude || 0.0
                ]));
                map.getView().setZoom(user.zoom || server.zoom || 2);
            });
        });
    }
}
