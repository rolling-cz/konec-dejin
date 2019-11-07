import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TENSES } from '../../../../common/config';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {

  @Input()
  roundId: string

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) {
  }

  roundForm: FormGroup;

  state: string;

  tenses = TENSES

  path

  delegatePaths: Observable<string[]>

  ngOnInit() {
    this.path = "rounds/" + this.roundId
    this.roundForm = this.fb.group({
      name: [''],
      tense: [''],
      deadline: ['']
    })
    this.delegatePaths = this.db.list("delegateRounds").snapshotChanges().pipe(
      map(
        snapshots => {
          return snapshots.map(snapshot => "delegateRounds/" + snapshot.key + "/" + this.roundId)
        })
    )
  }

  changeHandler(state) {
    this.state = state
  }

}
