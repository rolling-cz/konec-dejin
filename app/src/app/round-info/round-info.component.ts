import { Component, OnInit, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { RoundInfo } from '../model';
import { flatMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-round-info',
  templateUrl: './round-info.component.html',
  styleUrls: ['./round-info.component.css']
})
export class RoundInfoComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) { }

  @Input()
  roundId: string

  roundInfo: Observable<RoundInfo>

  ngOnInit() {
    let delegateId = this.auth.auth.currentUser.uid
    this.roundInfo = this.db.object("delegateRounds/" + delegateId + "/" + this.roundId + "/delegation").valueChanges().pipe(
      flatMap((delegationId, _) => {
        return combineLatest<RoundInfo>(
          this.db.object("rounds/" + this.roundId).valueChanges(),
          this.db.object("delegations/" + delegationId).valueChanges(),
          this.db.object("delegationRounds/" + delegationId + "/" + this.roundId + "/leader").valueChanges().pipe(
            flatMap(leaderId => this.db.object("delegates/" + leaderId + "/name").valueChanges())
          ),
          this.db.object("delegationRounds/" + delegationId + "/" + this.roundId).valueChanges(),
          (round, delegation, leaderName, delegationRound) => {
            let presentRound = round["tense"] == "present"
            let delegationAvailableDf = delegationRound["availableDf"]
            let availableDf = (presentRound) ? this.calculateDelegateDf(delegationAvailableDf, delegationRound["delegateCount"], delegationRound["leader"] == delegateId) : delegationAvailableDf
            return { name: delegation["name"], country: delegation["country"], deadline: round["deadline"], leader: leaderName, presentRound: presentRound, message: delegationRound["message"], availableDf: availableDf }
          }
        )
      }
      ))
  }

  calculateDelegateDf(delegationDf: number, numberOfDelegates: number, leader: boolean): number {
    let dfToLeader = delegationDf*0.2
    let remainingDf = delegationDf - dfToLeader
    let dfPerDelegate = remainingDf / numberOfDelegates
    let dfForCurrentDelegate = (leader)? dfPerDelegate + dfToLeader : dfPerDelegate
    return Math.ceil(dfForCurrentDelegate)
  }

}
