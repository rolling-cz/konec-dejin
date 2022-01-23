import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfoDialogComponent } from './edit-info-dialog.component';

describe('EditInfoDialogComponent', () => {
  let component: EditInfoDialogComponent;
  let fixture: ComponentFixture<EditInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
