import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { MychallengesComponent } from '../mychallenges/mychallenges.component';
import { MychallengesEditComponent } from '../mychallenges/mychallenges-edit/mychallenges-edit.component';
import { RankingComponent } from '../ranking/ranking.component';
import { SettingsComponent } from '../settings/settings.component';
import { AdminComponent } from '../admin/admin.component';
import { ChangesComponent } from '../changes/changes.component';

import { AdminGuard } from '../guards/admin.guard';
import { UserGuard } from '../guards/user.guard';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mychallenges', component: MychallengesEditComponent, canActivate: [UserGuard] },
  { path: 'profile/:id', component: MychallengesComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [UserGuard] },
  { path: 'ranking', component: RankingComponent },
  { path: 'changes', component: ChangesComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule {}
