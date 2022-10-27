import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnlyAdminGuard implements CanActivate {

  constructor(public srvAuth:AuthService){};

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      return this.srvAuth.isActualSessionAdministrador();
    }
  
}
