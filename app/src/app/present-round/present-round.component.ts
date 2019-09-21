import { Component, OnInit } from '@angular/core';
import { Action } from '../model';
import { COUNTRIES, VISIBILITIES, ACTION_TYPES } from '../config';

@Component({
  selector: 'app-present-round',
  templateUrl: './present-round.component.html',
  styleUrls: ['./present-round.component.css']
})
export class PresentRoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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