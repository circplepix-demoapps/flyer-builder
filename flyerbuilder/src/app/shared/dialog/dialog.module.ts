import { DialogService } from './../../services/dialog.service';
import { Dialog } from './dialog.component';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [  ],
    exports: [ Dialog ],
    declarations: [ Dialog ],
    providers: [ DialogService ],
    entryComponents: [ Dialog ],
})

export class DialogsModule { }
