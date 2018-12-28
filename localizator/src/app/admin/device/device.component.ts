import {Component, OnInit, ViewChild} from '@angular/core';
import {AppResponse, Respuesta, Device, ResponseApp, Notificacion} from "../../app.model";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {DeviceService} from "../../services/device.service";
import {Confirm, Information, MensajeError} from "../../mensaje/window.mensaje";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {forkJoin, merge, Subject} from "rxjs/index";
import {DeviceWindow} from "./device-window/device-window.component";
import {WebsocketService} from "../../services/websocket.service";
import {NotificacionMensajeComponent} from "../../components/header/header.component";
import {Message} from "@stomp/stompjs";

declare function my_init_plugins();

@Component({
    selector: 'app-device',
    templateUrl: './device.component.html',
    styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

    dataSource: MatTableDataSource<Device> = new MatTableDataSource<Device>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'index', 'name', 'phone', 'status', 'canceled', 'acciones'];
    selection = new SelectionModel<Device>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Device>;

    constructor(private service: DeviceService, private deviceSocket: WebsocketService, private dialog: MatDialog) {
        deviceSocket.connectDeviceSocket();
    }

    ngOnInit() {
        my_init_plugins();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'deviceId,desc';
        this.paginator.pageSize = this.pageSize;
        this.inicializarElementos();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.service.listarDevices(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
                }),
                map(data => {
                    this.total = data.body.total;
                    this.isLoadingResults = false;
                    return data.body.elementos;
                }),
                catchError(data => {
                    this.isLoadingResults = false;
                    return [];
                })
            )
            .subscribe(datos => {
                this.dataSource = new MatTableDataSource(datos);
                this.paginator.length = this.total;
                this.table.dataSource = this.dataSource;
                this.table.renderRows();
            });
        this.deviceSocket.getMessageDevice().subscribe(this.onReceiveDevice);
    }

    abrirVentana() {
        let dialogRef = this.dialog.open(DeviceWindow, {
            width: '450px', disableClose: true, data: new Device(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '350px', data: {mensaje: 'Se ha insertado la dispositivo.'}});
                this.paginator.page.emit();
            }
        });
    }

    editarDevice(event: Event, device: Device): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(DeviceWindow, {
            width: '450px', data: device, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '350px',
                    data: {mensaje: 'Se ha modificado la dispositivo.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarDevice(event: Event, device: Device): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la dispositivo:<br>- ' + device.name},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.isLoadingResults = true;
                this.service.eliminarDevice(device.id).subscribe(resp => {
                    this.isLoadingResults = true;
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: 'Se ha eliminado el dispositivo.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    } else {
                        this.dialog.open(MensajeError, {
                            width: '380px',
                            data: {mensaje: resp.body.msg}
                        });
                    }
                });
            }
        });
    }

    eliminarDevices(event: Event): void {
        event.stopPropagation();
        let devicees = this.selection.selected;
        if (devicees.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los devicees:<br>- ' + devicees.map(device => device.name).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    devicees.forEach(device => {
                        allProgressObservables.push(this.service.eliminarDevice(device.id));
                    });
                    forkJoin(allProgressObservables).subscribe(response => {
                        let completo = true;
                        response.forEach(resp => {
                            if (!resp.body.success) {
                                completo = false;
                            }
                        });
                        todos.next(completo);
                    });
                    todos.subscribe(value => {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: value ? 'Se ha eliminado todas las dispositivos.' : 'No se eliminaron correctamente todas las dispositivos'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    });
                }
            });
        }
    }

    private onReceiveDevice = (message: Message) => {
        console.log("Me llego el mensaje")
        const device: Device = JSON.parse(message.body);
        let searchDevice = this.dataSource.data.find((value: Device) => value.id === device.id);
        if (searchDevice) {
            searchDevice.status = device.status;
        }
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    expandCollapse(event: Event, elemento: Device) {
        event.stopPropagation();
    }

    private inicializarElementos(): void {
        this.paginator._intl.itemsPerPageLabel = "Registros por página";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.paginator._intl.nextPageLabel = "Página siguiente";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) {
                return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
        }
    }

}
