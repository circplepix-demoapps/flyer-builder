import { Dialog } from './../shared/dialog/dialog.component';
import { Observable } from 'rxjs/Rx';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
    public dialog_height: string;
    public dialog_width: string;
    public dialog_close_text: string;

    constructor(private dialog: MdDialog) {
    }

    public open(title: string, caption: string, closeText: string): Observable<boolean> {

        let dialogRef: MdDialogRef<Dialog>;

        dialogRef = this.dialog.open(Dialog, {
            height: this.dialog_height,
            width: this.dialog_width,
            disableClose: true,
        });

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.caption = caption;
        dialogRef.componentInstance.close_text = closeText;

        return dialogRef.afterClosed();
    }

    public confirm(title: string, message: string, closeText: string): Observable<boolean> {

        let dialogRef: MdDialogRef<Dialog>;

        dialogRef = this.dialog.open(Dialog);

        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.message = message;
        dialogRef.componentInstance.close_text = closeText;

        return dialogRef.afterClosed();
    }
}
