import {Component, OnInit, ViewChild} from '@angular/core';
import {AppResponse, Respuesta, Company, ResponseApp} from "../../app.model";
import {SelectionModel} from "@angular/cdk/collections";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {CompanyService} from "../../services/company.service";
import {Confirm, Information, MensajeError} from "../../mensaje/window.mensaje";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import {forkJoin, merge, Subject} from "rxjs/index";
import {CompanyWindow} from "./company-window/company-window.component";

declare function my_init_plugins();

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

    dataSource: MatTableDataSource<Company> = new MatTableDataSource<Company>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'index', 'name', 'busCount', 'canceled', 'acciones'];
    selection = new SelectionModel<Company>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Company>;

    constructor(private service: CompanyService, private dialog: MatDialog) {
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
                    return this.service.listarCompanys(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
        let dialogRef = this.dialog.open(CompanyWindow, {
            width: '400px', disableClose: true, data: new Company(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '350px', data: {mensaje: 'Se ha insertado la empresa.'}});
                this.paginator.page.emit();
            }
        });
    }

    editarCompany(event: Event, company: Company): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(CompanyWindow, {
            width: '400px', data: company, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '350px',
                    data: {mensaje: 'Se ha modificado la empresa.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarCompany(event: Event, company: Company): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la empresa:<br>- ' + company.name},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.eliminarCompany(company.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '350px',
                            data: {mensaje: 'Se ha eliminado la empresa.'}
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

    eliminarCompanys(event: Event): void {
        event.stopPropagation();
        let companyes = this.selection.selected;
        if (companyes.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los companyes:<br>- ' + companyes.map(company => company.name).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    companyes.forEach(company => {
                        allProgressObservables.push(this.service.eliminarCompany(company.id));
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
                            data: {mensaje: value ? 'Se ha eliminado todas las empresas.' : 'No se eliminaron correctamente todas las empresas'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    });
                }
            });
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

    expandCollapse(event: Event, elemento: Company) {
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
