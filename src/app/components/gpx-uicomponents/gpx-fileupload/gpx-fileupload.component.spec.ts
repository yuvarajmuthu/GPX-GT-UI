import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxFileuploadComponent } from './gpx-fileupload.component';

describe('GpxFileuploadComponent', () => {
  let component: GpxFileuploadComponent;
  let fixture: ComponentFixture<GpxFileuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpxFileuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxFileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
