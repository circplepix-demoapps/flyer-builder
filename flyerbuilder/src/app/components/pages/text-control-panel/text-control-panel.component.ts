// Mimic the hero-detail component from tour of heroes

import { Component, Input } from '@angular/core';

import { ElementType } from './../../../models/elementType';
import { TextElement } from '../../../helpers/text-element';

import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-text-control-panel',
  templateUrl: './text-control-panel.component.html',
  styleUrls: ['./text-control-panel.component.css']
})
export class TextControlPanelComponent {
  @Input('id') uuid: any; // textElement: TextElement;
  fonts: string[];

  constructor(){
    // this.textElement = {
    //   font: "serif",
    //   color: "blue",
    //   fontSize: 11,
    //   charLimit: 100,
    //   replacementTextOn: false,
    //   isSet: true
    // };
  }

  // public setTextElement(element: any): void {
  //   //do checks on the element
  //   if (element.type === ElementType.text) {
  //     this.textElement.font = "Arial";
  //     this.textElement.color = "red";
  //     this.textElement.fontSize = 15;
  //     this.textElement.charLimit = 100;
  //     this.textElement.replacementTextOn = false;
  //     this.textElement.isSet = true;
  //   } else {
  //   }
  // }

}
