import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDelegateActionTitleComponent } from './round-delegate-action-title.component';

describe('RoundDelegateActionTitleComponent', () => {
  let component: RoundDelegateActionTitleComponent;
  let fixture: ComponentFixture<RoundDelegateActionTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundDelegateActionTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDelegateActionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
