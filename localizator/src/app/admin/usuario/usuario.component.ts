import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, merge, Subject} from "rxjs/index";
import {AppResponse, Respuesta, Usuario} from "../../app.model";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {UsuarioService} from "../../services/usuario.service";
import {SelectionModel} from "@angular/cdk/collections";
import {UsuarioWindow} from "./usuario-window/usuario-window.component";
import {Confirm, Information} from "../../mensaje/window.mensaje";

declare function my_init_plugins();

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

    dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['seleccionado', 'name', 'lastname', 'username', 'email', 'rol', 'activated', 'acciones'];
    selection = new SelectionModel<Usuario>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Usuario>;

    constructor(private service: UsuarioService, private dialog: MatDialog) {
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
                    return this.service.listarUsuarios(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
        let dialogRef = this.dialog.open(UsuarioWindow, {
            width: '500px', disableClose: true, data: new Usuario(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '400px', data: {mensaje: 'Se ha insertardo el usuario.'}});
                this.paginator.page.emit();
            }
        });
    }

    editarUsuario(event: Event, usuario: Usuario): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(UsuarioWindow, {
            width: '500px', data: usuario, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado el usuario.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarUsuario(event: Event, usuario: Usuario): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la usuario:<br>- ' + usuario.name},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.service.eliminarUsuario(usuario.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '400px',
                            data: {mensaje: 'Se ha eliminado el usuario.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    }
                });
            }
        });
    }

    eliminarUsuarios(event: Event): void {
        event.stopPropagation();
        let usuarios = this.selection.selected;
        if (usuarios.length === 0) {
            this.dialog.open(Information, {width: '320px', data: {mensaje: "No se han seleccionado elementos"}});
        } else {
            let dialogRef = this.dialog.open(Confirm, {
                width: '400px',
                data: {mensaje: 'Desea eliminar los buses:<br>- ' + usuarios.map(user => user.name + " " + user.lastname).join("<br> -")},
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    let allProgressObservables = [];
                    const todos = new Subject<boolean>();
                    usuarios.forEach(usuario => {
                        allProgressObservables.push(this.service.eliminarUsuario(usuario.id));
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
                            data: {mensaje: value ? 'Se ha eliminado todos los usuarios.' : 'No se eliminaron correctamente todos los usuarios'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    });
                }
            });
        }
    }

    activarUsuario(event: Event, usuario: Usuario) {
        event.stopPropagation();
        usuario.activated = !usuario.activated;
        let accion: string = usuario.activated ? "activado" : "desactivado";
        this.service.modificarUsuario(usuario.id, usuario).subscribe(response => {
            if (response.body.success) {
                this.dialog.open(Information, {data: {mensaje: `Usuario ${accion} exitosamente`}, width: "350px"});
            }
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    expandCollapse(event: Event, elemento: Usuario) {
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
