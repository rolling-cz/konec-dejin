import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundBvFormComponent } from './round-bv-form.component';

describe('RoundBvFormComponent', () => {
  let component: RoundBvFormComponent;
  let fixture: ComponentFixture<RoundBvFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundBvFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundBvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
