import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextControlPanelComponent } from './text-control-panel.component';

describe('TextControlPanelComponent', () => {
  let component: TextControlPanelComponent;
  let fixture: ComponentFixture<TextControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
