import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Legislator } from './../models/legislator';

import {AbstractService} from './abstract.service';

@Injectable({
  providedIn: 'root'
})

export class LegislatorService extends AbstractService {

//	constructor (private http: HttpClient, private jsonp:Jsonp) {}
constructor (private http: HttpClient) {
  super();
}
  
	//resultOP:Observable<Legislator[]>;
  result:any; 
  legislators: Array<Legislator> = [];
  resultop:any;
  //apikey_openstate = c7ba0e13-03f6-4477-b9f1-8e8832169ee5
  //BY LEGISLATOR ID
  //https://openstates.org/api/v1/legislators/DCL000012?apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5
  //BY GEOLOCATION
  //https://openstates.org/api/v1/legislators/geo/?lat=35.79&long=-78.78&apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5
  //BY STATE/CHAMBER
  //https://openstates.org/api/v1/legislators/?state=dc&chamber=upper&apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5
  
  
  //STATE DISTRICT - ALL
  //LOWER
  //https://openstates.org/api/v1/districts/nc/lower?apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5
  //UPPER
  //https://openstates.org/api/v1/districts/nc/upper?apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5



  private legislature_by_zipcode_service_url_prefix = 'https://congress.api.sunlightfoundation.com/legislators/locate?zip=';
  private legislature_service_url_prefix = 'https://congress.api.sunlightfoundation.com/legislators';//?bioguide_id=B001296&apikey=fd1d412896f54a8583fd039670983e59
  private legislature_service_url_suffix = '&apikey=fd1d412896f54a8583fd039670983e59';
//https://congress.api.sunlightfoundation.com/legislators/locate?zip=19406&apikey=fd1d412896f54a8583fd039670983e59
//https://congress.api.sunlightfoundation.com/legislators?bioguide_id=T000461&apikey=fd1d412896f54a8583fd039670983e59
//https://congress.api.sunlightfoundation.com/legislators/locate?latitude=42.96&longitude=-108.09&apikey=fd1d412896f54a8583fd039670983e59

//Committees and subcommittees a given legislator is assigned to
//https://congress.api.sunlightfoundation.com/committees?member_ids=T000461&apikey=fd1d412896f54a8583fd039670983e59
  private legisCommittee_prefix = 'https://congress.api.sunlightfoundation.com/committees?member_ids=';
  private legisCommittee_suffix = this.legislature_service_url_suffix;


//get district by lat/long
//https://congress.api.sunlightfoundation.com/districts/locate?latitude=40.402777&longitude=-80.058543&apikey=fd1d412896f54a8583fd039670983e59
  private district_prefix = 'https://congress.api.sunlightfoundation.com/districts/locate?';
  private district_suffix = this.legislature_service_url_suffix;

//get district by zipcode
//https://congress.api.sunlightfoundation.com/districts/locate?zip=11216&apikey=fd1d412896f54a8583fd039670983e59

private google_geocode_api_prefix = 'https://maps.google.com/maps/api/geocode/json?address=';
private google_geocode_api_suffix = '&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY';
private devMode:boolean = true;
private httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

getLegislature(searchParam:string, type:string):Observable<any>{
    //required for using jsonp. JSONP is used to get data from cross domain
    console.log("getLegislature() in legislators service - searchParam " + searchParam);
    //let params = new URLSearchParams();
    let params = new HttpParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");


    let url:string;
    if(type == 'zipcode'){
      url = this.legislature_service_url_prefix + '/locate?zip=' + searchParam + this.legislature_service_url_suffix;
    }
    else if(type == 'bioguide_id'){// get State legislator profile by id
      //url = this.legislature_service_url_prefix + '?bioguide_id=' + searchParam + this.legislature_service_url_suffix;
      url = 'https://openstates.org/api/v1/legislators/' + searchParam + '?apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5';
    }
    else if(type == 'latlong'){// get State legislators by Address
      let locationArr = searchParam.split(',');
      //url = this.legislature_service_url_prefix + '/locate?latitude=' + locationArr[0] + '&longitude=' + locationArr[1] + this.legislature_service_url_suffix;
      //https://openstates.org/api/v1/legislators/geo/?lat=40.402777&long=-80.058544&apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5
      url = 'https://openstates.org/api/v1/legislators/geo/?lat='+ locationArr[0] + '&long=' + locationArr[1] + '&apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5';
      if(this.devMode){
        url='/assets/json/stateLegislatorsByGeoLocation.json';
      }
    } else if(type == 'congress'){ // get Congress legislators by Address
      //https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY&address=300%20Chatham%20Park%20Drive%2CPittsburgh%2C%20PA%2015220
      url = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY&address=" + encodeURIComponent(searchParam);
      //this.getDistrictInfoFromGoogle(url);
      if(this.devMode){
        url='/assets/json/congressLegislatorsByGeoLocation.json';
      }
    } else if(type == 'byCongressDistrict'){ // get Congress legislators by Division id
      url = "https://www.googleapis.com/civicinfo/v2/representatives/ocdId?ocdId="+ searchParam +"&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY";
      //this.getDistrictInfoFromGoogle(url);
      //https://www.googleapis.com/civicinfo/v2/representatives/ocdId?ocdId=ocd-division/country:us/state:pa/cd:6&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY
      //find District
      //https://www.googleapis.com/civicinfo/v2/divisions?query="ocd-division/country:us/state:pa/cd:6"&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY
      //https://www.googleapis.com/civicinfo/v2/divisions?query="gettysburg montessori charter school"&key=AIzaSyBShZOVB_EtWokgbL0e6ZWHpAHpwVY5vZY
      if(this.devMode){
        url='/assets/json/congressLegislatorsByDivisionId.json';
      }
    }


    console.log('getLegislature API - ' + url);
    if(!this.devMode){  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());
      return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched Legislator`)),
        catchError(this.handleError<any>(`Error in getLegislature()`))
      );
    }else{
    // return this.http.get(url) 
    // .map((response:Response) => response.json());
    return this.http.get(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`fetched Legislator`)),
        catchError(this.handleError<any>(`Error in getLegislature()`))
      );

    }
                  
} 

getLocation(term: string):Observable<any> {
  let geocodeApi:string = this.google_geocode_api_prefix + term + this.google_geocode_api_suffix;
  //return this.http.get(geocodeApi)
  let url:string;
  if(this.devMode){
    url = '/assets/json/geoCode.json';
  }else{
    url = geocodeApi;
  }
  console.log('geocodeApi ', url);

  // return this.http.get(url) 
  // .map((response:Response) => response.json());

  return this.http.get(url);
  // .pipe(
  //   map((response:Response) => response.json),
  //   //catchError(this.handleError)
  // );
      // .pipe(
      //   // tap(_ => {
      //   //   this.log(`fetched getLocation`);
      //   //   console.log(`fetched getLocation`);
      //   // }),
      //   catchError(this.handleError<any>(`Error in getLocation()`))
      // );

}

getDistrictInfoFromGoogle(url:string):Observable<any>{
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");
    console.log('in getDistrictInfoFromGoogle');   

    // return this.jsonp.get(url, { search: params })
    //               .map((response) => {
    //                 console.log('getDistrictInfoFromGoogle ' + JSON.stringify(response));  
    //                 console.log('getDistrictInfoFromGoogle ' + JSON.stringify(response['divisions']));
    //                 return response['divisions'];    
    //               });
    return this.http.get(url, this.httpOptions)
    .pipe(
      map(response => response['divisions']),
      tap(_ => this.log(`fetched getDistrictInfoFromGoogle`)),
      catchError(this.handleError<any>(`Error in getDistrictInfoFromGoogle()`))
    );              
}

//DEPRECATED
  getDistrict(value:string, category:string):Observable<any>{
    let url:string;
    //required for using jsonp. JSONP is used to get data from cross domain
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    if(category == 'zipcode'){
      url = this.district_prefix + 'zip=' + value + this.district_suffix;

    } else if(category == 'latlong'){
      let locationArr = value.split(',');
       url = this.district_prefix + 'latitude=' + locationArr[0] + '&longitude=' + locationArr[1] + this.district_suffix;

    }  

    console.log('getDistrict - ' + url);  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());
    
    return this.http.get(url, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`fetched getDistrict`)),
      catchError(this.handleError<any>(`Error in getDistrict()`))
    );              

  }

//DEPRECATED
getDistrictByLatLong(lat:string, long:string):Observable<any>{
    //required for using jsonp. JSONP is used to get data from cross domain
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    let url:string;
    url = this.district_prefix + 'latitude=' + lat + '&longitude=' + long + this.district_suffix;

    console.log('getDistrictByLatLong API - ' + url);  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());

                  return this.http.get(url, this.httpOptions)
                  .pipe(
                    map((response:Response) => response.json()),
                    tap(_ => this.log(`fetched getDistrictByLatLong`)),
                    catchError(this.handleError<any>(`Error in getDistrictByLatLong()`))
                  );                                
}

//DEPRECATED
getDistrictByZipcode(zipcode:string):Observable<any>{
    //required for using jsonp. JSONP is used to get data from cross domain
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    let url:string;
    url = this.district_prefix + 'zip=' + zipcode + this.district_suffix;

    console.log('getDistrictByZipcode API - ' + url);  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());
    
    return this.http.get(url, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`fetched getDistrictByZipcode`)),
      catchError(this.handleError<any>(`Error in getDistrictByZipcode()`))
    );                                              
} 

getCommittees(legisId:string):Observable<any>{
    //required for using jsonp. JSONP is used to get data from cross domain
    console.log("getCommittees() in service - legislators.service for legislator " + legisId);
    let params = new URLSearchParams();
    params.set('format', 'json');
    params.set('callback', "JSONP_CALLBACK");

    let url:string;
    //url = this.legisCommittee_prefix + legisId + this.legisCommittee_suffix;
    url = 'https://openstates.org/api/v1/committees/' + legisId + '?apikey=c7ba0e13-03f6-4477-b9f1-8e8832169ee5';

    console.log('getLegislature API - ' + url);  
    // return this.jsonp.get(url, { search: params })
    //               .map((response:Response) => response.json());
    return this.http.get(url, this.httpOptions)
    .pipe(
      map((response:Response) => response.json()),
      tap(_ => this.log(`fetched getCommittees`)),
      catchError(this.handleError<any>(`Error in getCommittees()`))
    );                                                            
} 


  getElectedMembers(type:String) {
    // return this.http.get('/app/data/json/legislators-elected.json')
    // .map(res => {return res.json()})
    // .map((data) => {
    //   let legisArr: Array<any> = data['results'];
    //   let result:Array<Legislator> = [];
    //   if (legisArr) {
    //     console.log("Elected persons from json " + legisArr.length);
    //   }
    //   return result;
    // })
    // ;

    return null;
  }

  getContestedMembers(type:String){
    return this.getElectedMembers(type);
  }
}
