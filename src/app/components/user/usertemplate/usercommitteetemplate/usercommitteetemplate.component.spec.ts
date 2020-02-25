import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercommitteetemplateComponent } from './usercommitteetemplate.component';

describe('UsercommitteetemplateComponent', () => {
  let component: UsercommitteetemplateComponent;
  let fixture: ComponentFixture<UsercommitteetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercommitteetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercommitteetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
