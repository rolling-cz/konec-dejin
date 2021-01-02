import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private dialog: MatDialog) { }

  questionForm: FormGroup;

  state: string;

  questionId: string;

  @Input()
  path: string

  answerPaths: Observable<string[]>

  ngOnInit() {
    this.questionForm = this.fb.group({
      name: ['']
    })
    let paths = this.path.split("/")
    this.questionId = paths[2]
    this.answerPaths = this.db.list("landsraad/answers/" + this.questionId).snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "landsraad/answers/" + this.questionId + "/" + snapshot.key)
        })
    )
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.dialog.open(DeleteConfirmDialogComponent, { data: this.questionForm.controls.name.value }).afterClosed().subscribe(
      result => {
        if (result) {
          this.db.object("landsraad/answers/"+this.questionId).remove();
          this.db.object(this.path).remove()
        }
      })
  }

}
