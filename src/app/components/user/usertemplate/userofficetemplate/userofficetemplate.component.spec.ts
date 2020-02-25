import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserofficetemplateComponent } from './userofficetemplate.component';

describe('UserofficetemplateComponent', () => {
  let component: UserofficetemplateComponent;
  let fixture: ComponentFixture<UserofficetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserofficetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserofficetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
