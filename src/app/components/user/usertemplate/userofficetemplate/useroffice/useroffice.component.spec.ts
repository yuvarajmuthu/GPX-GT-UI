import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserofficeComponent } from './useroffice.component';

describe('UserofficeComponent', () => {
  let component: UserofficeComponent;
  let fixture: ComponentFixture<UserofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
