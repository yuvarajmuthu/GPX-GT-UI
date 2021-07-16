import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let users = [{"username":"user6@gmail.com", "password":"password"}];

@Injectable()
export class MockHttpInterceptorService implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(handleRoute)).pipe(materialize()).pipe(delay(500)).pipe(dematerialize());

    function handleRoute() {
        switch (true) {
            case url.endsWith('/users/register') && method === 'POST':
                return null;//register();
            case url.endsWith('/login') && method === 'POST':
                return login();
            default:
                // pass through any requests not handled above
                return next.handle(request);
        }
    }
    function login() {
      console.log('login interceptor');
      let userData = JSON.parse(body);
      const user = users.find(x => x.username === userData.username && x.password === userData.password);
      if (!user) return error('Username or password is incorrect');
      let headers1:HttpHeaders = new HttpHeaders({
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MjY0NzQyOTgsImV4cCI6MTY1ODAxMDI5OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.YBSgmEoCscqBHkWKrGEQn8VGOU7cRZgXOTPy5x5C3zA'
    });

      //new HttpResponse({ status: 200, body, headers1 });
      return ok({
          username: user.username
        }, headers1);
  }

  function ok(body?, headers?) {
    return of(new HttpResponse({ status: 200, body, headers }))
  }

function unauthorized() {
    return throwError({ status: 401, error: { message: 'Unauthorised' } });
}

function error(message) {
    return throwError({ error: { message } });
}

function isLoggedIn() {
    return headers.get('Authorization') === 'Bearer fake-jwt-token';
}


  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockHttpInterceptorService,
  multi: true
};
