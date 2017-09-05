// Mimic the hero-detail component from tour of heroes

import { Component, OnInit, Input } from '@angular/core';

import { ElementType } from './../../../models/elementType';
import { TextElement } from '../../../helpers/text-element';

@Component({
  selector: 'app-text-control-panel',
  templateUrl: './text-control-panel.component.html',
  styleUrls: ['./text-control-panel.component.css']
})
export class TextControlPanelComponent implements OnInit {
  @Input() textElement: TextElement;
  fonts: string[];

  constructor() { }

  ngOnInit() { }

  public setTextElement(element: any): void {
    //do checks on the element
    if (element != null) {
      if (element.type === ElementType.text) {
        this.textElement.font = "Arial";
        this.textElement.color = "red";
        this.textElement.fontSize = 15;
        this.textElement.charLimit = 100;
        this.textElement.replacementTextOn = false;
        this.textElement.isSet = true;
      }
    }
    this.textElement.isSet = false;
  }

}
