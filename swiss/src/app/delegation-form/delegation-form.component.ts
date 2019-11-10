import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styleUrls: ['./delegation-form.component.css']
})
export class DelegationFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) { }

  delegationForm: FormGroup;

  state: string;

  @Input()
  path: string

  ngOnInit() {
    this.delegationForm = this.fb.group({
      name: [''],
      flag: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.delegationForm.controls.name.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.object(this.path.replace("delegations", "delegationRounds")).remove()
          this.db.object(this.path).remove()
        }
      })
  }

}
