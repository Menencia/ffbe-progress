import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user$.pipe(
        take(1),
        map(user => user && user.admin),
        tap(isAdmin => {
          if (!isAdmin) {
            console.log('Access denied - Admins only');
          }
        })
      );
    }
}
