import { PDFPreviewerComponent } from './components/pdf-previewer/pdf-previewer.component';
import { PDFPreviewerModule } from './components/pdf-previewer/pdf-previewer.module';
import { FlyerLocalStorageService } from './services/flyerLocalStorage.service';
import { ElementType } from './models/elementType';
import { PDFGeneratorService } from './services/pdfGenerator.service';
import { HttpModule } from '@angular/http';
import { DialogsModule } from './shared/dialog/dialog.module';
import { HeaderComponent } from './components/pages/header/header.component';
import { SidenavComponent } from './components/pages/sidenav/sidenav.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdTabsModule, MdSelect, MdOption, MdInputModule } from '@angular/material';

import 'hammerjs';

const rootRoutes: Routes = [
   { path: '', component: HomeComponent },
   { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MdButtonModule,
      MdTabsModule,
      MdInputModule,
      HttpModule,
      DialogsModule,
      PDFPreviewerModule,

      RouterModule.forRoot(rootRoutes)

      
   ],
   declarations: [AppComponent, HomeComponent, SidenavComponent, HeaderComponent],
   providers: [PDFGeneratorService, FlyerLocalStorageService],
   bootstrap: [AppComponent]
})
export class AppModule { }


