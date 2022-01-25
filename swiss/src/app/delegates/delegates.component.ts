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

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.delegatePaths = this.db.list("delegates").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegates/" + snapshot.key)
        })
    )
  }

  addDelegate(form: NgForm) {
    if (form.valid) {
      let ref = this.db.list("delegates").push({
        name: form.value["name"],
        password: form.value["password"]
      })
    }
  }
}