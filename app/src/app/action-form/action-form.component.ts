import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COUNTRIES, VISIBILITIES, ACTION_TYPES, VISIBILITIES_PRIMARY, ValueName } from '../../../../common/config';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material';
import { SelectProjectDialogComponent } from '../select-project-dialog/select-project-dialog.component';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.css']
})
export class ActionFormComponent implements OnInit {

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private auth: AngularFireAuth, private dialog: MatDialog) { }

  actionForm: FormGroup;

  state: string;

  countries = COUNTRIES
  secondaryVisibilities = VISIBILITIES
  primaryVisibilities = VISIBILITIES_PRIMARY
  actionTypes = ACTION_TYPES

  @Input()
  path: string

  ngOnInit() {
    this.actionForm = this.fb.group({
      description: [''],
      df: [0],
      title: [''],
      keyword: [''],
      targetCountry: [''],
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
  
  dfChanged(e) {
    let newDf = e.target.value
    if (newDf > 4) {
      this.actionForm.controls.df.setValue(4)
    }
    if (newDf < 0) {
      this.actionForm.controls.df.setValue(0)
    }
  }

  delete() {
    this.db.object(this.path).remove()
  }

  projectSelected() {
    let paths = this.path.split("/")
    let roundId = paths[1]
    this.dialog.open(SelectProjectDialogComponent, { data: roundId }).afterClosed().subscribe(
      result => {
        if (result) {
          this.actionForm.controls.keyword.setValue(result["value"])
          this.actionForm.controls.df.setValue(result["df"])
        }
      })
  }
}

