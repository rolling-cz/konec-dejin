import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Round } from '../model';

@Component({
  selector: 'app-rounds',
  templateUrl: './rounds.component.html',
  styleUrls: ['./rounds.component.css']
})
export class RoundsComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }

  rounds: Observable<Round[]>
  selectedTab: number

  ngOnInit() {
    this.rounds = this.db.list<Round>("rounds", ref => ref.orderByChild("deadline"))
      .snapshotChanges()
      .pipe(map(snaps =>
        snaps.map(snap => {
          let val = snap.payload.val()
          let suffix = (val["tense"] == "past") ? " (proběhlo)" : (val["tense"] == "present") ? " (aktuální)" : ""
          return { id: snap.key, name: val["name"] + suffix, tense: val["tense"] }
        }
        )), map(rounds => {
          for (let i = 0; i < rounds.length; i++) {
            const round = rounds[i];
            if (round.name.includes("(aktuální)")) {
              this.selectedTab = i;
            }
          }
          return rounds
        }
        ));
  }

}
