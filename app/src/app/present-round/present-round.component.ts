import { Component, OnInit, Input } from '@angular/core';
import { Action } from '../model';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, flatMap, tap } from 'rxjs/operators';

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
  markedAsSent: Observable<boolean>
  delegateId: string
  delegationId: string
  spentDf = new BehaviorSubject<number>(0)

  ngOnInit() {
    let delegateActions = this.db.object("delegateRounds/" + this.delegateId + "/" + this.roundId + "/delegation").valueChanges().pipe(
      flatMap((delegationId, _) => {
        this.delegationId = delegationId as string
        return this.db.list("actions/" + this.roundId, ref => ref.orderByChild("delegate").equalTo(this.delegateId)).snapshotChanges().pipe(tap(
          snaps => {
            let spentDf = snaps.map(snap => snap.payload.val()["df"] || 0).reduce((sum, current) => sum + current)
            this.spentDf.next(spentDf)
          }
        ))
      })
    )
    this.primaryActionPaths = delegateActions.pipe(map(snapshots => {
      return snapshots.filter(snapshot => snapshot.payload.val()["type"] == "main").map(snapshot => "actions/" + this.roundId + "/" + snapshot.key)
    }))
    this.markedAsSent = this.db.object("delegateRounds/" + this.delegateId + "/" + this.roundId + "/markedAsSent").valueChanges().pipe(
      map(val => {
        return val as boolean
      })
    )
  }

  send() {
    this.db.object("delegateRounds/" + this.delegateId + "/" + this.roundId + "/markedAsSent").set(true)
  }
}