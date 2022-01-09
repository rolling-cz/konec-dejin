import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-round-bv-form',
  templateUrl: './round-bv-form.component.html',
  styleUrls: ['./round-bv-form.component.css']
})
export class RoundBvFormComponent implements OnInit {

  @Input()
  path: string

  bvForm: FormGroup;

  state: string;

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) { }

  ngOnInit() {
    this.bvForm = this.fb.group({
      description: [''],
      bv: [0]
    })
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.bvForm.controls.description.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.object(this.path).remove()
        }
      })
  }

}
