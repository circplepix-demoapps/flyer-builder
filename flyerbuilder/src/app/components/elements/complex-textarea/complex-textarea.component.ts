import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-complex-textarea',
  templateUrl: './complex-textarea.component.html',
  styleUrls: ['./complex-textarea.component.css']
})
export class ComplexTextareaComponent implements OnInit {
  text: string;

  constructor() {
    this.text = "Highlight thisssss";
  }

  ngOnInit() {
  }

}
