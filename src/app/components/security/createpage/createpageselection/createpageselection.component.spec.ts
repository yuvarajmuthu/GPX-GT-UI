import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepageselectionComponent } from './createpageselection.component';

describe('CreatepageselectionComponent', () => {
  let component: CreatepageselectionComponent;
  let fixture: ComponentFixture<CreatepageselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepageselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepageselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
