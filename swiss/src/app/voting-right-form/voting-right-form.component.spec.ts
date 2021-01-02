import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingRightFormComponent } from './voting-right-form.component';

describe('VotingRightFormComponent', () => {
  let component: VotingRightFormComponent;
  let fixture: ComponentFixture<VotingRightFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingRightFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingRightFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
