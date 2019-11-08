import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap, combineAll } from 'rxjs/operators';

@Component({
  selector: 'app-round-delegation-form',
  templateUrl: './round-delegation-form.component.html',
  styleUrls: ['./round-delegation-form.component.css']
})
export class RoundDelegationFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  delegationForm: FormGroup;

  state: string;

  @Input()
  path: string

  name: Observable<string>

  delegates: Observable<Delegate[]>

  ngOnInit() {
    this.delegationForm = this.fb.group({
      leader: [''],
      message: [''],
      availableDf: [0]
    })
    let paths = this.path.split("/")
    let delegationId = paths[1]
    let roundId = paths[2]
    this.name = this.db.object("delegations/" + delegationId + "/name").valueChanges() as Observable<string>
    this.delegates =
      combineLatest(
        this.db.list("delegateRounds").snapshotChanges(),
        this.db.list("delegates").snapshotChanges(),
        (delegateRounds, delegates) => {
          return delegateRounds
            .map(snapshot => {
              return { delegateId: snapshot.key, delegationId: snapshot.payload.val()[roundId]["delegation"] }
            })
            .filter(value => (value.delegationId == delegationId))
            .map(value => { return <Delegate>{ id: value.delegateId, name: findName(delegates, value.delegateId) } })
        }
      )
  }

  changeHandler(state) {
    this.state = state
  }

}

function findName(snapshots: AngularFireAction<DatabaseSnapshot<any>>[], id: string) {
  return snapshots.find((row) => row.key == id).payload.val()["name"]
}

interface Delegate {
  id: string,
  name: string
}