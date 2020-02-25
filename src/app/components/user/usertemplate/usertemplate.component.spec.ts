import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertemplateComponent } from './usertemplate.component';

describe('UsertemplateComponent', () => {
  let component: UsertemplateComponent;
  let fixture: ComponentFixture<UsertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
