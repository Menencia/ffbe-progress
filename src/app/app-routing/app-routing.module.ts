import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MychallengesComponent } from '../mychallenges/mychallenges.component';
import { MychallengesEditComponent } from '../mychallenges/mychallenges-edit/mychallenges-edit.component';
import { RankingComponent } from '../ranking/ranking.component';
import { AdminComponent } from '../admin/admin.component';

import { AdminGuard } from '../guards/admin.guard';

const appRoutes: Routes = [
  { path: 'mychallenges', component: MychallengesEditComponent },
  { path: 'profile/:id', component: MychallengesComponent },
  { path: 'ranking', component: RankingComponent },
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
