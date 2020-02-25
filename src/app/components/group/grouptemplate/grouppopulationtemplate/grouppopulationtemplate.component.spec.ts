import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrouppopulationtemplateComponent } from './grouppopulationtemplate.component';

describe('GrouppopulationtemplateComponent', () => {
  let component: GrouppopulationtemplateComponent;
  let fixture: ComponentFixture<GrouppopulationtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrouppopulationtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrouppopulationtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
