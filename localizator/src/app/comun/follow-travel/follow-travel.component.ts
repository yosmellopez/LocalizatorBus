import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {TravelService} from "../../services/travel.service";
import {MyLocation, Travel} from "../../app.model";
import {FormControl} from "@angular/forms";
import {MatPaginator, MatSort, MatTabChangeEvent, MatTable, MatTableDataSource} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";
import {merge} from "rxjs";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import {TabMapComponent} from "../tab-map/tab-map.component";

declare var google;

@Component({
    selector: 'app-follow-travel',
    templateUrl: './follow-travel.component.html',
    styleUrls: ['./follow-travel.component.css']
})
export class FollowTravelComponent implements OnInit {

    travels: Travel[] = [];
    tabs: Travel[] = [];
    selected = new FormControl(0);
    dataSource: MatTableDataSource<Travel> = new MatTableDataSource<Travel>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['active', 'travelDate', 'arriveDate', 'bus', 'route', 'acciones'];
    locations: MyLocation[] = [];
    selection = new SelectionModel<Travel>(true, []);
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    cont = 0;
    indexTab: number = 0;
    today = new Date();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Travel>;

    constructor(private service: TravelService) {
    }

    addTab(travel: Travel) {
        let findIndex = this.tabs.findIndex(value => value.id == travel.id);
        if (findIndex === -1) {
            this.tabs.push(travel);
            this.indexTab = this.tabs.length;
        } else {
            this.indexTab = findIndex + 1;
        }
    }

    removeTab(index: number) {
        this.tabs.splice(index, 1);
        this.indexTab = this.tabs.length;
    }

    selectionChange(event: MatTabChangeEvent) {
        this.indexTab = event.index;
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'id,desc';
        this.paginator.pageSize = this.pageSize;
        this.inicializarElementos();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(startWith({}), switchMap(() => {
                    this.isLoadingResults = true;
                    return this.service.listarTravelsOnCurrentDate();
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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
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
