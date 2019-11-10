import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RoundsComponent } from './rounds/rounds.component';
import { DelegationsComponent } from './delegations/delegations.component';
import { DelegatesComponent } from './delegates/delegates.component';
import { DelegateFormComponent } from './delegate-form/delegate-form.component';
import { FireFormDirective } from './fire-form.directive';
import { DelegationFormComponent } from './delegation-form/delegation-form.component';
import { RoundComponent } from './round/round.component';
import { RoundDelegateFormComponent } from './round-delegate-form/round-delegate-form.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { RoundDelegationFormComponent } from './round-delegation-form/round-delegation-form.component';
import { NewRoundComponent } from './new-round/new-round.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginNavigationComponent,
    RoundsComponent,
    DelegationsComponent,
    DelegatesComponent,
    FireFormDirective,
    DelegateFormComponent,
    DelegationFormComponent,
    RoundComponent,
    RoundDelegateFormComponent,
    RoundDelegationFormComponent,
    NewRoundComponent,
    DeleteConfirmDialogComponent
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
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MaterialFileInputModule,
    MatButtonToggleModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    DeleteConfirmDialogComponent
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'cs' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

registerLocaleData(localeCs, 'cs');
