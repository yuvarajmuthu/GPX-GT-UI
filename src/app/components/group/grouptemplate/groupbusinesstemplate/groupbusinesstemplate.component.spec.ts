import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbusinesstemplateComponent } from './groupbusinesstemplate.component';

describe('GroupbusinesstemplateComponent', () => {
  let component: GroupbusinesstemplateComponent;
  let fixture: ComponentFixture<GroupbusinesstemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupbusinesstemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbusinesstemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
