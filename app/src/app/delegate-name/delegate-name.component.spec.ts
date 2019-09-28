import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateNameComponent } from './delegate-name.component';

describe('DelegateNameComponent', () => {
  let component: DelegateNameComponent;
  let fixture: ComponentFixture<DelegateNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelegateNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegateNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
