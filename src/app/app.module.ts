import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../environments/firebase';
import { AuthService } from './services/auth.service';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { MychallengesEditComponent } from './mychallenges/mychallenges-edit/mychallenges-edit.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminChallengesComponent } from './admin/admin-challenges/admin-challenges.component';
import { AdminRanksComponent } from './admin/admin-ranks/admin-ranks.component';
import { MychallengesComponent } from './mychallenges/mychallenges.component';
import { RankingComponent } from './ranking/ranking.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { ChangesComponent } from './changes/changes.component';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

import { LocalizedDatePipe } from './pipes/localized-date.pipe';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AboutComponent } from './about/about.component';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MychallengesEditComponent,
    AdminComponent,
    AdminCategoriesComponent,
    AdminChallengesComponent,
    AdminRanksComponent,
    MychallengesComponent,
    RankingComponent,
    SettingsComponent,
    LocalizedDatePipe,
    HomeComponent,
    ChangesComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    AdminGuard,
    UserGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
