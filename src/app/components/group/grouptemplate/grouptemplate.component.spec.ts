import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouptemplateComponent } from './grouptemplate.component';

describe('GrouptemplateComponent', () => {
  let component: GrouptemplateComponent;
  let fixture: ComponentFixture<GrouptemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouptemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouptemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
