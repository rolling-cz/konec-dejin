import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatIconModule } from '@angular/material';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginNavigationComponent } from './login-navigation/login-navigation.component';
import { RoundsComponent } from './rounds/rounds.component';
import { PastRoundComponent } from './past-round/past-round.component';
import { PresentRoundComponent } from './present-round/present-round.component';
import { FutureRoundComponent } from './future-round/future-round.component';
import { HttpClientModule } from '@angular/common/http';
import { RoundInfoComponent } from './round-info/round-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginNavigationComponent,
    RoundsComponent,
    PastRoundComponent,
    PresentRoundComponent,
    FutureRoundComponent,
    RoundInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
