import { Component, OnInit, Input } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { DelegationRoundInfo } from '../model';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-round-info',
  templateUrl: './round-info.component.html',
  styleUrls: ['./round-info.component.css']
})
export class RoundInfoComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }

  @Input()
  roundId: String

  @Input()
  delegationId: Observable<String>

  //info: Observable<DelegationRoundInfo>

  ngOnInit() {
    this.delegationId.subscribe(id => {
      console.log("id=" + id)
    })
    /*
    this.info = combineLatest<DelegationRoundInfo>(
      this.db.object("rounds/" + this.roundId).valueChanges(),
      this.db.object("delegations/" + this.delegationId).valueChanges(),
      this.db.object("delegationRounds/" + this.delegationId + "/" + this.roundId).valueChanges(),
      (round, delegation, delegationRound) => {
        return { name: delegation["name"], country: delegation["country"], deadline: round["deadline"], leader: delegationRound["leader"], presentRound: round["tense"] == "present" }
      }
    )*/
  }

}
