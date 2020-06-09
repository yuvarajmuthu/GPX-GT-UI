import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AppConstants} from '../../../app.constant.enum';

import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-createpage',
  templateUrl: './createpage.component.html',
  styleUrls: ['./createpage.component.css']
})
export class CreatepageComponent implements OnInit {
  userCreationForm = new FormGroup({});

  createLegislatorPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_LEGISLATOR),
    displayName: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    party: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    chamber: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    isPublic: new FormControl(true, ),
  });

  createDistrictPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_LEGISLATIVE_DISTRICT),
    displayName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  
  createPartyPageForm = new FormGroup({
    userType: new FormControl(this.constants.USERTYPE_POLITICAL_PARTY),
    displayName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });

  //isCreatepage4user: boolean = true;
  page:string = 'user';
  userType:string=null;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private constants:AppConstants,
    private userService: UserService,
    private alertService: AlertService,) { }
   
  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      let page = params['opt'];
      //this.isCreatepage4user = true;
      if(page == 'district'){
       this.userType = this.constants.USERTYPE_LEGISLATIVE_DISTRICT;
       this.userCreationForm = this.createDistrictPageForm;
      }else if(page == 'user'){
        this.userType = this.constants.USERTYPE_PUBLICUSER;
      }else if(page == 'legislator'){
        this.userType = this.constants.USERTYPE_LEGISLATOR;
        this.userCreationForm = this.createLegislatorPageForm;
      }else if(page == 'party'){
        this.userType = this.constants.USERTYPE_POLITICAL_PARTY;
        this.userCreationForm = this.createPartyPageForm;
      }
    });
  }

  createUser(){
    console.log('Creating User with info ', this.userCreationForm.value);

    this.userService.registerUser(this.userCreationForm.value)
    .subscribe(
        data => {
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/user']);
        },
        error => {
            this.alertService.error(error);

        });

  }

}
