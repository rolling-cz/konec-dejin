import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delegates',
  templateUrl: './delegates.component.html',
  styleUrls: ['./delegates.component.css']
})
export class DelegatesComponent implements OnInit {

  delegatePaths: Observable<string[]>
  delegations: Observable<Delegation[]>

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegatePaths = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegates/" + snapshot.key)
        })
    )
    this.delegations = this.db.list("delegations").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { id: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
  }

  addDelegate(form: NgForm) {
    if (form.valid) {
      let ref = this.db.list("delegates").push({
        name: form.value["name"],
        password: form.value["password"]
      })
      this.db.list("rounds").snapshotChanges().pipe(
        take(1),
        tap(
          snapshots => {
            snapshots.forEach(
              snapshot => {
                this.db.object("delegateRounds/" + ref.key + "/" + snapshot.key).set(
                  {
                    delegation: form.value["defaultDelegation"],
                    markedAsSent: false,
                    mainActions: (form.value["defaultLeader"] == true) ? 3 : 2
                  }
                )
                if (form.value["defaultLeader"] == true) {
                  this.db.object("delegationRounds/" + form.value["defaultDelegation"] + "/" + snapshot.key).update(
                    {
                      leader: ref.key
                    }
                  )
                }
              }
            )
          }
        )
      ).subscribe()
    }
  }
}

interface Delegation {
  id: string,
  name: string
}