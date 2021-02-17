import {Component, Input, OnInit} from '@angular/core';
//import { Router, RouteSegment } from "@angular/router";
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

//import {switchMap} from 'rxjs/operators';

//import { Observable, of } from 'rxjs';

// Import RxJs required methods:
import {catchError, map, tap, switchMap} from 'rxjs/operators';


import {Legislator} from '../../models/legislator';

import {LegislatorService} from '../../services/legislator.service';
import {UserService} from '../../services/user.service';
import {SearchService} from '../../services/search.service';
import {DatashareService} from '../../services/datashare.service';

import {BannerComponent} from '../banner/banner.component';

@Component({
  selector: 'app-legislator',
  templateUrl: './legislator.component.html',
  styleUrls: ['./legislator.component.css']
})
export class LegislatorComponent implements OnInit {
  @Input() legislator: Legislator;
  imageName: string;
  @Input() legisId: string;
  resultop: any;
  isInCircle: boolean;
  keys = [];
  loggedUsername:string;
  userName: string = 'createnew';

  bookMark:boolean;


  constructor(private  router: Router,
              private route: ActivatedRoute,
              private legislatorsService: LegislatorService,
              private userService: UserService,
              private searchService: SearchService,
              private datashareService: DatashareService) {
  }

  //get invoked automatically before ngOnInit()
  routerOnActivate(): void {


    //this.legisId = curr.getParam("id");
    //console.log("Param value - id " + this.legisId);
    console.log('routerOnActivate()::legislator.component invoked');


  }

  ngOnInit(): void {

    let id = this.route.snapshot.paramMap.get('id');
    this.loggedUsername = this.datashareService.getLoggedinUsername();

    if(id){
      this.getLegislator(id);
    }
    this.getUsername(this.legislator);

  }

  add2Circle() { 
    if(!this.loggedUsername){
      this.router.navigate(['login']);
    }else{
        var request = {};
        request['username'] = this.loggedUsername;
        request['modifiedBy'] = this.loggedUsername;
        request['circlememberUsername'] = this.userName;

        console.log('add2Circle request ' + JSON.stringify(request));

        this.userService.add2Circle(JSON.stringify(request)).subscribe(
        (result) => {
            this.isInCircle = true; 
        },
        (err) => {
            console.log('Error ', err);
        }); 
    }
  }
  
  removeFromCircle() {

    if(!this.loggedUsername){
      this.router.navigate(['login']);
    }else{
        var request = {};
        request['username'] = this.loggedUsername;
        request['modifiedBy'] = this.loggedUsername;
        request['circlememberUsername'] = this.userName;

        console.log('removeFromCircle request ' + JSON.stringify(request));

        this.userService.removeFromCircle(JSON.stringify(request)).subscribe(
        (result) => {
            this.isInCircle = false; 
        },
        (err) => {
            console.log('Error ', err);
        }); 
    }

  }

  check4CircleStatus() {
    if(!this.loggedUsername){
      this.userService.isInCircle(this.userName, this.loggedUsername).subscribe(
          (result) => {
              this.isInCircle = result; 
          },
          (err) => {
              console.log('Error ', err);
          }); 
    }

  }

  //OBSOLETE?
  getLegislator(id: string) {
    this.legisId = id;
    //this.imageName = '../../images/'+this.party.profileImage;
    console.log('getLegislator() legislator ' + this.legisId);
    //if (!this.legislator) {
    if (this.legisId) {
      console.log('this.legisId ' + this.legisId);
      //let id = +this._routeParams.get('id');
      //this._heroService.getHero(id).then(legislator => this.legislator = legislator);
      this.legislatorsService.getLegislature(this.legisId, 'bioguide_id')
        .pipe(
          map(result => this.resultop = result.results),
          tap((result) => {
            if (result.length > 0) {
              this.legislator = result[0];
            }
            console.log('Loading: ' + this.legislator);
            this.keys = Object.keys(this.legislator);
            console.log('keys ' + this.keys);

            //console.log("this.legislator.bioguide_id " + this.legislator.bioguide_id);
            //retrieving the image from bioguide
            /*
            if(this.legislator.bioguide_id){
               let intial = this.legislator.bioguide_id.charAt(0);
               let imageUrl = 'http://bioguide.congress.gov/bioguide/photo/' + intial + '/' + this.legislator.bioguide_id + '.jpg';
               console.log("bioguide image url " + imageUrl);
               this.legislator.bioguideImageUrl = imageUrl;
            }
            */
          })
          //,catchError(this.handleError<any>(`Error in getDistrictInfoFromGoogle()`))
        );

      //       this.legislatorsService.getLegislature(this.legisId, 'bioguide_id')
      // .map(result => this.resultop = result.results)
      // .subscribe((result) => {
      //           if(result.length > 0){
      //             this.legislator = result[0];
      //           }
      //           console.log("Loading: " + this.legislator);
      //        this.keys = Object.keys(this.legislator);
      //        console.log("keys " + this.keys);

      //         });


    } else if (this.legislator) {
      this.keys = Object.keys(this.legislator);
      console.log('keys ' + this.keys);
      //console.log("this.legislator.bioguideImageUrl " + this.legislator.bioguideImageUrl);
    }

  }

  getUsername(legislator: Legislator): void{
    let searchString:string = null;

    if (legislator['leg_id']) {
      console.log('legislator[leg_id] ', legislator['leg_id']);
      this.userName = legislator['leg_id'];

    } else if(this.legislator['photo_url'] && this.legislator['photo_url'].indexOf('bioguide.congress.gov') != -1 ) { //CONGRESS
      console.log('this.legislator[photo_url] ', this.legislator['photo_url']);
      let photoUrl = this.legislator['photo_url'];
      let fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
      this.userName = fileName.substring(0, fileName.lastIndexOf('.'));


    }else if (legislator['full_name']) {
      console.log('legislator[full_name] ', legislator['full_name']);
      searchString = legislator['full_name'].replace( /\".*?\"/, '' ).replace(/\s+/g,' ').trim();
      this.searchService.getUsers(searchString)
      .subscribe(
        (result) => {
          if(result.length > 0 && searchString === result[0]['full_name']){
            this.userName = result[0]['username'];
            this.check4CircleStatus();
          }else{
            //create user with legislator data ?
          }
        },
        (err) => {
            console.log('Error ', err);
            //create user with legislator data ?
        }); 

    }
  }

  //called from UI on selection of a Legislator
  gotoLegislator(legislator: Legislator): void {
    console.log('selected legislator - this.userName' + this.userName);
    if(this.userName === 'createnew'){
      this.datashareService.setLegislator(legislator);
      this.router.navigate(['/user', {'userObj':legislator}]);
    }else{
      this.router.navigate(['/user', this.userName]);
    }
  }


}
