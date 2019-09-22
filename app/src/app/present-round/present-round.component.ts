import { Component, OnInit, Input } from '@angular/core';
import { Action, DelegateRound } from '../model';
import { COUNTRIES, VISIBILITIES, ACTION_TYPES } from '../config';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-present-round',
  templateUrl: './present-round.component.html',
  styleUrls: ['./present-round.component.css']
})
export class PresentRoundComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) { }

  @Input()
  roundId: string

  delegationId: Observable<string>
  delegateId: string

  ngOnInit() {
    this.delegateId = this.auth.auth.currentUser.uid
    console.log("delegateRounds/" + this.delegateId + "/" + this.roundId)
    this.delegationId = this.db.object("delegateRounds/" + this.delegateId + "/" + this.roundId).valueChanges().pipe(
      map(val => {
        console.log("id="+val["delegation"]);
        return val["delegation"]
      })
    )
  }

  primaryActions: Action[] = [
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" },
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" },
    { description: "", df: 0, visibility: 'public', type: 'main', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
  ]
  secondaryActions: Action[] = [
    { description: "", df: 0, visibility: 'public', type: 'support', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
  ]
  sent = false
  availableDf = 60
  remainingDf = this.availableDf
  countries = COUNTRIES
  visibilities = VISIBILITIES
  actionTypes = ACTION_TYPES

  calculateRemainingDf(action: Action, newValue: number) {
    action.df = newValue
    let primarySum = this.primaryActions.reduce((sum, current) => sum + current.df, 0)
    let secondarySum = this.secondaryActions.reduce((sum, current) => sum + current.df, 0)
    this.remainingDf = this.availableDf - primarySum - secondarySum
  }

  addSecondaryAction() {
    this.secondaryActions.push(
      { description: "", df: 0, visibility: 'public', type: 'support', delegate: "Daniel Appleby", keyword: "", result: "", targetDelegation: "" }
    )
  }

  send() {
    this.sent = true;
  }
}