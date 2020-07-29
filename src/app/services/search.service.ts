import { Injectable, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of, from, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import { tagUser } from '../models/tagusers';

@Injectable({
  providedIn: 'root'
})
export class SearchService  extends AbstractService {
  serviceUrl:string;// = "http://127.0.0.1:8080/post";	
  devMode:boolean = true;

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
      super();
      this.serviceUrl = dataShareService.getServiceUrl() + "/post";
      this.devMode = isDevMode();

  }

  getUsers(searchText:string) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }  
    let url = "";
    //searchText = searchText.replace( /\".*?\"/, '' ).replace(/\s+/g,' ').trim();

    if(this.devMode){
      url = '/assets/json/fromService/tagusers.json'; 
    }else{
      url = this.dataShareService.searchServiceUrl+"/search/user?multiSearchText="+searchText;
    }

    //url = this.dataShareService.searchServiceUrl+"/search/user?multiSearchText="+searchText; 
          url = '/assets/json/fromService/tagusers.json'; 

    return this.http.get(url,httpOptions).
        pipe(
           map((data: tagUser[]) => {
             console.log(data);
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
    }
}
