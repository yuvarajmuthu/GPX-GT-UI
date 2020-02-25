import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
//import 'rxjs/add/observable/throw';
//import 'rxjs/add/operator/catch';

import {AuthenticationService} from '../services/authentication.service';

@Injectable()

//OBSOLETE
//auth0/angular2-jwt IS BEING USED INSTEAD
export class AppHttpInterceptor implements HttpInterceptor{
    constructor(public auth: AuthenticationService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
      //request = request.clone({
      //  headers: request.headers.set('Authorization', this.auth.getBearerToken())
      //});
      return next.handle(request);
    }
}
