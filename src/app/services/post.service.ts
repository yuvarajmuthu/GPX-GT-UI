import { Injectable, isDevMode } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of, from, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {DatashareService} from '../services/datashare.service';
import {AbstractService} from './abstract.service';

import {Post} from '../models/post';
import {NewPost} from '../models/newpost';
import {NewComment} from '../models/newcomment';
import {NewLike} from '../models/newlike';
import { tagUser } from '../models/tagusers';

@Injectable({
  providedIn: 'root'
})
export class PostService  extends AbstractService{

  serviceUrl:string;// = "http://127.0.0.1:8080/post";	
  tagUsersserviceUrl:string;
  devMode:boolean = true;
  _timezone: any = null;
  _timeZoneAbbr: any

  //OBSOLETE - USED TO GET THE TIMEZONE
  getLocalTimeZone(dateInput: any) {
    if (this._timezone) return this._timezone;
 
    var dateObject = dateInput || new Date(),
    dateString = dateObject + ""
 
    this._timeZoneAbbr = (
      dateString.match(/\(([^\)]+)\)$/) ||
      dateString.match(/([A-Z]+) [\d]{4}$/)
    );
 
   if (this._timeZoneAbbr) {
    this._timeZoneAbbr = this._timeZoneAbbr[1].match(/[A-Z]/g).join("");
   }
 
   if (!this._timeZoneAbbr && /(GMT\W*\d{4})/.test(dateString)) {
    return RegExp.$1;
   }
 
   this._timezone = this._timeZoneAbbr;
   return this._timeZoneAbbr;
  };

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (private http: HttpClient, 
    private dataShareService:DatashareService) {
      super();
      this.serviceUrl = dataShareService.getServiceUrl() + "/post";
      this.devMode = isDevMode();

  }

  //deprecated
  getPost():Post[] { 
  	var postJson = {};
  	var posts:JSON[];
	var postsPromise : Post[] = [];

	var localPost:string;
	if(localPost = localStorage.getItem("userPosts")){
		console.log('from Post Service - localPost ' + localPost);
		postJson = JSON.parse(localPost);
		posts = postJson['postArray'];
		console.log('from Post Service - parsed Post ' + posts);

		for (var i = 0; i < posts.length; i++) {
		    var post = {};
		    var postPromise : Post = {} as Post;
		    post = posts[i];
		    console.log('reading properties - ' + post['txtPost']);

		    postPromise.userId = 'ymuthu';
		    postPromise.postText = post['txtPost'];

		    postsPromise.push(postPromise);
		}


	}
  	//typecast to post object
  	console.log('returning posts ' + postsPromise.length);
  	return postsPromise;  
  }

  getActivities(requestData:string):Observable<Post[]> {
    var postJson = {};
  	var posts:JSON[];
	  var postsPromise : Post[] = [];
    var serviceUrl = "";
    let requestJson = JSON.parse(requestData);
    if(this.devMode){
      serviceUrl = '/assets/json/fromService/post.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/getPosts/" + requestJson['entityId'] + "/";
    }
    serviceUrl = '/assets/json/fromService/post.json'; 

    console.log("gonna get posts");


    return this.http.get(serviceUrl, { responseType: 'json', params: {
      pageNumber: requestJson['pageNumber']
    } })
    .pipe(
//      map((response:Response) => response.json()),
      map((result) => {
        let posts:any = result;//result["results"];  

        //posts = data['results'];
        console.log('from Post Service - parsed Post length ' + posts.length);

        for (var i = 0; i < posts.length; i++) {
            //var post : Post = {} as Post;
            console.log('reading properties - ' + JSON.stringify(posts[i]));                        
            //post = Post.decodePost(posts[i]);
            //console.log('reading properties - ' + post.id);

            postsPromise.push(posts[i]);
        }

            return postsPromise;      
              }), 
      tap(_ => this.log(`fetched getActivities`)),
      catchError(this.handleError<any>(`Error in getActivities()`))
    );                         
  }

  getMyActivities(requestData:string):Observable<Post[]> {
    var postJson = {};
  	var posts:JSON[];
	  var postsPromise : Post[] = [];
    var serviceUrl = "";
    let requestJson = JSON.parse(requestData);
    if(this.devMode){
      serviceUrl = '/assets/json/fromService/post.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/getMyPosts/" + requestJson['entityId'] + "/";
    }
    //serviceUrl = this.serviceUrl + "/getAllPosts/" + requestJson['entityId'] + "/"; //COMMENT BEFORE MOVING TO PRODUCTION


/*
    let requestParams = new URLSearchParams();
    requestParams.set("entityId", requestJson['entityId']);
    requestParams.set("entityType", requestJson['entityType']);

    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
*/
    console.log("gonna get posts");
    return this.http.get(serviceUrl, this.httpOptions)
    .pipe(
//      map((response:Response) => response.json()),
      map((result) => {
        let posts:any = result;//result["results"];  

        //posts = data['results'];
        console.log('from Post Service - parsed Post length ' + posts.length);

        for (var i = 0; i < posts.length; i++) {
            //var post : Post = {} as Post;
            console.log('reading properties - ' + JSON.stringify(posts[i]));                        
            //post = Post.decodePost(posts[i]);
            //console.log('reading properties - ' + post.id);

            postsPromise.push(posts[i]);
        }

            return postsPromise;      
              }), 
      tap(_ => this.log(`fetched getActivities`)),
      catchError(this.handleError<any>(`Error in getActivities()`))
    );                         
  }

  getPostComments(requestData:string):Observable<Post[]> {
    var postJson = {};
  	var posts:JSON[];
	  var postsPromise : Post[] = [];
    var serviceUrl = "";
    let requestJson = JSON.parse(requestData);
    if(this.devMode){
      serviceUrl = '/assets/json/fromService/post.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/getPostComments/" + requestJson['postId'] + "/";
    }

    console.log("In getPostComments");
    return this.http.get(serviceUrl, { responseType: 'json', params: {
      pageNumber: requestJson['pageNumber']
    } })
    .pipe(
      map((result) => {
        let posts:any = result;//result["results"];  


        console.log('from Post Service - parsed Post length ' + posts.length);

        for (var i = 0; i < posts.length; i++) {

          console.log('reading properties - ' + JSON.stringify(posts[i]));                        
          postsPromise.push(posts[i]);
        }

            return postsPromise;      
              }), 
      tap(_ => this.log(`fetched getPostComments`)),
      catchError(this.handleError<any>(`Error in getPostComments()`))
    );                         
  }

  getCommentsCount(postId:string):Observable<number> {
    var serviceUrl = "";

    if(this.devMode){
      serviceUrl = '/assets/json/fromService/followersCount.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/getCommentsCount?postId=" + postId;
    }

    console.log("in getCommentsCount - serviceUrl ", serviceUrl);

    return this.http.get(serviceUrl, this.httpOptions).pipe(
      tap(_ => this.log(`fetched getCommentsCount`)),
      catchError(this.handleError<any>(`Error in getCommentsCount()`))
    );                     
  }

  getLikedCount(postId:string):Observable<number> {
    var serviceUrl = "";

    if(this.devMode){
      serviceUrl = '/assets/json/fromService/followersCount.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/getLikedCount?postId=" + postId;
    }

    console.log("in getLikedCount - serviceUrl ", serviceUrl);

    return this.http.get(serviceUrl, this.httpOptions).pipe(
      tap(_ => this.log(`fetched getLikedCount`)),
      catchError(this.handleError<any>(`Error in getLikedCount()`))
    );                     
  }

  getLikeStatus(postId:string, entityId:string):Observable<boolean> {
    var serviceUrl = "";

    if(this.devMode){
      serviceUrl = '/assets/json/fromService/postLikeStatus.json'; 
    }else{
      serviceUrl = this.serviceUrl + "/isLikedByEntity?postId=" + postId + "&entityId=" + entityId;
    }

    console.log("in getLikeStatus - serviceUrl ", serviceUrl);

    return this.http.get(serviceUrl, this.httpOptions).pipe(
      tap(_ => this.log(`fetched getLikeStatus`)),
      catchError(this.handleError<any>(`Error in getLikeStatus()`))
    );                     
  }

  //not used-obsolete
  postNewPost(postFormData:FormData) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }  
    let url = "";

    if(this.devMode){
      url = '/assets/json/fromService/newpost.json'; 
    }else{
      url = this.serviceUrl;
    }
    return this.http.get(url,httpOptions).
        pipe(
           map((data: NewPost[]) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
    }

    postComment(postFormData:FormData):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }  
    let url = "";

    if(this.devMode){
      url = '/assets/json/fromService/newcomment.json'; 
    }else{
      url = this.serviceUrl;
    }
    /*
    return this.http.get(url,httpOptions).
        pipe(
           map((data: NewComment[]) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        );
        */
    return this.http.post(this.serviceUrl, postFormData, httpOptions)
    .pipe(
      //map((response:Response) => response.json()),
      tap(_ => this.log(`posted Comment`)),
      catchError(this.handleError<any>(`Error in postComment()`))
    );           
    }

  postLike(postId:string, entityId:string):Observable<any> {
    var serviceUrl = "";

    if(this.devMode){
      serviceUrl = '/assets/json/fromService/newlike.json?entityId='+entityId; 
    }else{
      serviceUrl = this.serviceUrl + "/like/" + postId + "?entityId=" + entityId;
    }

    console.log("in postLike - serviceUrl ", serviceUrl);

    return this.http.put(serviceUrl, this.httpOptions).pipe(
      tap(_ => this.log(`updating postLike`)),
      catchError(this.handleError<any>(`Error in postLike()`))
    );                     
  }

  getTagUsers(searchText:string) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    }  
    let url = "";

    if(this.devMode){
      url = '/assets/json/fromService/tagusers.json'; 
    }else{
      url = this.dataShareService.searchServiceUrl+"/search/user?multiSearchText="+searchText;
    }
    return this.http.get(url,httpOptions).
        pipe(
           map((data: tagUser[]) => {
             return data;
           }), catchError( error => {
             return throwError( 'Something went wrong!' );
           })
        )
    }

  getImage(imageId: string): Observable<Blob> {
    let serviceUrl = this.serviceUrl + "/downloadFile/" + imageId;
    console.log("getImage post.service " + serviceUrl);
  
    return this.http.get(serviceUrl, { responseType: 'blob' });
  }


}
