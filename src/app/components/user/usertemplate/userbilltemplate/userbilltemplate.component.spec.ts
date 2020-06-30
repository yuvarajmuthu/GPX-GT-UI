import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbilltemplateComponent } from './userbilltemplate.component';

describe('UserbilltemplateComponent', () => {
  let component: UserbilltemplateComponent;
  let fixture: ComponentFixture<UserbilltemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserbilltemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbilltemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
