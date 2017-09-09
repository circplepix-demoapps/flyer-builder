import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'ai-header',
    templateUrl: 'header.component.html',
    styleUrls: [ 'header.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
<<<<<<< HEAD
    headerTitle = 'Flyer Builder - Demo Version';
=======
    headerTitle = 'Flyer Builder Demo - Prototype Version';
>>>>>>> e1cced73d3485e668476c69e2647e07f39757310

    constructor() { }

    ngOnInit() { }
}