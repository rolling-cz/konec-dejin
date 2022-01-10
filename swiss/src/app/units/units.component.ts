import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UNIT_STATES, UNIT_TYPES, UNIT_VISIBILITIES, ValueName } from '../../../../common/config';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  delegates: Observable<ValueName[]>
  unitPaths: Observable<string[]>
  delegateId: string
  types = UNIT_TYPES
  states = UNIT_STATES
  visibilities = UNIT_VISIBILITIES

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
    this.delegateId = form.value["delegate"]
    this.unitPaths = this.db.list("units", ref => ref.orderByChild("delegate").equalTo(this.delegateId)).snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "units/" + snapshot.key)
        })
    )
  }

  addUnit(form: NgForm) {
    if (form.valid) {
      this.db.list("units").push({
        name: form.value["name"],
        keyword: form.value["keyword"],
        delegate: form.value["delegate"],
        publicInfo: form.value["publicInfo"],
        delegateInfo: form.value["delegateInfo"],
        internalInfo: form.value["internalInfo"],
        type: form.value["type"],
        state: form.value["state"],
        visibility: form.value["visibility"]
      })
    }
  }

}
