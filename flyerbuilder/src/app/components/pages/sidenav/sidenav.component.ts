import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';
import { TestData } from './../../../helpers/testData';

declare var $: any;

@Component({
   moduleId: module.id,
   selector: 'ai-sidenav',
   templateUrl: 'sidenav.component.html',
<<<<<<< HEAD
   styleUrls: ['sidenav.component.css'],
=======
   styleUrls: [ 'sidenav.component.css' ],
>>>>>>> e1cced73d3485e668476c69e2647e07f39757310
   encapsulation: ViewEncapsulation.None
})

export class SidenavComponent implements OnInit, AfterViewInit {
   public sidebar_elements: any[] = TestData.SIDEBAR_ELEMENTS;

   constructor() { }
<<<<<<< HEAD

=======
   
>>>>>>> e1cced73d3485e668476c69e2647e07f39757310
   ngOnInit() {
   }

   ngAfterViewInit() { }


}

