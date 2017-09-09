import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'ai-header',
    templateUrl: 'header.component.html',
    styleUrls: [ 'header.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
    headerTitle = 'Flyer Builder - Demo Version';

    constructor() { }

    ngOnInit() { }
}