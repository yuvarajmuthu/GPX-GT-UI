import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private jwtHelperService: JwtHelperService) { 

    }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //var token = localStorage.getItem('currentUserToken');
    console.log('this.jwtHelperService.isTokenExpired ', this.jwtHelperService.isTokenExpired);
    if(!this.jwtHelperService.isTokenExpired()){
      return true;
    }
    
    //this.router.navigate(['login']);
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});

    return false;
  }
}
