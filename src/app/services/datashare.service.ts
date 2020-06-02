import { Injectable, OnChanges, ViewRef } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class DatashareService {

  public selected_permission:string='Viewer';

  public displayMode:boolean = false;
  
  private currentUserSubject = new BehaviorSubject<User>(new User()); 
  private currentUserObservable = this.currentUserSubject.asObservable();

  //currentUserId will be set with logged in userid
  public currentUserId:string = 'yuvarajm1';//'u001'; 
  //public currentUser = {};
  
  public viewingUserId:string; //SHOULD BE DEPRECATED
  public viewingUser = {};
  public viewingDistrict = {};
  public viewingEntity = {}; //can obsolete viewingUser / viewingDistrict
  
  public currentDistrictId:string = 'g0010';
  public selectedLegislatorId:string = 'g0010';

  //private userLogged:boolean = false;

  map = new Map();

  //serviceUrl:string = "http://Gpx-env.e2xj3uszee.us-east-2.elasticbeanstalk.com";
  serviceUrl:string = "http://localhost:5000";
  searchServiceUrl:string = "http://localhost:8090";

  public getServiceUrl():string{ 
    return this.serviceUrl;
  }

  public setDistrictViews(comp:any, vRef:ViewRef){
    console.log("setDistrictViews() comp " + comp);
    console.log("vRef " + vRef);
    this.map.set(comp, vRef);
  } 
  
  public getDistrictView(comp:any):any{
    let component:any;    
    console.log("getDistrictView() comp " + comp);
    console.log("this.map.size " + this.map.size);
    for (var i = 0; i <= this.map.size; i++) {
      console.log("this.map.get(i) " + this.map.get(i));
    }
    if(this.map.has(comp)){
      component = this.map.get(comp);
      this.map.delete(comp);
    }

    return component;
  } 

//OBSOLETE
  getCurrentUserId():string{
   return this.currentUserId;
  }

//OBSOLETE
  setCurrentUserId(userId:string){
   this.currentUserId = userId;
  }

  getCurrentUserObservable():any{
   return this.currentUserObservable;
  }

  getCurrentUser():User{
    //value contains both token and username
    return this.currentUserSubject.getValue();
  }
 
  setCurrentUser(user:User){
   //this.currentUser = user;
   this.currentUserSubject.next(user);
  }

  getLoggedinUsername():string{
    let loggedUser:User = null;
    let loggedUserName:string=null;
    loggedUser = this.getCurrentUser();
    

    if(loggedUser && loggedUser.username){
      loggedUserName = loggedUser.username;
    }

    return loggedUserName;
  }

  getViewingUserId():string{
   return this.viewingUserId;
  }

  setViewingUserId(userId:string){
   this.viewingUserId = userId;
  }

  getViewingUser():any{
   return this.viewingUser;
  }

  setViewingUser(user:any){
   this.viewingUser = user;
  }

  // isUserLogged():boolean{
  //   return this.userLogged;
  //  }
 
  //  setUserLogged(flag:boolean){
  //   this.userLogged = flag;
  //  }
 
  getViewingDistrict():any{
   return this.viewingDistrict;
  }

  setViewingDistrict(district:any){
   this.viewingDistrict = district;
  }

  getSelectedLegislatorId():string{
   return this.selectedLegislatorId;
  }

  setSelectedLegislatorId(selectedLegislatorId:string){
   this.selectedLegislatorId = selectedLegislatorId;
  }
    getCurrentDistrictId():string{
    return this.currentDistrictId
  }

  setCurrentDistrictId(districtId:string){
   this.currentDistrictId = districtId;
  }

  getPermission():string{
  	//console.log("getPermission() " + this.selected_permission);
  	return this.selected_permission;
  }

  setPermission(data:string){
  	this.selected_permission = data;	
  	//console.log("setPermission() " + this.selected_permission);

  }

  editProfile(data:boolean){
    this.viewingEntity['isProfileEditMode'] = data;
  }

  isProfileEditable():boolean{
    return this.viewingEntity['isProfileEditMode'];
  } 

  checkPermissions():boolean {
      if(this.selected_permission == 'Editor') {
        this.displayMode = true;
      } 
      else {
        this.displayMode = false;
      }

  	  //console.log("displayMode " + this.displayMode);

      return this.displayMode;
    }
  }
