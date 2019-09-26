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

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.delegateId = this.auth.auth.currentUser.uid
  }

  @Input()
  roundId: string

  primaryActionPaths: Observable<string[]>
  secondaryActionPaths: Observable<string[]>
  sent = false
  delegateId: string

  ngOnInit() {
    // TODO: get delegation id here and flatmap it with actions
    let delegateActions = this.db.list("actions/" + this.roundId, ref => ref.orderByChild("delegate").equalTo(this.delegateId)).snapshotChanges()
    this.primaryActionPaths = delegateActions.pipe(map(snapshots => {
      return snapshots.filter(snapshot => snapshot.payload.val()["type"] == "main").map(snapshot => "actions/" + this.roundId + "/" + snapshot.key)
    }))
    this.secondaryActionPaths = delegateActions.pipe(map(snapshots => {
      return snapshots.filter(snapshot => snapshot.payload.val()["type"] != "main").map(snapshot => "actions/" + this.roundId + "/" + snapshot.key)
    }))
  }

  addSecondaryAction() {
    this.db.list("actions/"+this.roundId).push(<Action> {
      delegate : this.delegateId,
      delegation: 
    })
  }

  send() {
    this.sent = true;
  }
}