import { DialogService } from './../../services/dialog.service';
import { Dialog } from './dialog.component';

import { MaterialModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [ MaterialModule ],
    exports: [ Dialog ],
    declarations: [ Dialog ],
    providers: [ DialogService ],
    entryComponents: [ Dialog ],
})

export class DialogsModule { }
