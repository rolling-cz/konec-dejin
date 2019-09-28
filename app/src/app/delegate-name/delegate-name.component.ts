import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delegate-name',
  templateUrl: './delegate-name.component.html',
  styleUrls: ['./delegate-name.component.css']
})
export class DelegateNameComponent implements OnInit {
  

  constructor(public db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.currentDelegateId = this.auth.auth.currentUser.uid
  }

  @Input()
  delegateId: string
  currentDelegateId: string;
  delegateName: Observable<string>

  ngOnInit() {
    this.delegateName = this.db.object("delegates/"+this.delegateId+"/name").valueChanges() as Observable<string>
  }

}
