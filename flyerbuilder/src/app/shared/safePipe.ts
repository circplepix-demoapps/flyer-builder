import { Component, NgModule, VERSION, Pipe, PipeTransform } from '@angular/core'
import { BrowserModule, DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}