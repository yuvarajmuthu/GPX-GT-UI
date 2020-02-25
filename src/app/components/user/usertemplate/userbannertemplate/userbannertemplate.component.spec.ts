import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbannertemplateComponent } from './userbannertemplate.component';

describe('UserbannertemplateComponent', () => {
  let component: UserbannertemplateComponent;
  let fixture: ComponentFixture<UserbannertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserbannertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbannertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
