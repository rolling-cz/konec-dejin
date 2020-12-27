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
      this.db.list("delegations").push({
        name: form.value["name"],
        flag: form.value["flag"]
      })
    }
  }
}
