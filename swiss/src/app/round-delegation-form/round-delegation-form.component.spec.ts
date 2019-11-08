import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDelegationFormComponent } from './round-delegation-form.component';

describe('RoundDelegationFormComponent', () => {
  let component: RoundDelegationFormComponent;
  let fixture: ComponentFixture<RoundDelegationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundDelegationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDelegationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
