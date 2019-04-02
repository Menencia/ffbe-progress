import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChallengesComponent } from '../challenges.component';
import { RankingComponent } from '../ranking/ranking.component';
import { PlayerComponent } from '../player/player.component';
import { AdminComponent } from '../admin/admin.component';

import { AdminGuard } from '../admin.guard';

const appRoutes: Routes = [
  { path: 'mychallenges', component: ChallengesComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'player/:id', component: PlayerComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/mychallenges', pathMatch: 'full' },
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
