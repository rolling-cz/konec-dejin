import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { COUNTRIES } from '../config';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styleUrls: ['./delegation-form.component.css']
})
export class DelegationFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  delegationForm: FormGroup;
  countries = COUNTRIES

  state: string;

  @Input()
  path: string

  ngOnInit() {
    this.delegationForm = this.fb.group({
      name: [''],
      country: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.db.object(this.path.replace("delegations", "delegationRounds")).remove()
    this.db.object(this.path).remove()
  }

}
