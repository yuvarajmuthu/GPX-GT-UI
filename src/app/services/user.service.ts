import { Injectable, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import {User} from '../models/user';
import { Connection } from '../models/connection';
import { URLSearchParams } from 'url';

// Import RxJs required methods:
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractService{
  serviceUrl:string;// = "http://127.0.0.1:8080/api/social";
  devMode:boolean;
  result:any; 
  resultop:any;

  private httpOptions = {
    //headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'http://localhost:4200'})
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
    super();
    //this.serviceUrl = dataShareService.getServiceUrl() + "/api/social";
    this.serviceUrl = this.getUserService();
    this.devMode = isDevMode();
  }

  getUserService():string{
    return this.dataShareService.getServiceUrl() + "/user";
  }
  
  getPostService():string{
    return this.dataShareService.getServiceUrl() + "/post";
  }
  
  getSocialService():string{
    return this.dataShareService.getServiceUrl() + "/api/social";
  }

  getUserData(userId:string, requestorId:string):Observable<any> { 
    let url:string;
    

    //bioguideId is of length 7 - sunfoundataion
    //if(userId.length == 7){

    //legis represent legislator     
    
    //DEV MODE
    if(this.devMode){
        url = '/assets/json/fromService/user-legis-LEGISLATOROPENSTATE.json';   
        //url = '/assets/json/fromService/user-public.json';
      
    }else{
    //PROD MODE
      url = this.getUserService()+"/"+userId+"/";
      if(requestorId != null){
        url = url + "?requestorId=" + requestorId;
      }
    }
        
    console.log("getUserData() " + url);
    
    let httpOptions = {
      //headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'http://localhost:4200'}),
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      params: new HttpParams({})
    };
    

    let httpParam = new HttpParams();
    httpParam.append('requestorId', requestorId);
    
    //let httpOptionsLocal = this.httpOptions;
    //httpOptionsLocal.params = httpParam;
    httpOptions.params = httpParam;
    
    return this.http.get(url, this.httpOptions)
    .pipe(
      //map((response:Response) => response.json()), 
      tap(_ => this.log(`fetched getUserData`)),
      catchError(this.handleError<any>(`Error in getUserData()`))
    );                         
  }

  followDistrict(request:string):Observable<any>{
    let serviceUrl = this.serviceUrl+"/followDistrict";
    console.log("follow district user.service " + request + " this.serviceUrl " + serviceUrl);

    return this.http.post(serviceUrl, request, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`posted followDistrict`)),
      catchError(this.handleError<any>(`Error in followDistrict()`))
    );                 
  }

  followPerson(request:string):Observable<any>{
    let serviceUrl = this.getSocialService();
    serviceUrl = serviceUrl + "/followPerson";
    console.log("follow User user.service " + request + " serviceUrl " + serviceUrl);

    return this.http.post(serviceUrl, request, this.httpOptions)
    .pipe(
      //map((response:Response) => response.json()),
      tap(_ => this.log(`posted followPerson`)),
      catchError(this.handleError<any>(`Error in followPerson()`))
    );                 
  }

  getRelationStatus(userId:string, districtId:string):Observable<string>{
  let serviceUrl = this.getSocialService()+"/getRelation";
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let myParams = new HttpParams();
  myParams.append('sourceEntityId', userId);
  myParams.append('targetEntityId', districtId);

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    sourceEntityId: userId,
    targetEntityId: districtId
  } });

  
}

getUserNameByFullName(fullNname:string):Observable<string>{
  let serviceUrl = this.getSocialService()+"/getUserIdByFullName";

  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getUsernameByFullname.json';   

  }

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    fullNname: fullNname
  } });
              
}


getFollowersCount(entityId:string):Observable<string>{
  let serviceUrl = "";
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/followersCount.json';   
  }else{
    serviceUrl = this.getSocialService()+"/getFollowersCount";
  }
  //serviceUrl = '/assets/json/fromService/followersCount.json';   
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    entityId: entityId
  } });

}

getManagedBy(entityId:string):Observable<any>{
  let serviceUrl = "";
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/followers.json';   
  }else{
    serviceUrl = this.getUserService() +"/getManagedByUsers/"+entityId+"/";
  }
  //serviceUrl = '/assets/json/fromService/followers.json';   

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let myParams = new HttpParams();
  myParams.append('entityId', entityId);

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    entityId: entityId
  } }).pipe(
    tap(_ => this.log(`fetched getFollowers`)),
    catchError(this.handleError<any>(`Error in getFollowers()`))
  );
  
}

getFollowers(entityId:string):Observable<any>{
  let serviceUrl = "";
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/followers.json';   
  }else{
    serviceUrl = this.getSocialService()+"/getFollowers";
  }
  //serviceUrl = '/assets/json/fromService/followers.json';   

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let myParams = new HttpParams();
  myParams.append('entityId', entityId);

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    entityId: entityId
  } }).pipe(
    tap(_ => this.log(`fetched getFollowers`)),
    catchError(this.handleError<any>(`Error in getFollowers()`))
  );
  
}

getFollowingsCount(entityId:string):Observable<string>{
  let serviceUrl = "";
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/followersCount.json';   
  }else{
    serviceUrl = this.getSocialService()+"/getFollowingsCount";
  }
  //serviceUrl = '/assets/json/fromService/followersCount.json';   

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON

  return this.http.get(serviceUrl, { responseType: 'text', params: {
    entityId: entityId
  } });

}

getFollowings(entityId:string):Observable<any>{
  let serviceUrl = "";
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/followers.json';   
  }else{
    serviceUrl = this.getSocialService()+"/getFollowings"; 
  }
  //serviceUrl = '/assets/json/fromService/followers.json';  
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  let myParams = new HttpParams();
  myParams.append('entityId', entityId);

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    entityId: entityId
  } }).pipe(
    tap(_ => this.log(`fetched getFollowings`)),
    catchError(this.handleError<any>(`Error in getFollowings()`))
  );
  
}

getConnections(entityId:string, action:string):Observable<any>{
  let serviceUrl = this.getSocialService()+"/getConnectionsEntityId"+"/"+entityId+"/";

  if(this.devMode){
    serviceUrl = '/assets/json/fromService/connections.json';   
  }

  return this.http.get(serviceUrl, { responseType: 'json', params: {
    action: action
  } }).pipe(
    tap(_ => this.log(`fetched getConnectionRequests`)),
    catchError(this.handleError<any>(`Error in getConnectionRequests()`))
  );
  
}

getBiodata(userId:string):Observable<any>{ 
  let serviceUrl:string = "";//    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/user-legis-Biodata.json';   
  }else{
    serviceUrl = this.getUserService() +"/biodata/"+userId+"/";
  }    
  //serviceUrl = '/assets/json/fromService/user-legis-Biodata.json';   

  //let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  this.httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`fetched getBiodata`)),
    catchError(this.handleError<any>(`Error in getBiodata()`))
  );                
}


getRoles(userId:string, isCongress:boolean):Observable<any>{ 
  let serviceUrl:string = "";//    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/user-legis-Roles.json';   
  }else{
    serviceUrl = this.getUserService() +"/legis/roles/"+userId;
  }

  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getRoles`)),
    catchError(this.handleError<any>(`Error in getRoles()`))
  );                
}

getOffices(userId:string, isCongress:boolean):Observable<any>{ 
  let serviceUrl:string = "";//    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/user-legis-Offices.json';   
  }else{ 
    serviceUrl = this.getUserService() +"/legis/offices/"+userId;
  }
  //serviceUrl = '/assets/json/fromService/user-legis-Offices.json';   
  let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getOffices`)),
    catchError(this.handleError<any>(`Error in getOffices()`))
  );                
}

//If userId is a Bill Id, then get all the Votes for that Bill
//If userId is a Legislator Id, then get all the Votes of that Legislator
getVotes(userId:string):Observable<any>{ 
  let serviceUrl:string = "";//    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getVotes.json';   
  }else{
    serviceUrl = this.getUserService() +"/legis/roles/"+userId;
  }
  serviceUrl = '/assets/json/fromService/getVotes.json';   

  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getVotes`)),
    catchError(this.handleError<any>(`Error in getVotes()`))
  );                
}

add2Circle(request:string):Observable<any>{
  let serviceUrl = this.getUserService() + "/addCircleUser";
  console.log("add2Circle user.service " + request + " this.serviceUrl " + serviceUrl);

  return this.http.post(serviceUrl,  request, this.httpOptions );
}

removeFromCircle(request:string):Observable<any>{
  let serviceUrl = this.getUserService() + "/removeCircleUser";
  console.log("removeFromCircle user.service " + request + " this.serviceUrl " + serviceUrl);

  return this.http.post(serviceUrl,  request, this.httpOptions );
}

getCircleUsers(userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getCircleUsers.json';   
  }else{
    serviceUrl = this.getUserService() +"/getCircleUsers/"+userId+"/";
  }

  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getCircleUsers`)),
    catchError(this.handleError<any>(`Error in getCircleUsers()`))
  );  
}

getCircleUsersCategory(userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getCircleUsersCategory.json';   
  }else{
    serviceUrl = this.getUserService() +"/getCircleUsers/"+userId+"/";
  }
  serviceUrl = this.getUserService() +"/getCircleUsers/"+userId+"/";
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getCircleUsersCategory`)),
    catchError(this.handleError<any>(`Error in getCircleUsersCategory()`))
  );  
}

addMember(request:string):Observable<any>{
  let serviceUrl = this.getUserService() + "/addMember";
  console.log("addMember user.service " + request + " this.serviceUrl " + serviceUrl);

  return this.http.post(serviceUrl,  request, this.httpOptions )
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`addMember successful`)),
    catchError(this.handleError<any>(`Error in addMember()`))
  );
}

removeMember(request:string):Observable<any>{
  let serviceUrl = this.getUserService() + "/removeMember";
  console.log("removeMember user.service " + request + " this.serviceUrl " + serviceUrl);

  return this.http.post(serviceUrl,  request, this.httpOptions )
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`removeMember successful`)),
    catchError(this.handleError<any>(`Error in removeMember()`))
  );
}

isInCircle(profileId:string, userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/postLikeStatus.json';   
  }else{
    serviceUrl = this.getUserService() + "/isInCircle/" + profileId + "/" + userId + "/";
  }
  serviceUrl = this.getUserService() + "/isInCircle/" + profileId + "/" + userId + "/";
  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions);  
}

isProfileEditable(profileId:string, userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/postLikeStatus.json';   
  }else{
    serviceUrl = this.getUserService() + "/isProfileEditable/" + profileId + "/" + userId + "/";
  }

  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`in isProfileEditable`)),
    catchError(this.handleError<any>(`Error in isProfileEditable()`))
  );  
}

//OBSOLETE?
getManagedByUsers(userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getEvents.json';   
  }else{
    serviceUrl = this.getUserService() +"/getManagedByUsers/"+userId+"/";
  }

  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getManagedByUsers`)),
    catchError(this.handleError<any>(`Error in getManagedByUsers()`))
  );  
}

getSettings(userId:string):Observable<any>{
  let serviceUrl:string = "";    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getSettings.json';   
  }else{
    serviceUrl = this.getUserService() +"/getSettings/"+userId+"/";
  }

  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getSettings`)),
    catchError(this.handleError<any>(`Error in getSettings()`))
  );  
}

updateSettings(request:string):Observable<any>{
  let serviceUrl = this.getUserService() + "/updateSettings";
  console.log("updateSettings user.service " + request + " this.serviceUrl " + serviceUrl);

  return this.http.post(serviceUrl,  request, this.httpOptions )
  .pipe(
    //map((response:Response) => response.json()),
    tap(_ => this.log(`updateSettings successful`)),
    catchError(this.handleError<any>(`Error in updateSettings()`))
  );
}

getEvents(userId:string):Observable<any>{ 
  let serviceUrl:string = "";//    
  if(this.devMode){
    serviceUrl = '/assets/json/fromService/getEvents.json';   
  }else{
    serviceUrl = this.getUserService() +"/legis/roles/"+userId;
  }
  serviceUrl = '/assets/json/fromService/getEvents.json';   

  let headers      = new Headers({ 'Content-Type': 'application/json' });
  return this.http.get(serviceUrl, this.httpOptions)
  .pipe(
    tap(_ => this.log(`fetched getEvents`)),
    catchError(this.handleError<any>(`Error in getEvents()`))
  );                
}
  /* OBSOLETED BY getRelationStatus()*/
  getRelation(userId:string, districtId:string):Observable<any>{ 
    let serviceUrl = this.serviceUrl+"/getRelation";
    //console.log("follow district user.service " + request + " this.serviceUrl " + serviceUrl);
   //let bodyString = JSON.stringify(post); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    //let myParams = new URLSearchParams();
    let myParams = new HttpParams();
    myParams.append('userId', userId);
    myParams.append('districtId', districtId);
    // let options       = new RequestOptions({ headers: headers, search:myParams }); // Create a request option

    // return this.http.get() (serviceUrl, options) // ...using post request
    //                  .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
                     
    // this.httpOptions = {
    //                   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    //                 };

    return this.http.get(serviceUrl, {params: myParams, headers: new HttpHeaders({ 'Content-Type': 'application/json' })})
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`fetched getRelation`)),
      catchError(this.handleError<any>(`Error in getRelation()`))
    );                
  }

getAll() {
    //return this.http.get<User[]>('/api/users');
  return this.http.get('/api/users');
}

registerUser(user: any):Observable<any> {
//        return this.http.post('/register', user);

    //console.log("registering user user.service");
  let bodyString = JSON.stringify(user); // Stringify payload
   let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
   //let options       = new RequestOptions({ headers: headers }); // Create a request option

   console.log("registerUser::user.service invoking service " + this.serviceUrl, bodyString);

   return this.http.post(this.serviceUrl, user, this.httpOptions)
    .pipe(
      //map((response:Response) => response.json()),
      tap(_ => this.log(`Successfully registered User`))
      //,
      //catchError(this.handleError<any>(`Error in registering User()`))
    );

  //  return this.http.post(this.serviceUrl, bodyString, options) // ...using post request
  //                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
  //                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
}

gTokenVerify(token: string):Observable<any> {
  //        return this.http.post('/register', user);
  console.log("token ", token);
  
      //console.log("registering user user.service");
    //let bodyString = JSON.stringify(user); // Stringify payload
     //let headers      = new HttpHeaders({ 'X-ID-TOKEN': token }); // ... Set content type to JSON
     //const headers = new HttpHeaders().set('X-ID-TOKEN', token);
     //this.httpOptions.headers = headers;
     //let options       = new RequestOptions({ headers: headers }); // Create a request option
     const headers = { 'X-ID-TOKEN': token };
    const body = {  };

     //let headers = new Headers();
     //headers.append('X-ID-TOKEN', token);

     let serviceUrl = this.getUserService() + "/gTokenVerify";

     console.log("headers X-ID-TOKEN" + headers["X-ID-TOKEN"]);
     console.log("gTokenVerify::user.service invoking service " + serviceUrl);
     console.log("headers " + headers);
  
     return this.http.post(serviceUrl, body, {headers, responseType: 'text', observe: 'response'})
      .pipe(
        //map((response:Response) => response.json()),
        map(res => {
          console.log("gTokenVerify response ", res);
          if(res.headers.get('Authorization')){
            var tokenBearer = res.headers.get('Authorization').split(' ');
            if(tokenBearer.length === 2){ 
              localStorage.setItem('currentUserToken', tokenBearer[1]);          
            }
          }
        }),
        tap(_ => this.log(`response from gTokenVerify`)),
        catchError(this.handleError<any>(`Error in gTokenVerify`))
      );
  
    //  return this.http.post(this.serviceUrl, bodyString, options) // ...using post request
    //                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
    //                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  tokenVerify(token: string, provider: string):Observable<any> {
    //        return this.http.post('/register', user);
    console.log("token ", token, " ,provider ", provider);
    
        //console.log("registering user user.service");
      //let bodyString = JSON.stringify(user); // Stringify payload
       //let headers      = new HttpHeaders({ 'X-ID-TOKEN': token }); // ... Set content type to JSON
       //const headers = new HttpHeaders().set('X-ID-TOKEN', token);
       //this.httpOptions.headers = headers;
       //let options       = new RequestOptions({ headers: headers }); // Create a request option
       const headers = { 'X-ID-TOKEN': token, 'PROVIDER': provider };
      const body = {  };
  
       //let headers = new Headers();
       //headers.append('X-ID-TOKEN', token);
  
       let serviceUrl = this.getUserService() + "/tokenVerify";
  
       //console.log("headers X-ID-TOKEN" + headers["X-ID-TOKEN"]);
       //console.log("tokenVerify::user.service invoking service " + serviceUrl);
       //console.log("headers " + headers);
    
       return this.http.post(serviceUrl, body, {headers, responseType: 'text', observe: 'response'})
        .pipe(
          //map((response:Response) => response.json()),
          map(res => {
            console.log("gTokenVerify response ", res);
            if(res.headers.get('Authorization')){
              var tokenBearer = res.headers.get('Authorization').split(' ');
              if(tokenBearer.length === 2){ 
                localStorage.setItem('currentUserToken', tokenBearer[1]);          
              }
            }
          }),
          tap(_ => this.log(`response from gTokenVerify`)),
          catchError(this.handleError<any>(`Error in gTokenVerify`))
        );
    
      //  return this.http.post(this.serviceUrl, bodyString, options) // ...using post request
      //                   .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
      //                   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

updateUserSmProfileImage(request:FormData):Observable<any>{
  let serviceUrl = this.getUserService() + "/uploadUserSmProfileImage";
  console.log("uploadUserSmProfileImage user.service " + request + " this.serviceUrl " + serviceUrl);
  
  this.httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
  };

  return this.http.post(serviceUrl,  request )
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`User profile image got uploaded successfully`)),
    catchError(this.handleError<any>(`Error in updateUserSmProfileImage()`))
  );
}

updateConnectionAction(request:Connection):Observable<any>{
  let serviceUrl = this.getSocialService()+"/connectionAction";
  console.log("updateConnectionAction user.service " + request + " serviceUrl " + serviceUrl);
 
  return this.http.post(serviceUrl, request, this.httpOptions)
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`posted updateConnectionAction`)),
    catchError(this.handleError<any>(`Error in updateConnectionAction()`))
  );
}

updateProfileData(request:any):Observable<any>{
  let serviceUrl = this.getUserService()+"/profileData/update";
  console.log("updateProfileData user.service " + request + " serviceUrl " + serviceUrl);
 
  return this.http.post(serviceUrl, request, this.httpOptions)
  .pipe(
    map((response:Response) => response.json()),
    tap(_ => this.log(`posted updateProfileData`)),
    catchError(this.handleError<any>(`Error in updateProfileData()`))
  );
}

//USED FOR ENTITY'S PROFILE SMALL IMAGE DOWNLOAD
getImage(userId: string): Observable<Blob> {
  //let serviceUrl = this.getPostService() + "/downloadFile/user/" + userId + "/";
  let serviceUrl = this.getPostService() + "/downloadFile/entity/" + userId + "/";
  console.log("getImage user.service " + serviceUrl);

  return this.http.get(serviceUrl, { responseType: 'blob' });
}




}
