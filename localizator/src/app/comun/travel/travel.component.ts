import {Component, OnInit, ViewChild} from '@angular/core';
import {TravelWindow} from "../travel/travel-window/travel-window.component";
import {Travel} from "../../app.model";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {Confirm, Information, MensajeError} from "../../mensaje/window.mensaje";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {TravelService} from "../../services/travel.service";
import {forkJoin, merge, Subject} from "rxjs/index";
import {animate, state, style, transition, trigger} from "@angular/animations";

declare function my_init_plugins();

@Component({
    selector: 'app-travel',
    templateUrl: './travel.component.html',
    styleUrls: ['./travel.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ])
    ]
})
export class TravelComponent implements OnInit {
    dataSource: MatTableDataSource<Travel> = new MatTableDataSource<Travel>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'expandido', 'active', 'travelDate', 'arriveDate', 'bus', 'route', 'acciones'];
    selection = new SelectionModel<Travel>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    cont = 0;
    expandedElement: Travel;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Travel>;

    constructor(private service: TravelService, private dialog: MatDialog) {
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
                    return this.service.listarTravels(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
                }),
                map(data => {
                    this.total = data.body.total;
                    this.isLoadingResults = false;
                    this.cont = 0;
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
        let dialogRef = this.dialog.open(TravelWindow, {
            width: '700px', disableClose: true, data: new Travel(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '350px', data: {mensaje: result.body.msg}});
                this.paginator.page.emit();
            }
        });
    }

    editarTravel(event: Event, travel: Travel): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(TravelWindow, {
            width: '700px', data: travel, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {
                    width: '350px',
                    data: {mensaje: result.body.msg}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarTravel(event: Event, travel: Travel): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la travel:<br>- ' + travel.travelDate},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.eliminarTravel(travel.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: 'Se ha eliminado el viaje.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    } else {
                        this.dialog.open(MensajeError, {
                            width: '350px',
                            data: {mensaje: resp.body.msg}
                        });
                    }
                });
            }
        });
    }

    eliminarTravels(event: Event): void {
        event.stopPropagation();
        let traveles = this.selection.selected;
        if (traveles.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los traveles:<br>- ' + traveles.map(travel => travel.travelDate).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    traveles.forEach(travel => {
                        allProgressObservables.push(this.service.eliminarTravel(travel.id));
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
                            data: {mensaje: value ? 'Se ha eliminado todos los viajes.' : 'No se eliminaron correctamente todos los viajes'}
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

    expandCollapse(event: Event, elemento: Travel) {
        event.stopPropagation();
        elemento.expandido = !elemento.expandido;
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

    showIndex(i: number) {
    }
}
