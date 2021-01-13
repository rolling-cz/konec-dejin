import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDialog } from '@angular/material';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { Observable } from 'rxjs';
import { ValueName, PROJECT_TYPES } from '../../../../common/config';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) { }

  projectForm: FormGroup;

  state: string;

  delegations: Observable<ValueName[]>
  delegates: Observable<ValueName[]>
  types = PROJECT_TYPES

  @Input()
  path: string

  ngOnInit() {
    this.projectForm = this.fb.group({
      name: [''],
      keyword: [''],
      df: [0],
      enabled: [true],
      condition: [''],
      benefit: [''],
      instructions: ['']
    })
    this.delegations = this.db.list("delegations").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
    this.delegates = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.projectForm.controls.name.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.object(this.path).remove()
        }
      })
  }
}
