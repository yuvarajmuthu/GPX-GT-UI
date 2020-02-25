import { Observable, of } from 'rxjs';

import { AlertService } from './alert.service';

export class AbstractService {

  //constructor(private alertService: AlertService) { }
  constructor() { }  
      /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
 
  public log(message: string) {
    //this.alertService.success(message, true);

  }
}