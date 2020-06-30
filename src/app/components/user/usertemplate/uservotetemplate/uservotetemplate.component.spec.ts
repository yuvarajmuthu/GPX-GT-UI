import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UservotetemplateComponent } from './uservotetemplate.component';

describe('UservotetemplateComponent', () => {
  let component: UservotetemplateComponent;
  let fixture: ComponentFixture<UservotetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UservotetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UservotetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
