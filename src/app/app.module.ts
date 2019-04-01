import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminChallengesComponent } from './admin/admin-challenges/admin-challenges.component';
import { AdminRanksComponent } from './admin/admin-ranks/admin-ranks.component';
import { PlayerComponent } from './player/player.component';
import { RankingComponent } from './ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChallengesComponent,
    AdminComponent,
    AdminCategoriesComponent,
    AdminChallengesComponent,
    AdminRanksComponent,
    PlayerComponent,
    RankingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
