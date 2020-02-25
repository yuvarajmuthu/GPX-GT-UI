import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GAddressSearchComponent } from './g-address-search.component';

describe('GAddressSearchComponent', () => {
  let component: GAddressSearchComponent;
  let fixture: ComponentFixture<GAddressSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GAddressSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GAddressSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
