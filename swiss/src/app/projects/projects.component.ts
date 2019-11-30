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

  delegations: Observable<ValueName[]>
  delegates: Observable<ValueName[]>
  types = PROJECT_TYPES
  selectedType = "general"

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
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

  typeChanged(form: NgForm) {
    this.selectedType = form.value["type"]
  }

  addProject(form: NgForm) {
    if (form.valid) {
      this.db.list("projects").push({
        name: form.value["name"],
        keyword: form.value["keyword"],
        df: form.value["df"],
        mainActions: form.value["mainActions"],
        type: form.value["type"],
        delegation: this.selectedType == "delegation" ? form.value["delegation"] : null,
        delegate: this.selectedType == "delegate" ? form.value["delegate"] : null
      })
    }
  }
}