import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UservoteformComponent } from './uservoteform.component';

describe('UservoteformComponent', () => {
  let component: UservoteformComponent;
  let fixture: ComponentFixture<UservoteformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UservoteformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UservoteformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
