import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SignInResponse } from '../model';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { auth } from 'firebase';

@Component({
  selector: 'app-login-navigation',
  templateUrl: './login-navigation.component.html',
  styleUrls: ['./login-navigation.component.css']
})
export class LoginNavigationComponent implements OnInit {

  constructor(public firebaseAuth: AngularFireAuth, public http: HttpClient, public db: AngularFireDatabase) {
  }

  title = "Komunikace s vedením"
  passwordError = false
  loading = false
  initializing = true
  delegateName: Observable<string>
  spreadsheet: Observable<string>

  ngOnInit() {
    this.delegateName = this.firebaseAuth.authState.pipe(flatMap((state, _) => {
      if (state == null) {
        return of(null) as Observable<string>
      } else {
        this.spreadsheet = this.db.object("delegates/" + state.uid + "/spreadsheet").valueChanges() as Observable<string>
        return this.db.object("delegates/" + state.uid + "/name").valueChanges() as Observable<string>
      }
    }), tap(
      _ => {
        this.initializing = false
      }
    ))

  }

  login(password) {
    this.loading = true
    this.passwordError = false
    let passwordValue = (password == undefined) ? "" : password.value
    this.http.get<SignInResponse>("https://us-central1-dune-new-dawn.cloudfunctions.net/login?password=" + passwordValue).subscribe(
      (data: SignInResponse) => {
        if (data.invalidPassword) {
          this.loading = false
          this.passwordError = true
        } else {
          this.passwordError = false
          this.firebaseAuth.auth.signInWithCustomToken(data.token);
          this.ngOnInit()
        }
      }
    )
  }

  logout() {
    this.loading = false
    this.firebaseAuth.auth.signOut();
  }

}
