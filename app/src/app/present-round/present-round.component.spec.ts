import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentRoundComponent } from './present-round.component';

describe('PresentRoundComponent', () => {
  let component: PresentRoundComponent;
  let fixture: ComponentFixture<PresentRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresentRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
