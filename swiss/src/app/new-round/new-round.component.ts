import { Component, OnInit } from '@angular/core';
import { TENSES } from '../../../../common/config';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-round',
  templateUrl: './new-round.component.html',
  styleUrls: ['./new-round.component.css']
})
export class NewRoundComponent implements OnInit {

  tenses = TENSES

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  addRound(form: NgForm) {
    if (form.valid) {
      this.db.list("rounds").push({
        name: form.value["name"],
        deadline: form.value["deadline"],
        tense: form.value["tense"]
      })
    }
  }

}
