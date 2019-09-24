import { Component, OnInit, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { DelegationRoundInfo } from '../model';
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

  roundInfo: Observable<DelegationRoundInfo>

  ngOnInit() {
    this.roundInfo = this.db.object("delegateRounds/" + this.auth.auth.currentUser.uid + "/" + this.roundId + "/delegation").valueChanges().pipe(
      flatMap((delegationId, _) => {
        return combineLatest<DelegationRoundInfo>(
          this.db.object("rounds/" + this.roundId).valueChanges(),
          this.db.object("delegations/" + delegationId).valueChanges(),
          this.db.object("delegationRounds/" + delegationId + "/" + this.roundId + "/leader").valueChanges().pipe(
            flatMap(leaderId => this.db.object("delegates/" + leaderId + "/name").valueChanges())
          ),
          (round, delegation, leaderName) => {
            return { name: delegation["name"], country: delegation["country"], deadline: round["deadline"], leader: leaderName, presentRound: round["tense"] == "present" }
          }
        )
      }
      ))
  }

}
