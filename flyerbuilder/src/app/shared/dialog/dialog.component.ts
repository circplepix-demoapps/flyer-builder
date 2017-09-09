import { MdDialogRef } from '@angular/material';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'dialog.component.html',
    styleUrls: [ 'dialog.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class Dialog {
    
    public title: string;
    public message: string;
    public caption: string;
    public close_text: string;
    
    constructor(public dialogRef: MdDialogRef<Dialog>) {

    }
}
