import { DialogService } from './../../services/dialog.service';
import { Dialog } from './dialog.component';

<<<<<<< HEAD
import { NgModule } from '@angular/core';

@NgModule({
    imports: [  ],
=======
import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [ MaterialModule ],
>>>>>>> 84256d1d8f10d470bc10ebbbfb1a8e094fe53f33
    exports: [ Dialog ],
    declarations: [ Dialog ],
    providers: [ DialogService ],
    entryComponents: [ Dialog ],
})

export class DialogsModule { }
