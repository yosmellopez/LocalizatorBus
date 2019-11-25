import {Component} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {WTimeDialogComponent} from './w-time-dialog.component';

import * as moment from 'moment';


@Component({
    selector: 'w-mat-timepicker',
    styleUrls: ['./w-mat-timepicker.component.scss'],
    templateUrl: './w-mat-timepicker.component.html'
})
export class WMatTimePickerComponent {
    private hour = 10;
    private minute = 25;
    private meridien = 'PM';

    constructor(private dialog: MatDialog) {
    }


    getTime(): string {
        return `${this.hour}:${this.minute} ${this.meridien}`;
    }

    showPicker($event) {
        let dialogRef = this.dialog.open(WTimeDialogComponent, {
            maxHeight: "300px",
            data: {
                hour: this.hour,
                minute: this.minute,
                meriden: this.meridien
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined) {
                return;
            } else if (result !== -1) {
                this.hour = result.hour;
                this.minute = result.minute;
                this.meridien = result.meriden;
            }
        });
        return false;
    }
}
