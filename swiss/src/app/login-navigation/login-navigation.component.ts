import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SignInResponse } from '../model';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-navigation',
  templateUrl: './login-navigation.component.html',
  styleUrls: ['./login-navigation.component.css']
})
export class LoginNavigationComponent implements OnInit {
  constructor(public firebaseAuth: AngularFireAuth, public http: HttpClient, public db: AngularFireDatabase) {
  }

  title = "DND Admin"
  passwordError = false
  loading = false
  initializing = true
  signedIn: Observable<boolean>
  selectedMenuItem = "rounds"

  ngOnInit() {
    this.signedIn = this.firebaseAuth.authState.pipe(
      map(state => (state != null)),
      tap(_ => {
        this.initializing = false
      })
    )
  }

  login(password) {
    this.loading = true
    this.passwordError = false
    let passwordValue = (password == undefined) ? "" : password.value
    this.http.get<SignInResponse>("https://us-central1-dune-new-dawn.cloudfunctions.net/swissLogin?password=" + passwordValue).subscribe(
      (data: SignInResponse) => {
        if (data.invalidPassword) {
          this.loading = false
          this.passwordError = true
        } else {
          this.passwordError = false
          this.firebaseAuth.auth.signInWithCustomToken(data.token);
        }
      }
    )
  }

  logout() {
    this.loading = false
    this.firebaseAuth.auth.signOut();
  }

}
