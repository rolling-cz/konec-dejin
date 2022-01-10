import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UNIT_STATES, UNIT_TYPES, UNIT_VISIBILITIES } from '../../../../common/config';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.css']
})
export class UnitFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) { }

  unitForm: FormGroup;

  state: string;

  types = UNIT_TYPES
  states = UNIT_STATES
  visibilities = UNIT_VISIBILITIES

  @Input()
  path: string

  ngOnInit() {
    this.unitForm = this.fb.group({
      name: [''],
      keyword: [''],
      type: [''],
      state: [''],
      visibility: [''],
      publicInfo: [''],
      delegateInfo: [''],
      internalInfo: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.unitForm.controls.name.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.object(this.path).remove()
        }
      })
  }

}
