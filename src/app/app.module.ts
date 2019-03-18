import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../environments/firebase';
import { AuthService } from './auth.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { ChallengesComponent } from './challenges.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';
import { AppRoutingModule } from './app-routing/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChallengesComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
