import { Component, OnInit, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { RoundInfo } from '../model';
import { flatMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { calculateDelegateDf } from '../../../../common/config';

@Component({
  selector: 'app-round-info',
  templateUrl: './round-info.component.html',
  styleUrls: ['./round-info.component.css']
})
export class RoundInfoComponent implements OnInit {

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) { }

  @Input()
  roundId: string

  @Input()
  spentDf: Observable<number>

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
          this.spentDf,
          (round, delegation, leaderName, delegationRound, spentDf) => {
            let presentRound = round["tense"] == "present"
            let delegationAvailableDf = delegationRound["availableDf"]
            let availableDf = (presentRound) ? calculateDelegateDf(delegationAvailableDf, delegationRound["delegateCount"], delegationRound["leader"] == delegateId) : delegationAvailableDf
            let df = (presentRound) ? availableDf-spentDf : spentDf
            return { name: delegation["name"], flag: delegation["flag"], deadline: round["deadline"], leader: leaderName, presentRound: presentRound, message: delegationRound["message"], availableDf: availableDf, df: df }
          }
        )
      }
      ))
  }

}
