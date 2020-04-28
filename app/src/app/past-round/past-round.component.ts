import { Component, OnInit, Input } from '@angular/core';
import { Action } from '../model';
import { COUNTRIES, ACTION_TYPES, VISIBILITIES } from "../../../../common/config"
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { flatMap, map, tap } from 'rxjs/operators';
import { findValueName } from '../../../../common/config';

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
            let spentDf
            if (vals.length == 0) {
              spentDf = 0
            } else {
              spentDf = vals.map(val => val["df"] || 0).reduce((sum, current) => sum + current)
            }
            this.spentDf.next(spentDf)
          }
        ))
      })
    )
    this.primaryActions = delegationActions.pipe(map(actions => {
      return actions.filter(action => action["type"] == "main" && !this.isSecretForMe(action)).map(action => action as Action)
    }))
    this.secondaryActions = delegationActions.pipe(map(actions => {
      return actions.filter(action => action["type"] != "main" && !this.isSecretForMe(action)).map(action => action as Action)
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
    let details = findValueName(COUNTRIES, action.targetCountry) + ", "
    if (action.df > 0) {
      details += action.df + " BV, "
    }
    if (action.type != "main") {
      details += findValueName(ACTION_TYPES, action.type) + ", "
    }
    details += findValueName(VISIBILITIES, action.visibility) + ", "
    return details
  }

  isSecretForMe(action: {}) {
    return action["visibility"] == "private" && action["delegate"] != this.delegateId 
  }

}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}