import {Component, OnInit, ViewChild} from '@angular/core';
import {RouteWindow} from "../route/route-window/route-window.component";
import {Place, Route} from "../../app.model";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {Confirm, Information} from "../../mensaje/window.mensaje";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {RouteService} from "../../services/route.service";
import {forkJoin, merge, Subject} from "rxjs/index";
import {animate, state, style, transition, trigger} from "@angular/animations";

declare function my_init_plugins();

@Component({
    selector: 'app-route',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class RouteComponent implements OnInit {
    dataSource: MatTableDataSource<Route> = new MatTableDataSource<Route>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'expandido', 'code', 'origin', 'destiny', 'acciones'];
    selection = new SelectionModel<Route>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    cont = 0;
    expandedElement: Route;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Route>;

    constructor(private service: RouteService, private dialog: MatDialog) {
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
                    return this.service.listarRoutes(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
        let dialogRef = this.dialog.open(RouteWindow, {
            width: '420px', disableClose: true, data: new Route(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '350px', data: {mensaje: 'Se ha insertardo la ruta.'}});
                this.paginator.page.emit();
            }
        });
    }

    editarRoute(event: Event, route: Route): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(RouteWindow, {
            width: '420px', data: route, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '350px',
                    data: {mensaje: 'Se ha modificado la ruta.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarRoute(event: Event, route: Route): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la route:<br>- ' + route.code},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.eliminarRoute(route.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: 'Se ha eliminado el route.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    }
                });
            }
        });
    }

    eliminarRoutes(event: Event): void {
        event.stopPropagation();
        let routees = this.selection.selected;
        if (routees.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los routees:<br>- ' + routees.map(route => route.code).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    routees.forEach(route => {
                        allProgressObservables.push(this.service.eliminarRoute(route.id));
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
                            data: {mensaje: value ? 'Se ha eliminado todos los routees.' : 'No se eliminaron correctamente todos los routees'}
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

    expandCollapse(event: Event, elemento: Route) {
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

    createText(places: Place[]) {
        return places.map(place => place.name).join(", ");
    }
}
