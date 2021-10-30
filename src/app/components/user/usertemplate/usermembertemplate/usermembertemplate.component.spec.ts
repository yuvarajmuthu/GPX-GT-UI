import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermembertemplateComponent } from './usermembertemplate.component';

describe('UsermembertemplateComponent', () => {
  let component: UsermembertemplateComponent;
  let fixture: ComponentFixture<UsermembertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermembertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermembertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
