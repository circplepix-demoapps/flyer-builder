import { SafePipe } from './../../shared/safePipe';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PDFPreviewerComponent } from './pdf-previewer.component';

const pdfPreviewerRoute: Routes =[
   { path: 'pdf-previewer', component: PDFPreviewerComponent }
]

@NgModule({
   imports: [ BrowserModule, RouterModule.forChild(pdfPreviewerRoute) ],
   exports: [  ],
   declarations: [PDFPreviewerComponent, SafePipe],
   providers: [],
})
export class PDFPreviewerModule { }
