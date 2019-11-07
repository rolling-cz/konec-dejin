import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TENSES, COUNTRIES, findValueName, ACTION_TYPES, VISIBILITIES } from '../../../../common/config';
import { AngularFireDatabase, DatabaseSnapshot, AngularFireAction } from '@angular/fire/database';
import { Observable, combineLatest } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {

  @Input()
  roundId: string

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) {
  }

  roundForm: FormGroup;

  state: string;

  tenses = TENSES

  path

  delegatePaths: Observable<string[]>

  ngOnInit() {
    this.path = "rounds/" + this.roundId
    this.roundForm = this.fb.group({
      name: [''],
      tense: [''],
      deadline: ['']
    })
    this.delegatePaths = this.db.list("delegateRounds").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegateRounds/" + snapshot.key + "/" + this.roundId)
        })
    )
  }

  changeHandler(state) {
    this.state = state
  }

  exportActions() {
    combineLatest(
      this.db.list("actions/" + this.roundId).snapshotChanges(),
      this.db.list("delegates").snapshotChanges(),
      this.db.list("delegations").snapshotChanges(),
      (actions, delegates, delegations) => {
        return { actions: actions, delegates: delegates, delegations: delegations }
      }
    ).pipe(
      take(1),
      tap(
        combined => {
          let data = combined.actions.map(snapshot => {
            let values = snapshot.payload.val()
            return [
              findName(combined.delegates, values["delegate"]),
              findName(combined.delegations, values["delegation"]),
              values["description"],
              findValueName(COUNTRIES, values["targetCountry"]),
              values["df"] || "",
              values["keyword"] || "",
              findValueName(ACTION_TYPES, values["type"]),
              findValueName(VISIBILITIES, values["visibility"]),
              values["result"] || "",
              snapshot.key,
              values["delegate"],
              values["delegation"],
              values["targetCountry"]
            ]
          })
          let options = {
            headers: ["Delegát", "Delegace", "Popis akce", "Cílová země", "DF", "Klíčové slovo", "Typ akce", "Viditelnost", "Výsledek", "ID akce", "ID delegáta", "ID delegace", "ID země"]
          };
          new ngxCsv(data, 'Export akcí ' + this.roundForm.controls.name.value, options);
        }
      )
    ).subscribe()
  }

}

function findName(snapshots: AngularFireAction<DatabaseSnapshot<unknown>>[], id: string) {
  return snapshots.find((row) => row.key == id).payload.val()["name"]
}