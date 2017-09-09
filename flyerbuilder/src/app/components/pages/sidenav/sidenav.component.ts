import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { TestData } from './../../../helpers/testData';

declare var $: any;

@Component({
   moduleId: module.id,
   selector: 'ai-sidenav',
   templateUrl: 'sidenav.component.html',
   styleUrls: ['sidenav.component.css'],
   encapsulation: ViewEncapsulation.None
})

export class SidenavComponent implements OnInit, AfterViewInit {
   public sidebar_elements: any[] = TestData.SIDEBAR_ELEMENTS;

   constructor() { }

   ngOnInit() {
   }

   ngAfterViewInit() { }


}

