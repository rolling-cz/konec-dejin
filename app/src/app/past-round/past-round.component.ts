import { Component, OnInit, Input } from '@angular/core';
import { Action } from '../model';
import { COUNTRIES, ACTION_TYPES, VISIBILITIES } from "../../../../common/config"
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { flatMap, map, tap } from 'rxjs/operators';
import { ValueName } from '../../../../common/config';

@Component({
  selector: 'app-past-round',
  templateUrl: './past-round.component.html',
  styleUrls: ['./past-round.component.css']
})
export class PastRoundComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.delegateId = this.auth.auth.currentUser.uid
  }

  @Input()
  roundId: string

  delegateId: string
  primaryActions: Observable<Action[]>
  secondaryActions: Observable<Action[]>
  spentDf = new BehaviorSubject<number>(0)

  ngOnInit() {
    let delegationActions = this.db.object("delegateRounds/" + this.delegateId + "/" + this.roundId + "/delegation").valueChanges().pipe(
      flatMap((delegationId, _) => {
        return this.db.list("actions/" + this.roundId, ref => ref.orderByChild("delegation").equalTo(delegationId as string)).valueChanges().pipe(tap(
          vals => {
            let spentDf = vals.map(val => val["df"] || 0).reduce((sum, current) => sum + current)
            this.spentDf.next(spentDf)
          }
        ))
      })
    )
    this.primaryActions = delegationActions.pipe(map(actions => {
      return actions.filter(action => action["type"] == "main").map(action => action as Action)
    }))
    this.secondaryActions = delegationActions.pipe(map(actions => {
      return actions.filter(action => action["type"] != "main").map(action => action as Action)
    }))
  }

  formatDoneActionDescription(action: Action) {
    let description = action.description
    if (!isBlank(action.keyword)) {
      description += " (" + action.keyword + ")"
    }
    return description
  }

  formatDoneActionDetails(action: Action) {
    let details = findRowName(COUNTRIES, action.targetCountry) + ", "
    if (action.df > 0) {
      details += action.df + " DF, "
    }
    if (action.type != "main") {
      details += findRowName(ACTION_TYPES, action.type) + ", "
    }
    details += findRowName(VISIBILITIES, action.visibility) + ", "
    return details
  }

}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function findRowName(rows: ValueName[], value: string) {
  return rows.find((row) => row.value == value).name
}
