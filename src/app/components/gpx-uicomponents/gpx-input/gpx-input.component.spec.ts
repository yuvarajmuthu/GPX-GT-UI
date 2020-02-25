import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxInputComponent } from './gpx-input.component';

describe('GpxInputComponent', () => {
  let component: GpxInputComponent;
  let fixture: ComponentFixture<GpxInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpxInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
