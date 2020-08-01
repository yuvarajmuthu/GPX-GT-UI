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
  userName: string = null;


  constructor(private  router: Router,
              private route: ActivatedRoute,
              private legislatorsService: LegislatorService,
              private userService: UserService,
              private searchService: SearchService,
              private datashareService: DatashareService) {
  }

  ngOnInit(): void {

    let id = this.route.snapshot.paramMap.get('id');
    this.loggedUsername = this.datashareService.getLoggedinUsername();

    // this.route.paramMap.pipe(
    //   switchMap((params: ParamMap) => this.getLegislator(params.get('id')))
    // );
    this.getLegislator(id);


  }

  add2Circle() {

    this.isInCircle = true;


}
  
  removeFromCircle() {

    if (this.isInCircle) {
      this.isInCircle = false;
    } else {
      this.isInCircle = true;
    }

  }

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

  //get invoked automatically before ngOnInit()
  routerOnActivate(): void {


    //this.legisId = curr.getParam("id");
    //console.log("Param value - id " + this.legisId);
    console.log('routerOnActivate()::searchlegislators.component invoked');


  }

  //called from UI on selection of a Legislator
  gotoLegislator(legislator: Legislator): void {
    console.log('selected legislator - ' + legislator);
    let searchString:string = null;
    this.datashareService.setViewingUser(legislator);



    if (legislator['leg_id']) {
      this.userName = legislator['leg_id'];

      this.router.navigate(['/user', this.userName]);

    } else if(this.legislator['photo_url'] && this.legislator['photo_url'].indexOf('bioguide.congress.gov') != -1 ) { //CONGRESS
      let photoUrl = this.legislator['photo_url'];
      let fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
      this.userName = fileName.substring(0, fileName.lastIndexOf('.'));

      this.router.navigate(['/user', this.userName]);


    }else if (legislator['full_name']) {
      searchString = legislator['full_name'].replace( /\".*?\"/, '' ).replace(/\s+/g,' ').trim();
      this.searchService.getUsers(searchString)
      .subscribe(
        (result) => {
          if(result.length > 0 && searchString === result[0]['full_name']){
            this.userName = result[0]['username'];
          }else{
            this.userName = 'createnew';
          }
          this.router.navigate(['/user', this.userName]);

        },
        (err) => {
            console.log('Error ', err);
        }); 

    }


  }


}
