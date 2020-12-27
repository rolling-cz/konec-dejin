import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingRoundComponent } from './processing-round.component';

describe('ProcessingRoundComponent', () => {
  let component: ProcessingRoundComponent;
  let fixture: ComponentFixture<ProcessingRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
