import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsraadComponent } from './landsraad.component';

describe('LandsraadComponent', () => {
  let component: LandsraadComponent;
  let fixture: ComponentFixture<LandsraadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandsraadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsraadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
