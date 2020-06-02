import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbiodatatemplateComponent } from './groupbiodatatemplate.component';

describe('GroupbiodatatemplateComponent', () => {
  let component: GroupbiodatatemplateComponent;
  let fixture: ComponentFixture<GroupbiodatatemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupbiodatatemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbiodatatemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
