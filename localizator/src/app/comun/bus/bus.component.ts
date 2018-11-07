import {Component, OnInit, ViewChild} from '@angular/core';
import {AppResponse, Respuesta, Bus, ResponseApp} from "../../app.model";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {BusService} from "../../services/bus.service";
import {Confirm, Information} from "../../mensaje/window.mensaje";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {forkJoin, merge, Subject} from "rxjs/index";
import {BusWindow} from "./bus-window/bus-window.component";

declare function my_init_plugins();

@Component({
    selector: 'app-bus',
    templateUrl: './bus.component.html',
    styleUrls: ['./bus.component.css']
})
export class BusComponent implements OnInit {

    dataSource: MatTableDataSource<Bus> = new MatTableDataSource<Bus>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'code', 'number', 'siteNumber', 'acciones'];
    selection = new SelectionModel<Bus>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Bus>;

    constructor(private service: BusService, private dialog: MatDialog) {
    }

    ngOnInit() {
        my_init_plugins();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'id,desc';
        this.paginator.pageSize = this.pageSize;
        this.inicializarElementos();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.service.listarBuss(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
                }),
                map(data => {
                    this.total = data.body.total;
                    this.isLoadingResults = false;
                    return data.body.elementos;
                }),
                catchError(data => {
                    return [];
                })
            )
            .subscribe(datos => {
                this.dataSource = new MatTableDataSource(datos);
                this.paginator.length = this.total;
                this.table.dataSource = this.dataSource;
                this.table.renderRows();
            });
    }

    abrirVentana() {
        let dialogRef = this.dialog.open(BusWindow, {
            width: '400px', disableClose: true, data: new Bus(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '350px', data: {mensaje: 'Se ha insertardo el bus.'}});
                this.paginator.page.emit();
            }
        });
    }

    editarBus(event: Event, bus: Bus): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(BusWindow, {
            width: '400px', data: bus, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '350px',
                    data: {mensaje: 'Se ha modificado el bus.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarBus(event: Event, bus: Bus): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la bus:<br>- ' + bus.code},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.eliminarBus(bus.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: 'Se ha eliminado el bus.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    }
                });
            }
        });
    }

    eliminarBuss(event: Event): void {
        event.stopPropagation();
        let buses = this.selection.selected;
        if (buses.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los buses:<br>- ' + buses.map(bus => bus.code).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    buses.forEach(bus => {
                        allProgressObservables.push(this.service.eliminarBus(bus.id));
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
                            data: {mensaje: value ? 'Se ha eliminado todos los buses.' : 'No se eliminaron correctamente todos los buses'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    });
                }
            });
        }
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    expandCollapse(event: Event, elemento: Bus) {
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
