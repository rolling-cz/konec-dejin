import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundDelegateFormComponent } from './round-delegate-form.component';

describe('RoundDelegateFormComponent', () => {
  let component: RoundDelegateFormComponent;
  let fixture: ComponentFixture<RoundDelegateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundDelegateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundDelegateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
