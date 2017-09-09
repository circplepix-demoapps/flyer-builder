import { FlyerLocalStorageService } from './flyerLocalStorage.service';
import { ElementType } from './../models/elementType';
import { FlyerImage } from './../models/FlyerImage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable, state } from '@angular/core';
import { ConfigConstant } from './../helpers/configConstant';

declare var jsPDF: any;

@Injectable()
export class PDFGeneratorService {
   constructor() { }

   loadImages(sources: any[], callback: any) {
      var images = {}, loadedImages = 0, numImages = 0;

      // get number of sources
      for (var src in sources) {
         numImages++;
      }

      for (var src in sources) {
         images[src] = new Image();
         images[src].onload = function () {
            if (++loadedImages >= numImages) {
               for (var i in sources) {
                  callback(images);
               }
            }
         };
         //set custom props
         images[src].src = sources[src].src,
         images[src].height = sources[src].height,
         images[src].width = sources[src].width,
         images[src].left = sources[src].x,
         images[src].top = sources[src].y;
         images[src].type = sources[src].type;
      }
   }

   setPDFName() {
      const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
      var prefix = "CIRCLEPIX_FLYERAPP_";
      for (var i = 0; i < 10; i++) {
         var rnd = Math.floor(Math.random() * list.length);
         prefix = prefix + list.charAt(rnd);
      }
      return prefix;
   }

   /**
    * 
    * @param sources 
    * @param callback 
    */
   processImageData(sources: any[], callback: any) {
      //****************************************************************************/
      //******* TODO: Refactor
      //****************************************************************************/
      var flyerDimensions = { width: ConfigConstant.FLYER_DIMENSION.width, height: ConfigConstant.FLYER_DIMENSION.height }

      this.loadImages(sources, function (images: any[]) {
         var canvas = document.createElement('canvas');
         var context = canvas.getContext('2d');

         var hightQualityMuliplier = 2;

         document.body.appendChild(canvas);

         canvas.width = flyerDimensions.width * hightQualityMuliplier;
         canvas.height = flyerDimensions.height * hightQualityMuliplier;

         context.webkitImageSmoothingEnabled = false;
         context.mozImageSmoothingEnabled = false;
         context.imageSmoothingEnabled = false;

         for (var i in images) {
            context.drawImage(images[i], parseInt(images[i].left) * hightQualityMuliplier, 
                                         parseInt(images[i].top) * hightQualityMuliplier,
                                         parseInt(images[i].width) * hightQualityMuliplier, 
                                         parseInt(images[i].height) * hightQualityMuliplier);
         }

         var imgData = canvas.toDataURL("image/jpeg");

         document.body.removeChild(canvas);

         if (typeof callback === 'function') {
            callback(imgData);
         }

      });
      return;
   }

   /**
    * 
    * @param sources 
    * @param callback 
    */
   generatePDF(sources: any, callback: any) {
      var pdf = new jsPDF('p', 'px', [ConfigConstant.FLYER_DIMENSION.width, ConfigConstant.FLYER_DIMENSION.height]);
      pdf.setProperties({ title: this.setPDFName() });

      var bgWidth = pdf.internal.pageSize.width;
      var bgHeight = pdf.internal.pageSize.height;

      var images = sources.filter(function (el: any) {
         return el.type === ElementType.image || el.type === ElementType.blank || el.type === ElementType.static ||
            el.type === ElementType.agent || el.type === ElementType.logo || el.type === ElementType.realtor ||
            el.type === ElementType.eho || el.type === ElementType.qr || el.type === ElementType.bullet;
      })

      var texts = sources.filter(function (el: any) {
         return el.type === ElementType.text || el.type === ElementType.textarea
      })

      //****************************************************************************/
      //******* TODO: Refactor
      //****************************************************************************/
      var coord_adjustment = 10;
      var top_adjustment = 6.5;
      var left_adjustment = 5.5;
      var fsize_adjustment = 1.35;
      var textarea_left_adjustment = 3;

      this.processImageData(images, function (data: any) {
         pdf.addImage(data, 'JPEG', 0, 0, bgWidth, bgHeight);

         for (var i in texts) {
            var font_size = 13.33 * fsize_adjustment;
            pdf.setFontSize(font_size);

            var padding_left;

            var textValue = '';
            if (texts[i].type === ElementType.textarea) {
               padding_left = left_adjustment + textarea_left_adjustment;
               textValue = pdf.splitTextToSize(texts[i].value, texts[i].width);
            } else {
               padding_left = left_adjustment;
               textValue = texts[i].value;
            }

            pdf.text(parseInt(texts[i].x) + coord_adjustment + padding_left,
               parseInt(texts[i].y) + coord_adjustment + top_adjustment, textValue);
         }

         var outputData = pdf.output('datauristring');

         if (typeof callback === 'function') {
            callback(outputData);
         }
      })
      return;
   }



}


