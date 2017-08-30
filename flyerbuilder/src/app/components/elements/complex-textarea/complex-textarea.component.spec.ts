import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexTextareaComponent } from './complex-textarea.component';

describe('ComplexTextareaComponent', () => {
  let component: ComplexTextareaComponent;
  let fixture: ComponentFixture<ComplexTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
