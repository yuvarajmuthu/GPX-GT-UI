import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereventformComponent } from './usereventform.component';

describe('UsereventformComponent', () => {
  let component: UsereventformComponent;
  let fixture: ComponentFixture<UsereventformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsereventformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsereventformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
