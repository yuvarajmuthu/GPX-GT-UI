import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchlegislatorsComponent } from './searchlegislators.component';

describe('SearchlegislatorsComponent', () => {
  let component: SearchlegislatorsComponent;
  let fixture: ComponentFixture<SearchlegislatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchlegislatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchlegislatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
