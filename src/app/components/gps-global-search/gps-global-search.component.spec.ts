import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsGlobalSearchComponent } from './gps-global-search.component';

describe('GpsGlobalSearchComponent', () => {
  let component: GpsGlobalSearchComponent;
  let fixture: ComponentFixture<GpsGlobalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsGlobalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
