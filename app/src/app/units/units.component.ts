import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { findValueName, UNIT_STATES, UNIT_VISIBILITIES } from '../../../../common/config';
import { Unit } from '../model';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) { }

  units: Observable<Unit[]>
  knownUnits: Observable<Unit[]>

  ngOnInit() {
    let delegateId = this.auth.auth.currentUser.uid
    this.units = this.db.list("units", ref => ref.orderByChild("delegate").equalTo(delegateId)).valueChanges().pipe(
      map(
        units => {
          return units.filter(unit => {
            return unit["state"] == "alive" || unit["state"] == "dead" || unit["state"] == "other"
          }).sort((a, b) => {
            if (a["name"] < b["name"]) { return -1; }
            if (a["name"] > b["name"]) { return 1; }
            return 0;
          }).map(unit => {
            let state = findValueName(UNIT_STATES, unit["state"])
            let type = (unit["type"] == "active_hero" || unit["type"] == "army") ? "Aktivní" : "Pasivní"
            let visibility = findValueName(UNIT_VISIBILITIES, unit["visibility"])
            return { name: unit["name"], state: state, type: type, visibility: visibility, description: this.formatDescription(unit["delegateInfo"]) }
          })
        }
      )
    )
    this.knownUnits = combineLatest<Unit[]>(
      this.db.list("units").valueChanges(),
      this.db.object("delegates/" + delegateId + "/fremen").valueChanges(),
      (units, fremen) => {
        return units.filter(unit => {
          return unit["state"] == "alive" && unit["delegate"] != delegateId && (unit["visibility"] == "public" || (unit["visibility"] == "fremen" && fremen))
        }).sort((a, b) => {
          if (a["name"] < b["name"]) { return -1; }
          if (a["name"] > b["name"]) { return 1; }
          return 0;
        }).map(unit => {
          return { name: unit["name"], state: "", type: "", visibility: "", description: this.formatDescription(unit["publicInfo"]) }
        })
      }
    )
  }

  formatDescription(description: string) {
    return description.replace(/(?:\r\n|\r|\n)/g, '<br>') + "<br><br>";
  }

}
