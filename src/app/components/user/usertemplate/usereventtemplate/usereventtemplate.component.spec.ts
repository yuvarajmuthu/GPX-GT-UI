import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereventtemplateComponent } from './usereventtemplate.component';

describe('UsereventtemplateComponent', () => {
  let component: UsereventtemplateComponent;
  let fixture: ComponentFixture<UsereventtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsereventtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsereventtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
