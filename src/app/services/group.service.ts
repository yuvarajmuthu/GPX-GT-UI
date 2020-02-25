import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//import { Legislator } from './../models/legislator';

import {AbstractService} from './abstract.service';
import {DatashareService} from "./datashare.service";

@Injectable({
  providedIn: 'root'
})
export class GroupService extends AbstractService {
  serviceUrl:string;// = "http://127.0.0.1:8080/group";
  
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, private dataShareService:DatashareService) {
    super();

    this.serviceUrl = dataShareService.getServiceUrl() + "/group";
  }
    
  result:any; 
  resultop:any;

//NOT USED  
getGroupDataByName_External(searchParam:string, type:string):Observable<any>{
    //required for using jsonp. JSONP is used to get data from cross domain
    console.log("getGroupByName() in Group service - searchParam " + searchParam);
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    let url:string;
    if(type == 'googleCivic'){ // get Congress legislators by Division id
      //find District
      //searchParam = "gettysburg montessori charter school";
      url = "https://www.googleapis.com/civicinfo/v2/divisions?key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY&query=" +  searchParam;
      //https://www.googleapis.com/civicinfo/v2/divisions?query="ocd-division/country:us/state:pa/cd:6"&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY
      //https://www.googleapis.com/civicinfo/v2/divisions?query="gettysburg montessori charter school"&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY
    }


    console.log('getGroupByName API - ' + url);  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());

    return this.http.get(url, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()), 
      tap(_ => this.log(`fetched getGroupByName`)),
      catchError(this.handleError<any>(`Error in getGroupByName()`))
    );                                       
} 

//GET THE GROUP INFO BY 
//-GROUP ID OR EXTERNAL SOURCE ID
//OTHERWISE SHOULD CREATE THE GROUP WITH DEFAULT PROFILE INFORMATION
  getGroupData(type:string, sourceId:string):Observable<any> { 
    /*
    let groupData = this.http.get('/app/data/json/fromService/group.json')
                             .map((response:Response) => response.json());
    console.log("group data " + groupData);
    return groupData;
*/  
  if(type == "CREATE"){
      // return this.http.get('/app/data/json/fromService/group.json')
      //                          .map((response:Response) => response.json());
      return this.http.get("/assets/json/fromService/group.json", this.httpOptions)
      .pipe(
        map((response:Response) => response.json()), 
        tap(_ => this.log(`fetched getGroupData`)),
        catchError(this.handleError<any>(`Error in getGroupData()`))
      );                                                        
      //TODO
      //DO NOT SHOW SOURCEID IN THIS CASE OR SHOULD HAVE GROUP ID                           
    }else{
      let serviceUrl = this.serviceUrl + "/" + type;
      //this.serviceUrl = this.serviceUrl + "/" + type;
      console.log("getGroup group.service this.serviceUrl " + serviceUrl);
     //let bodyString = JSON.stringify(post); // Stringify payload
      let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
      
      if(sourceId != null){
        serviceUrl = serviceUrl + "?externalId=" + sourceId;
      }

      //let options       = new RequestOptions({ headers: headers}); // Create a request option
      /*
      .switchMap(
        
        res1 => {
          if(res1.status === 200){
            this.http.get('/app/data/json/fromService/group.json');
          }
        }
       
      )
       */
      return this.http.get(serviceUrl, this.httpOptions)
      .pipe(
        //map((response:Response) => response.json()), 
        tap(_ => this.log(`fetched getGroupData`)),
        catchError(error => {
          console.log(error);
          this.handleErrorGetGroupData(error, sourceId);
      	  return of(null);
        })
        //catchError(this.handleError<any>(`Error in getUserData()`))
      );                         
       
    }

  }

  handleErrorGetGroupData(error:any, sourceId:string){
    if(error.status === 404){//NOT FOUND
      return this.http.get("/assets/json/fromService/group.json", this.httpOptions)
      .pipe(
        map((response:Response) => {
          let outputJson = response.json();
          let output = JSON.parse(JSON.stringify(response.text));
          let data:[{}] =output['profileData'][0].data;
          //TODO
          //searched District does not exist in the system, user shall create one
          if(sourceId != null){
            output['profileData'][0].data.push({"sourceId":sourceId});
            response = output;//JSON.parse(output);
            console.log('Modified response ', JSON.stringify(response));
          }
          return response;
        }), 
        tap(_ => this.log(`fetched handleErrorGetGroupData`)),
        catchError(this.handleError<any>(`Error in handleErrorGetGroupData()`))
      );


    }else{
      console.error('UI error handling' + JSON.stringify(error));
      return Observable.throw(error.json().error || 'Server error')
    }
  }

  createGroup(request:string):Observable<any>{
    console.log("createGroup group.service " + request + " this.serviceUrl " + this.serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    // return this.http.post(this.serviceUrl, request, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    
    return this.http.post(this.serviceUrl, request, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`posted createGroup`)),
      catchError(this.handleError<any>(`Error in createGroup()`))
    );  
  }

  updateGroup(groupId:string, request:string):Observable<any>{
    let serviceUrl = this.serviceUrl + "/" + groupId;
    console.log("updateGroup group.service " + request + " this.serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    // let options       = new RequestOptions({ headers: headers }); // Create a request option

    // return this.http.put(serviceUrl, request, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    return this.http.put(this.serviceUrl, request, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`posted updateGroup`)),
      catchError(this.handleError<any>(`Error in updateGroup()`))
    );                   
  }

}
