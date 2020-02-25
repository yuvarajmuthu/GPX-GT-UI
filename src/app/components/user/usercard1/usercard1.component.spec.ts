import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Usercard1Component } from './usercard1.component';

describe('Usercard1Component', () => {
  let component: Usercard1Component;
  let fixture: ComponentFixture<Usercard1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Usercard1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Usercard1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
