import { ConfigConstant } from './../helpers/configConstant';
import { Injectable } from '@angular/core';


@Injectable()
export class FlyerLocalStorage {
   private flyerImageDataKey = ConfigConstant.FLYER_STORAGE_KEY;

   public setLocalStorage(data: any) {
      if(!data) return;
      
      localStorage.setItem(this.flyerImageDataKey, data);
   }

   public getLocalStorage(key: any) {
      if(!key) return;

      return localStorage.getItem(key);
   }

   public removeStorage(key: string) {
      if(localStorage.getItem(key)) {
         localStorage.removeItem(key);
      } 
   }
   
}