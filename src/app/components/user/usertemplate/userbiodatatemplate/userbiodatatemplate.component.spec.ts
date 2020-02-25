import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserbiodatatemplateComponent } from './userbiodatatemplate.component';

describe('UserbiodatatemplateComponent', () => {
  let component: UserbiodatatemplateComponent;
  let fixture: ComponentFixture<UserbiodatatemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserbiodatatemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserbiodatatemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
