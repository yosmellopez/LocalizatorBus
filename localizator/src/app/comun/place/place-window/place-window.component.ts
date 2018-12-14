import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Localization, Place} from "../../../app.model";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {PlaceService} from "../../../services/place.service";

declare var google;

@Component({
    selector: 'app-place-window',
    templateUrl: './place-window.component.html',
    styleUrls: ['./place-window.component.css']
})
export class PlaceWindow implements OnInit {

    isLoadingResults = false;
    idUser: number;
    insertar = true;
    form: FormGroup;
    public zoom: number;
    @ViewChild("search")
    public searchElementRef: ElementRef;
    @ViewChild("mapa")
    public mapa: ElementRef;
    map = null;
    marker = null;
    infoWindow = null;
    puntos: any[] = [];
    stretch: boolean = false;
    @ViewChild('name') nameInput: ElementRef;

    constructor(public dialogRef: MatDialogRef<PlaceWindow>, @Inject(MAT_DIALOG_DATA) {id, name, postalCode, address, stretch, lat, lon}: Place, private service: PlaceService,
                private dialog: MatDialog) {
        if (id)
            this.insertar = false;
        this.idUser = id;
        this.form = new FormGroup({
            name: new FormControl(name, [Validators.required]),
            address: new FormControl(address, [Validators.required]),
            stretch: new FormControl(stretch ? stretch : false, [Validators.required]),
            lat: new FormControl(lat, [Validators.required]),
            lon: new FormControl(lon, [Validators.required]),
            postalCode: new FormControl(postalCode, []),
        });
        this.form.controls['stretch'].valueChanges.subscribe(value => {
            this.stretch = value;
        });
    }

    insertarPlace(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarPlace(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarPlace(this.idUser, this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            }
        }
    }

    ngOnInit() {
        let me = this;
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {types: ['geocode']});
        autocomplete.addListener('place_changed', function () {
            let place = autocomplete.getPlace();
            let geometry = place.geometry;
            let location = geometry.location;
            me.puntos.push(location.lat());
            me.puntos.push(location.lng());
            me.initMapa();
            me.map.setCenter(location);
            me.marker.setPosition(location);
            me.service.findPlaceByCoord(location.lat(), location.lng()).subscribe(resp => {
                if (resp.body.success) {
                    let localization: Localization = resp.body.elemento;
                    let address = localization.address;
                    let direccion = (address.road ? address.road + ', ' : "") + (address.suburb ? address.suburb + ', ' : '')
                        + (address.village ? address.village + ', ' : '') + (address.county ? address.county + ', ' : '')
                        + (address.state ? address.state : '') + ', ' + address.country;
                    let nombre = address.county ? address.county : address.state;
                    if (me.stretch) {
                        nombre = address.suburb ? address.suburb : address.village ? address.village : address.town ? address.town : address.county ? address.county : address.state;
                    }
                    me.form.controls['postalCode'].setValue(address.postcode || 0);
                    me.form.controls['name'].setValue(nombre);
                    me.form.controls['address'].setValue(direccion);
                    me.form.controls['lat'].setValue(localization.lat);
                    me.form.controls['lon'].setValue(localization.lon);
                    me.nameInput.nativeElement.focus();
                }
            });
        });
        if (!this.insertar) {
            this.puntos.push(this.form.controls['lat'].value, this.form.controls['lon'].value);
            this.initMapa();
        }
    }

    initMapa() {
        const me = this;
        let location = new google.maps.LatLng(this.puntos[0], this.puntos[1]);
        let mapProp = {center: location, zoom: 13, mapTypeId: google.maps.MapTypeId.ROADMAP};
        this.map = new google.maps.Map(this.mapa.nativeElement, mapProp);
        this.infoWindow = new google.maps.InfoWindow();
        this.eliminarMarker();
        this.marker = new google.maps.Marker({
            map: this.map, //el mapa creado en el paso anterior
            position: location, //objeto con latitud y longitud
            draggable: true,
            title: "Mi Ubicación" //que el marcador se pueda arrastrar
        });
        google.maps.event.addListener(this.marker, 'dragend', function (evt) {
            me.infoWindow.open(me.map, me.marker);
            me.service.findPlaceByCoord(evt.latLng.lat(), evt.latLng.lng()).subscribe(resp => {
                if (resp.body.success) {
                    let localization: Localization = resp.body.elemento;
                    let address = localization.address;
                    let direccion = (address.road ? address.road + ', ' : "") + (address.suburb ? address.suburb + ', ' : '')
                        + (address.village ? address.village + ', ' : '') + (address.county ? address.county + ', ' : '')
                        + (address.state ? address.state : '') + ', ' + address.country;
                    let nombre = address.county ? address.county : address.state;
                    if (me.stretch) {
                        nombre = address.suburb ? address.suburb : address.village ? address.village : address.town ? address.town : address.county ? address.county : address.state;
                    }
                    me.form.controls['postalCode'].setValue(address.postcode || 0);
                    me.form.controls['name'].setValue(nombre);
                    me.form.controls['address'].setValue(direccion);
                    me.form.controls['lat'].setValue(localization.lat);
                    me.form.controls['lon'].setValue(localization.lon);
                    me.nameInput.nativeElement.focus();
                    me.infoWindow.setOptions({content: '<p>Marcador ubicado en: ' + direccion + '</p>'});
                }
            });
        });
    }

    eliminarMarker(): any {
        if (this.marker != null) {
            //Elimino el marker
            this.marker.setMap(null);
            this.marker = null;
        }
    }

    resetMapa() {
        this.map = null;
        this.marker = null;
        this.infoWindow = null;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
