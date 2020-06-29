import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AppConstants} from '../../../app.constant.enum';

import {UserService} from '../../../services/user.service';
import {PostService} from '../../../services/post.service';
import {AlertService} from '../../../services/alert.service';
import {ProfileService} from '../../../services/profile.service';
import {DatashareService} from '../../../services/datashare.service';
import {Route} from '@angular/router';

import {User} from '../../../models/user';

@Component({
  selector: 'app-createpage',
  templateUrl: './createpage.component.html',
  styleUrls: ['./createpage.component.css']
})
export class CreatepageComponent implements OnInit {
  userCreationForm = new FormGroup({});
  biodataTemplate={};
  biodataTemplateData={};
  user = {};
  searchUsers:any;
  keyword = 'firstName';

  createLegislatorPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_LEGISLATOR),
    username: new FormControl('', Validators.required),
    full_name: new FormControl('', Validators.required),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    party: new FormControl(''),
    district: new FormControl(''),
    chamber: new FormControl(''),
    state: new FormControl('')
  });

  createDistrictPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_LEGISLATIVE_DISTRICT),
    username: new FormControl('', Validators.required),
    full_name: new FormControl('', Validators.required),
    description: new FormControl(''),
    accessRestriction: new FormControl('')
  });

  createPartyPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_POLITICAL_PARTY),
    username: new FormControl('', Validators.required),
    full_name: new FormControl('', Validators.required),
    description: new FormControl('')
  });

  createGroupPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_GROUP),
    username: new FormControl('', Validators.required),
    full_name: new FormControl('', Validators.required),
    description: new FormControl(''),
    accessRestriction: new FormControl('')
  });

  //isCreatepage4user: boolean = true;
  page:string = 'user';
  userType:string=null;
  profileTemplateId:string = null;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private constants:AppConstants,
    private datashareService: DatashareService,
    private userService: UserService,
    private alertService: AlertService,
    private postService: PostService,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      let page = params['opt'];
      //this.isCreatepage4user = true;
      if(page == 'district'){
       this.userType = this.constants.USERTYPE_LEGISLATIVE_DISTRICT;
       this.userCreationForm = this.createDistrictPageForm;

       this.profileTemplateId = 'upDefault';

      }else if(page == 'user'){
        this.userType = this.constants.USERTYPE_PUBLICUSER;

        this.profileTemplateId = 'upDefault';

      }else if(page == 'legislator'){
        this.userType = this.constants.USERTYPE_LEGISLATOR;
        this.userCreationForm = this.createLegislatorPageForm;

        this.profileTemplateId = 'upCongressLegislatorExternal';//should be upDefault, once code is refactored
      }else if(page == 'party'){
        this.userType = this.constants.USERTYPE_POLITICAL_PARTY;
        this.userCreationForm = this.createPartyPageForm;
        this.profileTemplateId = 'upDefault';
      }else if(page == 'group'){
        this.userType = this.constants.USERTYPE_GROUP;
        this.userCreationForm = this.createGroupPageForm;
        this.profileTemplateId = 'upDefault';
      }

      this.loadBioDataTemplate(this.profileTemplateId, this.userType);

    });
  }

  onChangeSearch(e){
    this.postService.getTagUsers(e)
    .subscribe((data:any) => {
        this.searchUsers = data;
    });
}

  createUser(){
    let profileDatasList:Array<Object> = [];
    let profileManagedBy:Array<string> = [];
    let loggedUser: User = null;
    this.generateBioProfileTemplateData();
    this.user = this.userCreationForm.value;
    profileDatasList.push(this.biodataTemplateData);
    this.user['profileDatas'] = profileDatasList;
    this.user['status'] = 'PASSIVE';

    loggedUser = this.datashareService.getCurrentUser();
    if (loggedUser && loggedUser.username) {
      profileManagedBy.push(loggedUser.username);
      this.user['profileManagedBy'] = profileManagedBy;
    }



    console.log('Creating User with info ', this.user);

    this.userService.registerUser(this.user)
    .subscribe(
        data => {
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/user', data['username']]);
        },
        error => {
            this.alertService.error(error);

        });


  }

  generateBioProfileTemplateData(){
    let data={};
    let propId:string="";
    let properties:[] = this.biodataTemplate['properties'];
    for (let property of properties) {
      if(this.userCreationForm.get(property['propId']) != null){
        console.log("userCreationForm " + property['propId'] + " ", this.userCreationForm.get(property['propId']).value);
        propId = property['propId'];
        data[propId] = this.userCreationForm.get(property['propId']).value;
      }
    }
    this.biodataTemplateData['entityId'] = this.userCreationForm.get('username').value;
    this.biodataTemplateData['profileTemplateId'] = this.profileTemplateId;
    this.biodataTemplateData['entityType'] = this.biodataTemplate['type'];

    this.biodataTemplateData['data'] = data;

  }

  loadBioDataTemplate(profileTemplateId:string, type:string){
    this.profileService.getProfileTemplateByType(profileTemplateId, type)
    .subscribe((response) => {
        this.biodataTemplate = response;

    });
  }

  loadcreatepage(evt, opt){
    evt.preventDefault();
    this.router.navigate(['createpage'],{ queryParams: { 'opt': opt } });

  }

}
