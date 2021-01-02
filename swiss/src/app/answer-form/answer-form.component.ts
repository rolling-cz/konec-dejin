import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-answer-form',
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.css']
})
export class AnswerFormComponent implements OnInit {
  
  constructor(private fb: FormBuilder, private db: AngularFireDatabase) { }

  answerForm: FormGroup;

  @Input()
  path: string

  ngOnInit() {
    this.answerForm = this.fb.group({
      name: ['']
    })
  }

}
