import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Legislator } from './../models/legislator';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends AbstractService{
  result:any; 
  resultop:any;

  serviceUrl:string;// = "http://127.0.0.1:8080/profile/template";
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, private dataShareService:DatashareService) {
    super();

    this.serviceUrl = dataShareService.getServiceUrl() + "/profile/template";
  }
  

  getProfileTemplateData(profileTemplateId:String):Observable<any> {    
      let serviceUrl = this.serviceUrl + "/getProfileTemplate/" + profileTemplateId;
      console.log("getProfileTemplateData profile.service this.serviceUrl " + serviceUrl);
      let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON

      return this.http.get(serviceUrl, this.httpOptions)
      .pipe(
        //map((response:Response) => response.json()), 
        tap(_ => this.log(`fetched getProfileTemplateData`)),
        catchError(this.handleError<any>(`Error in getProfileTemplateData()`))
      );                            
  }
  
  getAvailableProfileTemplatesForEntity(entityId:string, userType:string):Observable<any> {    
    let serviceUrl = this.serviceUrl + "/getAllProfileTemplates/" + entityId + "/";
    console.log("getAvailableProfileTemplatesForEntity profile.service this.serviceUrl " + serviceUrl);
    
    return this.http.get(serviceUrl, { responseType: 'json', params: {
      userType: userType
    } }).pipe(
      tap(_ => this.log(`fetched getAvailableProfileTemplatesForEntity`)),
      catchError(this.handleError<any>(`Error in getAvailableProfileTemplatesForEntity()`))
    );
  }

  getAvailableProfileTemplates(userType:string):Observable<any> {    
    let serviceUrl = this.serviceUrl + "/getAllProfileTemplates";
    console.log("getAvailableProfileTemplates profile.service this.serviceUrl " + serviceUrl);
    
    return this.http.get(serviceUrl, { responseType: 'json', params: {
      userType: userType
    } }).pipe(
      tap(_ => this.log(`fetched getAvailableProfileTemplates`)),
      catchError(this.handleError<any>(`Error in getAvailableProfileTemplates()`))
    );
}

}
