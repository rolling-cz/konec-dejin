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
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeZ6jLenoZqopLFfJfLuqqvkcjPJ0N_fCBHP8aM7gasjRmEcg/viewform?usp=sf_link"
  }

  factions() {
    window.location.href = "https://drive.google.com/file/d/1PejbmGb8gbK2b1Tq-SAprwdYnydwNMSK/view?usp=sharing"
  }
}
