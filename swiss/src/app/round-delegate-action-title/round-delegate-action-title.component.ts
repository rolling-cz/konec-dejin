import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-round-delegate-action-title',
  templateUrl: './round-delegate-action-title.component.html',
  styleUrls: ['./round-delegate-action-title.component.css']
})
export class RoundDelegateActionTitleComponent implements OnInit {

  @Input()
  path: string

  actionForm: FormGroup;

  state: string;

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.actionForm = this.fb.group({
      title: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

}
