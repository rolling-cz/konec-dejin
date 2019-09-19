import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastRoundComponent } from './past-round.component';

describe('PastRoundComponent', () => {
  let component: PastRoundComponent;
  let fixture: ComponentFixture<PastRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
