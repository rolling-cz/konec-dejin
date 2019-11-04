import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take, tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delegations',
  templateUrl: './delegations.component.html',
  styleUrls: ['./delegations.component.css']
})
export class DelegationsComponent implements OnInit {

  delegationPaths: Observable<string[]>

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegationPaths = this.db.list("delegations").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegations/" + snapshot.key)
        })
    )
  }

  addDelegation(form: NgForm) {
    if (form.valid) {
      let ref = this.db.list("delegations").push({
        name: form.value["name"],
        flag: form.value["flag"]
      })
      this.db.list("rounds").snapshotChanges().pipe(
        take(1),
        tap(
          snapshots => {
            snapshots.forEach(
              snapshot => {
                this.db.object("delegationRounds/"+ref.key+"/"+snapshot.key).set(
                  {
                    availableDf: form.value["defaultDf"],
                    delegateCount: 0
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
