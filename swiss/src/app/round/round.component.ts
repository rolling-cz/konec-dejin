import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TENSES } from '../../../../common/config';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css']
})
export class RoundComponent implements OnInit {

  @Input()
  roundId: string

  constructor(private fb: FormBuilder) {
  }

  roundForm: FormGroup;

  state: string;

  tenses = TENSES

  path

  ngOnInit() {
    this.path = "rounds/"+this.roundId
    this.roundForm = this.fb.group({
      name: [''],
      tense: [''],
      deadline: ['']
    })
  }

  changeHandler(state) {
    this.state = state
  }

}
