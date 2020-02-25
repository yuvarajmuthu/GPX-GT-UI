import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Usercard2Component } from './usercard2.component';

describe('Usercard2Component', () => {
  let component: Usercard2Component;
  let fixture: ComponentFixture<Usercard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Usercard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Usercard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
