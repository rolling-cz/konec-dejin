import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COUNTRIES, VISIBILITIES, ACTION_TYPES } from '../../../../common/config';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.css']
})
export class ActionFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  actionForm: FormGroup;

  state: string;

  countries = COUNTRIES
  visibilities = VISIBILITIES
  actionTypes = ACTION_TYPES

  @Input()
  path: string

  ngOnInit() {
    this.actionForm = this.fb.group({
      description: [''],
      df: [''],
      keyword: [''],
      targetCountry: [''],
      visibility: [''],
      type: ['']
    })
  }

  changeHandler(e) {
    let names = {
      'loading': "Načítání…",
      'modified': "Ukládání…",
      'synced': "Uloženo",
      'error': "Chyba ukládání!"
    }
    this.state = names[e]
  }
}


