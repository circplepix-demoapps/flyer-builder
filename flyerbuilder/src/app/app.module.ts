import { ElementType } from './models/elementType';
import { FlyerLocalStorage } from './helpers/flyerLocalStorage';
import { SafePipe } from './shared/safePipe';
import { PDFGenerator } from './shared/PDFGenerator';
import { PDFPreviewer } from './components/pages/pdf-previewer/pdf-previewer.component';
import { HttpModule } from '@angular/http';
import { DialogsModule } from './shared/dialog/dialog.module';
import { HeaderComponent } from './components/pages/header/header.component';
import { SidenavComponent } from './components/pages/sidenav/sidenav.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NgModule, Pipe, PipeTransform }      from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent }  from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdButtonModule, MdTabsModule, MdSelect, MdOption, MdInputModule } from '@angular/material';

import 'hammerjs';
import { ComplexTextareaComponent } from './components/elements/complex-textarea/complex-textarea.component';

const rootRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pdf-previewer', component: PDFPreviewer },
  { path: '**', redirectTo: '' }
]

@NgModule({
   imports:[ 
      BrowserModule,
      BrowserAnimationsModule,
      MaterialModule,
      MdButtonModule,
      MdTabsModule,
      MdInputModule,
      HttpModule,
      DialogsModule,
      
      RouterModule.forRoot(rootRoutes),
   ],
   declarations: [ AppComponent, HomeComponent, SidenavComponent, HeaderComponent, PDFPreviewer, SafePipe, ComplexTextareaComponent ],
   providers: [ PDFGenerator, FlyerLocalStorage ],
   bootstrap: [ AppComponent ]
})
export class AppModule { }


