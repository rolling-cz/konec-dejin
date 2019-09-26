import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COUNTRIES, VISIBILITIES, ACTION_TYPES } from '../config';

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


