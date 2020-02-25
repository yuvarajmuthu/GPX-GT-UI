import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserroletemplateComponent } from './userroletemplate.component';

describe('UserroletemplateComponent', () => {
  let component: UserroletemplateComponent;
  let fixture: ComponentFixture<UserroletemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserroletemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserroletemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
