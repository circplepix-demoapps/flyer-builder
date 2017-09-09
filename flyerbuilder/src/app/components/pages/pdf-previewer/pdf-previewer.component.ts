import { ElementType } from './../../../models/elementType';
import { FlyerLocalStorage } from './../../../helpers/flyerLocalStorage';
import { ConfigConstant } from './../../../helpers/configConstant';
import { SafePipe } from './../../../shared/safePipe';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFGenerator } from './../../../shared/PDFGenerator';

@Component({
   moduleId: module.id,
   templateUrl: 'pdf-previewer.component.html',
   styleUrls: ['pdf-previewer.component.css'],
   encapsulation: ViewEncapsulation.None
})

export class PDFPreviewer implements OnInit, OnDestroy {
   errorMessage: string;
   subscription: any;
   dataUrl: any;
   droppedElement: any[] = [];

   constructor(private activatedRoute: ActivatedRoute, private router: Router, private pdf: PDFGenerator,
               private flyerLocalStorage: FlyerLocalStorage) {
      
   }

   ngOnInit() {
      if (this.flyerLocalStorage.getLocalStorage(ConfigConstant.FLYER_STORAGE_KEY)) {
         this.droppedElement = JSON.parse(this.flyerLocalStorage.getLocalStorage(ConfigConstant.FLYER_STORAGE_KEY));

         //TODO: dapat i dynamic tne ang blank
         let blank = {
            'x': 1,
            'y': 1,
            'type': ElementType.blank,
            'width': ConfigConstant.FLYER_DIMENSION.width,
            'height': ConfigConstant.FLYER_DIMENSION.height,
            'src': ConfigConstant.BLANK_DEFAULT_IMAGE
         }
         this.droppedElement.unshift(blank);

         this.subscription = this.getData().then(data => {
            this.dataUrl = data;
         }, error => this.errorMessage = error)
      }
   }

   getData() {
      return new Promise((resolve, reject) => {
         if(!this.droppedElement) reject(ConfigConstant.ERROR_MSG);

         this.pdf.generatePDF(this.droppedElement, function (data: any) {
            resolve(data);
         });
      }) 
   }

   ngOnDestroy() {
      this.subscription.destroy();
   }

}
