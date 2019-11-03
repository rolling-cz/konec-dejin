import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-delegate-form',
  templateUrl: './delegate-form.component.html',
  styleUrls: ['./delegate-form.component.css']
})
export class DelegateFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  delegateForm: FormGroup;

  state: string;

  @Input()
  path: string

  ngOnInit() {
    this.delegateForm = this.fb.group({
      name: [''],
      password: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

  delete() {
    this.db.object(this.path.replace("delegates", "delegateRounds")).remove()
    this.db.object(this.path).remove()
  }

}
