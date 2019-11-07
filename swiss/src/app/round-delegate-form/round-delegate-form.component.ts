import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-round-delegate-form',
  templateUrl: './round-delegate-form.component.html',
  styleUrls: ['./round-delegate-form.component.css']
})
export class RoundDelegateFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  delegateForm: FormGroup;

  state: string;

  @Input()
  path: string

  name: Observable<string>

  delegations: Observable<Delegation[]>

  ngOnInit() {
    this.delegateForm = this.fb.group({
      delegation: [''],
      markedAsSent: [false]
    })
    let paths = this.path.split("/")
    let delegateId = paths[1]
    this.name = this.db.object("delegates/" + delegateId + "/name").valueChanges() as Observable<string>
    this.delegations = this.db.list("delegations").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => {
            return { id: snapshot.key, name: snapshot.payload.val()["name"] }
          })
        })
    )
  }

  changeHandler(state) {
    this.state = state
  }
}

interface Delegation {
  id: string,
  name: string
}
