import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UNIT_STATES, UNIT_TYPES, UNIT_VISIBILITIES, ValueName } from '../../../../common/config';
import { Papa } from 'ngx-papaparse';

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

  importUnits(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let papa = new Papa()
      papa.parse(fileReader.result as string, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          result.data.forEach(el => {
            this.db.list("units").push({
              name: el["Název"],
              delegate: this.delegateId,
              publicInfo: el["Veřejné info"],
              delegateInfo: el["Info pro hráče"],
              internalInfo: el["Info pro orgy"],
              type: el["Typ jednotky"],
              state: el["Stav jednotky"],
              visibility: el["Viditelnost jednotky"]
            })
          });
        }
      })
    }
    fileReader.readAsText(file.value.files[0]);
  }

}
