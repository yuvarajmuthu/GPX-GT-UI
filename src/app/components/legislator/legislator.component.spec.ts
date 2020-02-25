import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorComponent } from './legislator.component';

describe('LegislatorComponent', () => {
  let component: LegislatorComponent;
  let fixture: ComponentFixture<LegislatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
