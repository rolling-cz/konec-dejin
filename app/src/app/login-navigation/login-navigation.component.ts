import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { SignInResponse } from '../model';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-login-navigation',
  templateUrl: './login-navigation.component.html',
  styleUrls: ['./login-navigation.component.css']
})
export class LoginNavigationComponent {

  constructor(public firebaseAuth: AngularFireAuth, public http: HttpClient, public db: AngularFireDatabase) {
    firebaseAuth.authState.subscribe((state) => {
      if (state == null) {
        this.showLogin = true
        this.showSignedIn = false
      } else {
        this.showLogin = false
        this.showSignedIn = true
        db.object("delegates/" + state.uid + "/name").valueChanges().subscribe(
          name =>
            this.delegateName = name as string
        )
      }
    })
  }

  title = "Komunikace s vládou"
  showLogin = false
  showSignedIn = false
  passwordError = false
  loading = false
  delegateName: string

  login(password) {
    this.loading = true
    this.passwordError = false
    let passwordValue = (password == undefined) ? "" : password.value
    this.http.get<SignInResponse>("https://us-central1-konec-dejin.cloudfunctions.net/login?password=" + passwordValue).subscribe(
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
