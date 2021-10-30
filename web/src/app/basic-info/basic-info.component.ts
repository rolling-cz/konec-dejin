import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  title = "Duna: Válka Assasinů"

  signUp() {
    window.location.href = "https://forms.gle/eSuPg9A6A67Z2G4v8"
  }

  factions() {
    window.location.href = "https://drive.google.com/file/d/1FXN7Kq3A16ejNjy29b2BMBiraP9dUPEV/view?usp=sharing"
  }
}
