import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ValueName, PROJECT_TYPES } from '../../../../common/config';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  delegates: Observable<ValueName[]>
  projectPaths: Observable<string[]>

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegates = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { value: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
  }

  delegateChanged(form: NgForm) {
    let delegateId = form.value["delegate"]
    this.projectPaths = this.db.list("projects", ref => ref.orderByChild("delegate").equalTo(delegateId)).snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "projects/" + snapshot.key)
        })
    )
  }

  addProject(form: NgForm) {
    if (form.valid) {
      this.db.list("projects").push({
        name: form.value["name"],
        keyword: form.value["keyword"],
        enabled: true,
        df: form.value["df"],
        mainActions: 1,
        type: "delegate",
        delegate: form.value["delegate"],
        condition: form.value["condition"],
        benefit: form.value["benefit"],
        instructions: form.value["instructions"]
      })
    }
  }
}