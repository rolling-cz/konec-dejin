import { Component, OnInit } from '@angular/core';
import { SIZES, TENSES } from '../../../../common/config';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-round',
  templateUrl: './new-round.component.html',
  styleUrls: ['./new-round.component.css']
})
export class NewRoundComponent implements OnInit {

  tenses = TENSES

  sizes = SIZES

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  addRound(form: NgForm) {
    if (form.valid) {
      let roundRef = this.db.list("rounds").push({
        name: form.value["name"],
        deadline: form.value["deadline"],
        tense: form.value["tense"],
        size: form.value["size"]
      })
      this.db.list("delegates").snapshotChanges().pipe(
        take(1),
        tap(
          delegates => {
            delegates.forEach(
              delegate => {
                this.db.object("delegateRounds/" + delegate.key + "/" + roundRef.key).set(
                  {
                    markedAsSent : false,
                    bv: 0
                  }
                )
              }
            )
          }
        )
      ).subscribe()
    }
  }

}
