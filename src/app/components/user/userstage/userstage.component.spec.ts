import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstageComponent } from './userstage.component';

describe('UserstageComponent', () => {
  let component: UserstageComponent;
  let fixture: ComponentFixture<UserstageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
