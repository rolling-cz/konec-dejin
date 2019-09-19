import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureRoundComponent } from './future-round.component';

describe('FutureRoundComponent', () => {
  let component: FutureRoundComponent;
  let fixture: ComponentFixture<FutureRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
