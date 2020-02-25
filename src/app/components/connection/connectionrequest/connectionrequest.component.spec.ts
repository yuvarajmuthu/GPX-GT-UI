import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionrequestComponent } from './connectionrequest.component';

describe('ConnectionrequestComponent', () => {
  let component: ConnectionrequestComponent;
  let fixture: ComponentFixture<ConnectionrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
