import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {CLOCK_TYPE} from './w-clock.component';


@Component({
    styleUrls: ['./w-time-dialog.component.scss'],
    templateUrl: './w-time-dialog.component.html'
})
export class WTimeDialogComponent {

    userTime: any = {};
    VIEW_HOURS = CLOCK_TYPE.HOURS;
    VIEW_MINUTES = CLOCK_TYPE.MINUTES;
    currentView: CLOCK_TYPE = this.VIEW_HOURS;


    constructor(
        @Inject(MAT_DIALOG_DATA) private userTimeData,
        private dialogRef: MatDialogRef<WTimeDialogComponent>,
        private cdRef: ChangeDetectorRef) {

        this.userTime = userTimeData;
    }


    formatMinute(): string {

        if (this.userTime.minute < 10) {

            return '0' + String(this.userTime.minute);
        } else {

            return String(this.userTime.minute);
        }
    }

    setCurrentView(type: CLOCK_TYPE) {
        this.currentView = type;
    }

    setMeridien(m: string) {
        this.userTime.meriden = m;
    }

    revert() {
        this.dialogRef.close(-1);
    }

    submit() {
        this.dialogRef.close(this.userTime);
    }
}
