import {Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef, isDevMode} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import {catchError, map, tap, switchMap} from 'rxjs/operators';

import {LegislatorService} from '../../services/legislator.service';
import {ComponentcommunicationService} from '../../services/componentcommunication.service';
import {AlertService} from '../../services/alert.service';

import {Legislator} from '../../models/legislator';

import {LegislatorComponent} from '../../components/legislator/legislator.component';

import {GAddressSearchComponent} from '../../components/g-address-search/g-address-search.component';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-searchlegislators',
  templateUrl: './searchlegislators.component.html',
  styleUrls: ['./searchlegislators.component.css']
})
export class SearchlegislatorsComponent implements OnInit {
  legislators: Array<any> = [];
  legislatorsDisplay: Array<any> = [];
  //screenWidth: number;
  legislator = {};
  legislatorsData = {};//{'names':['U.S. Senator', 'U.S. Representative'], 'U.S. Senator':[{}],'U.S. Representative':[{}]}
  resultop: any;
  resultop1: any;
  ipZipcode: String = '';
  address: string;// = '300 Chatham Park Drive,Pittsburgh, PA 15220';
  currentLocationZip = '19406';
  public selectedlegislator: Legislator;
  latitude: any;
  longitude: any;
  //congressDistrict:string;
  congressDistricts: JSON[] = [];
  state: string;
  searchTip: string;
  districtLabel: string;
  stateData: boolean;
  congressData: boolean;
  findReps: boolean = false;
  offices = [];
  divisionOffices = null;
  divisioncategory  = [];
  divisions = [];
  //searchBtnLabel:string;
  selectedDivision:string;
  selectedDivisionOffice:string;

  @Output()
  success = new EventEmitter();

  @Input() registration: boolean = false;

  constructor(private  router: Router,
              private route: ActivatedRoute,
              private legislatorsService: LegislatorService,
              private missionService: ComponentcommunicationService,
              private alertService: AlertService,
              private changeDetector: ChangeDetectorRef) {
                //this.getScreenSize();
    if (this.stateData) {
      //this.getCongressLegislatorsByLatLong();
      //this.loadStateData();
    } else if (this.congressData) {

    }
    /*  missionService.getAlert().subscribe(
          mission => {
            console.log("Alert message received " + mission);
          });*/
  }
  /*
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
        console.log(this.screenWidth);
  }
  getScreenStyle() {
    if (this.screenWidth && this.screenWidth < 1200) {
      return 'filterPill';
    } else {
      return '';
    }
  }
  */
  ngOnInit() {
    if(!this.registration){
      let address = this.route.snapshot.queryParamMap.get('address');
      console.log('searchlegislators ngOnInit() address ', address);
      if(address != null){
        this.address = address;
        this.loadCongressData();  
      }

    }
  }

  loadCircleUsers(evt, opt){
    evt.preventDefault();
    console.log(evt,opt);

    this.findReps = false;


    //this.router.navigate(['search'],{ queryParams: { 'opt': opt } });

  }

  //invoked from searchLegis.html
  loadStateData() {
    this.stateData = true;
    this.congressData = false;

    this.getCongressLegislatorsByLatLong();
    //this.loadStateData()
    this.districtLabel = 'Your State Legislative District(s):';
  }

  findRepresentatives(){
    this.findReps = true;
  }
  


  loadCongressData() {

    if(this.registration){
      console.log('redirecting to searchLegislator for address ' + this.address);
      this.router.navigate(['searchLegislator'],{ queryParams: { 'address': this.address } });
      return;

    }
    
    if (!this.address && !isDevMode()) {
      //this.missionService.announceAlertMission("{'alertType':'danger', 'alertMessage':'Please provide address to search for Congress data.'}");

      this.alertService.error('Please provide an address to find the Representatives.');

      return;
    }


    this.getLegislators(this.address, 'congress');

    //this.districtLabel = 'Your Congressional District(s):';
  }

  private getCongressLegislatorsByLatLong() {

    if (this.address) {


      this.legislatorsService.getLocation(this.address)
      //.map(result => this.resultop1 = result.results[0])
        .subscribe((result) => {
          result = result.results[0];
          console.log('geocoding output ' + JSON.stringify(result));
          let geometry = result['geometry'];
          let latLong = geometry['location'];

          this.latitude = latLong['lat'];
          this.longitude = latLong['lng'];
          console.log('current position latitude ' + this.latitude + ',longitude ' + this.longitude);
          this.getLegislators(this.latitude + ',' + this.longitude, 'latlong');
          //this.getDistrict(this.latitude+','+this.longitude, 'latlong');
          this.searchTip = 'Showing legislator(s) for the location: Latitude ' + this.latitude + ', Longitude ' + this.longitude;

        });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('current position latitude ' + this.latitude + ',longitude ' + this.longitude);
        this.getLegislators(this.latitude + ',' + this.longitude, 'latlong');
        //this.getDistrict(this.latitude+','+this.longitude, 'latlong');
        this.searchTip = 'Showing legislator(s) for the location: Latitude ' + this.latitude + ', Longitude ' + this.longitude;
      });
    }

  }

  /*
  private getLatitudeLongitude(callback, address) {
      // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
      address = address || 'Ferrol, Galicia, Spain';
      // Initialize the Geocoder
      let geocoder = new google.maps.Geocoder();
      if (geocoder) {
          geocoder.geocode({
              'address': address
          }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                  callback(results[0]);
              }
          });
      }
  }
  */

  //DEPRECATED
  getCongressLegislatorsByZip(zipcode: string) {
    console.log('Search value: ' + zipcode);
    this.currentLocationZip = zipcode;
    this.legislators = [];
    this.getLegislators(zipcode, 'zipcode');
    this.getDistrict(zipcode, 'zipcode');
    this.searchTip = 'Showing legislator(s) for the location: Zipcode ' + zipcode;

  }


  //DEPRECATED
  //using CONGRESS API
  getDistrict(searchParam: string, type: string) {
    //  console.log("getDistrict() searchParam" + searchParam + ',type ' + type);
    // this.legislatorsService.getDistrict(searchParam, type)
    // .map(result => this.resultop1 = result.results)
    // .subscribe((result) => {
    //     this.congressDistricts = [];
    //     for(var i = 0; i<result.length; i++) {
    //       console.log("getDistrict - " + result[i]);
    //       this.state = result[i]['state'];

    //       let district:any = {};
    //       district['name'] = result[i]['district'];
    //       district['state'] = result[i]['state'];
    //       this.congressDistricts.push(district);
    //     }
    //  });
  }

  getAddress(addressEvent: Event) {
    console.log('Address - ' + addressEvent['formatted_address']);
    this.address = addressEvent['formatted_address'];
    this.changeDetector.detectChanges();

  }

//DEPRECATED
  getDistrictByZip(zipcode: string) {
    // console.log("getDistrictByZip " + zipcode);
    // this.legislatorsService.getDistrictByZipcode(zipcode)
    // .map(result => this.resultop1 = result.results)
    // .subscribe((result) => {
    //     this.congressDistricts = [];
    //     for(var i = 0; i<result.length; i++) {
    //       console.log("getDistrict - " + result[i]);
    //       this.state = result[i]['state'];
    //       //this.congressDistrict = result[i]['district'];

    //       let district:any = {};
    //       district['name'] = result[i]['district'];
    //       district['state'] = result[i]['state'];
    //       this.congressDistricts.push(district);
    //     }
    //  });
  }

  getLegislators(searchParam: string, type: string) {
    this.legislators = [];
    this.legislatorsDisplay = [];
    this.legislatorsService.getLegislature(searchParam, type)
    //.map(result => this.resultop = result.results)
      .subscribe((result) => {
          console.log('result for type ' + type + JSON.stringify(result));
          if (type == 'congress') {
            if (!result['error']) {

              //this.congressDistricts = [];
this.processOCD(result);
///
/*
              let offices = [];
              offices = result['offices'];

              let officials = [];
              officials = result['officials'];

              for (var i = 0; i < offices.length; i++) {
                if (offices[i] && offices[i]['name'] &&
                  //(offices[i]['name'].indexOf('United States Senate') != -1 ||
                  //  offices[i]['name'].indexOf('United States House of Representatives') != -1)) {
                  (offices[i]['name'].indexOf('U.S. Senator') != -1 ||
                  offices[i]['name'].indexOf('U.S. Representative') != -1)) {
                    let officialIndices = [];
                    officialIndices = offices[i]['officialIndices'];
                    for (var m = 0; m < officialIndices.length; m++) {
                    /////B
                    let k = officialIndices[m];
                    let legislator = {};

                  legislator['full_name'] = officials[k]['name'];
                  legislator['party'] = officials[k]['party'];
                  legislator['photo_url'] = officials[k]['photoUrl'];


                  if (offices[i]['name']) {
                    legislator['role'] = offices[i]['name'];
                  }

                  let division: string = offices[i]['divisionId'];
                  legislator['ocdId'] = division; //division id from google civic
                  if (division.indexOf('state:') != -1) {
                    legislator['state'] = division.substr(division.indexOf('state:') + 6, 2);
                  }

                  //CD level data
                  if (division.indexOf('cd:') != -1) {
                    legislator['district'] = division.substr(division.indexOf('cd:') + 3, 2);
                  }


                  if (offices[i]['roles'] && offices[i]['roles'].length > 0) {
                    legislator['chamber'] = offices[i]['roles'][0];
                  }

                  this.legislators.push(legislator);
                  this.legislator = legislator;
                  }
                }
              }*/
              //
            } else {
              console.log('Error in getting');
              this.alertService.error('Error in getting data');
            }
          } else {//DATA FOR STATE - OPENSTATES
            for (var i = 0; i < result.length; i++) {
              this.legislator = result[i];
              this.legislators.push(this.legislator);

            }
          }
          //USED TO SET THE STATE AND DISTRICT
          this.congressDistricts = [];
          let districtsArr: string[] = [];
          for (var i = 0; i < this.legislators.length; i++) {

            this.legislator = this.legislators[i];

            this.state = this.legislator['state'];

            //array of Districts to display
            if (this.legislator['district'] && (districtsArr.indexOf(this.legislator['district']) == -1)) {
              districtsArr.push(this.legislator['district']);
              let district: any = {};
              district['name'] = this.legislator['district'];
              district['state'] = this.legislator['state'];
              if (this.legislator['ocdId']) {
                district['ocdId'] = this.legislator['ocdId'];
                district['externalId'] = this.legislator['ocdId'];
              }
              this.congressDistricts.push(district);
            }

          }


        },
        (error) => {
          console.log('Error in getting Legislators ', error['_body']);
          this.alertService.error(error['_body']);
        });

  }

  processOCD(result:JSON){

    let divisionsObj = {};
    let roleObj = {};
    let otherContactsObj = {};
    let divisionsKeys = [];
    let divisionUnit:string[] = [];
    this.divisions = [];
    //this.divisionOffices = [];
    let roleProperty = '';

    divisionsObj = result['divisions'];
    divisionsKeys = Object.keys(divisionsObj);
    console.log("division keys " + divisionsKeys); 
    for (var i = 0; i < divisionsKeys.length; i++) {//"ocd-division/country:us/state:pa/cd:18"
roleObj = {};
      let divisionsKey:string = divisionsKeys[i];
      console.log('Processing division ', divisionsKey);
      let divisionData:{} = divisionsObj[divisionsKey];
      let divisionsKeySplited:string[] = divisionsKey.split('/');
      for (var b = 0; b < divisionsKeySplited.length; b++) {//["ocd-division", "country:us", "state:pa", "cd:18"]
        if(divisionsKeySplited[b] !== 'ocd-division'){
          divisionUnit = divisionsKeySplited[b].split(':'); 
          
          if(divisionUnit[0] === 'cd'){
            roleProperty = 'Congressional district';
          }else if(divisionUnit[0] === 'sldl'){//state legislative district - lower
            roleProperty = 'State House district';
          }else if(divisionUnit[0] === 'sldu'){//state legislative district - upper
            roleProperty = 'State Senate district';
          }else{
            roleProperty = divisionUnit[0].replace('_', ' ');
          }

          if(b === divisionsKeySplited.length-1){ //last item
            this.divisioncategory.push(divisionUnit[0]);//cd
            roleObj[roleProperty] = divisionData['name']; //"Pennsylvania's 18th congressional district"
          }else{
            roleObj[roleProperty] = divisionUnit[1].replace('_', ' ');
          }
        }
      }

      this.divisions.push(divisionData['name']);

      let officevalues:string[] = [];
      let officeObj = {};
      if(divisionData['officeIndices']){
        for (var j = 0; j < divisionData['officeIndices'].length; j++) {
          let officeIndex:number =  divisionData['officeIndices'][j];
          if(result['offices'] && result['offices'][officeIndex]){
            let office:{} = result['offices'][officeIndex];//OFFICE level data
            let officeName:string = office['name'];
            console.log("officeName ", officeName); 

            officevalues.push(officeName);
            //roleObj['type'] = office['name'];//"United States House of Representatives PA-18"

            if(office['officialIndices']){
              for (var k = 0; k < office['officialIndices'].length; k++) {
                let officialsIndex:number =  office['officialIndices'][k];
                if(result['officials'] && result['officials'][officialsIndex]){
                  let official:{} = result['officials'][officialsIndex];
//
                  let legislator = {};
                  let legisRoleObj = {};
                  //legisRoleObj = roleObj;
                  legisRoleObj = JSON.parse(JSON.stringify(roleObj));
                  legisRoleObj['type'] = officeName;//"United States House of Representatives PA-18"
                  let fullName:string = official['name'];
                  console.log("Official index " + officialsIndex, ", ", fullName); 
                  if(fullName)
                    legislator['full_name'] = fullName.replace( /\".*?\"/, '' ).replace(/\s+/g,' ').trim();

                  //party data  
                  legisRoleObj['party'] = official['party'];
                  legislator['division'] = divisionData['name'];
                  //legislator['divisionOffice'] = office['name'];
                  //retrieving address
                  if(official['address'] && official['address'].length > 0){
                    let addressObj = official['address'][0];
                    let address:string = '';
                    if(addressObj['line1']){
                      address = address + addressObj['line1'];
                    }
                    if(addressObj['line2']){
                      address = address + ", " + addressObj['line2'];
                    }
                    if(addressObj['city']){
                      address = address + ", "  + addressObj['city'];
                    }
                    if(addressObj['state']){
                      address = address + ", "  + addressObj['state'];
                    }
                    if(addressObj['zip']){
                      address = address + ", "  + addressObj['zip'];
                    }
                    legisRoleObj['address'] = address;

                  } 

                  //phone data
                  if(official['phones'] && official['phones'].length > 0){
                    legisRoleObj['phone'] = official['phones'][0];
                  }

                  //url data
                  if(official['urls'] && official['urls'].length > 0){
                    legisRoleObj['url'] = official['urls'][0];
                  }
                  legislator['role'] = legisRoleObj;

                  //retrieving other contacts
                  if(official['channels'] && official['channels'].length > 0){
                    otherContactsObj = {};
                    for (var c = 0; c < official['channels'].length; c++) {
                      let channelObj = official['channels'][c];
                      otherContactsObj[channelObj['type']] = channelObj['id'];
 
                    }

                    legislator['otherContacts'] = otherContactsObj;
                  } 

                  legislator['sourceSystem'] = 'GOOGLE';
                  if (isDevMode() || official['photoUrl'] === null) {
                    legislator['photoUrl'] = 'assets/images/avatar1.png';
                  }else{
                    legislator['photoUrl'] = official['photoUrl'];
                  }

                  this.legislatorsDisplay.push(legislator);
                  console.log('legislator data ', legislator);
                }
              }
            }

          }
        }

      }
      officeObj[divisionData['name']] = officevalues;
      this.offices.push(officeObj);

    }

  }
 
  selectDivision(division:string){
    console.log('selected division ', division);
    this.divisionOffices = [];
    this.selectedDivision = division;
    this.offices.forEach(element => {
      
      if(element[division]){
        console.log('selected divisions office ', element[division]);
        this.divisionOffices = element[division]; //Offices for the selected Division
        return;
      }
    });

    this.legislators = [];


    this.legislatorsDisplay.forEach(element => {
      
      if(element['division'] === division){
        this.legislators.push(element);
      }
    });

    

  }

  selectDivisionOffice(divisionOffice:string){
    console.log('selected division office ', divisionOffice);
    this.selectedDivisionOffice = divisionOffice;

    this.legislators = [];
    this.legislatorsDisplay.forEach(element => {
      
      //if(element['divisionOffice'] === divisionOffice){
      if(element['role']['type'] === divisionOffice){
        this.legislators.push(element);
      }
    });
  }

  gotoDistrict(district: JSON) {
    console.log('Navigating to district ' + JSON.stringify(district));
    let districtName: string;

    districtName = district['name'];

    //let url = '/group/' + districtName;
    let url = '';//'/group';
    if (district['externalId'] != undefined) {
      this.router.navigate([url, {externalId: this.escapeForwardSlash(district['externalId'])}]);
    } else {
      this.router.navigate([url]);
    }
  }

  escapeForwardSlash(input: string) {
    let output: string;
    //output = input.split('/').concat('#');
    output = input.replace(/\//g, '_');
    console.log('Escaping forward slash ' + input + ' and output is ' + output);
    return output;
  }


  /*
    gotoLegislator(legislator: Legislator):void{
      this.selectedlegislator = legislator;

      console.log('selected item - ' +  this.selectedlegislator);
      console.log('bioguide_id of selected item - ' +  this.selectedlegislator.bioguide_id);

      this.router.navigate(['/legislator', this.selectedlegislator.bioguide_id]);
    }
    */
}
