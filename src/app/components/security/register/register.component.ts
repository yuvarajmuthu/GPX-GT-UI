import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService} from '../../../services/alert.service';
import {UserService} from '../../../services/user.service';

import {AppConstants} from '../../../app.constant.enum';

import {GAddressSearchComponent} from '../../../components/g-address-search/g-address-search.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    biodataTemplateData = {};
    //userType:string = null;
    category:string = null;
    profileTemplateId:string = null;
    address: string;// = '300 Chatham Park Drive,Pittsburgh, PA 15220';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService, 
        private userService: UserService,
        private constants:AppConstants) {
    }


    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            category: [this.constants.USERCATEGRORY_USER],
            full_name: ['', [Validators.required, Validators.minLength(2)]],
            firstNme: [''],
            lastName: [''],
            username:  [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)])],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.category = this.constants.USERCATEGRORY_USER;

        this.profileTemplateId = 'upDefault';

    }

    get f() {
        return this.registerForm.controls;
    }
    
    getAddress(addressEvent: Event) {
        console.log('Address - ' + addressEvent['formatted_address']);
        this.address = addressEvent['formatted_address'];
        //this.changeDetector.detectChanges();
    }

    generateBioProfileTemplateData(){
        let data={};
        let propId:string="";
        
        if(this.registerForm.get('full_name') && this.registerForm.get('full_name').value)
            data['full_name'] = this.registerForm.get('full_name').value;

        //following 3 properties may not be available    
        if(this.registerForm.get('emailId') && this.registerForm.get('emailId').value)            
            data['emailId'] = this.registerForm.get('emailId').value;
        
        if(this.registerForm.get('phone') && this.registerForm.get('phone').value)
            data['phone'] = this.registerForm.get('phone').value;

        //if(this.registerForm.get('address') && this.registerForm.get('address').value)
        //    data['address'] = this.registerForm.get('address').value;
        if(this.address)
            data['address'] = this.address;

        this.biodataTemplateData['entityId'] = this.registerForm.get('username').value;
        this.biodataTemplateData['profileTemplateId'] = this.profileTemplateId;
        //this.biodataTemplateData['category'] = this.category;
    
        this.biodataTemplateData['data'] = data;
    
    }

    register() {
        let profileDatasList:Array<Object> = [];
        let user = {};
        let members:Array<string> = [];

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.generateBioProfileTemplateData();
        user = this.registerForm.value;
        profileDatasList.push(this.biodataTemplateData);
        user['profileDatas'] = profileDatasList;
        user['status'] = 'ACTIVE';
        
        members.push(user['username']);
        user['members'] = members;

        this.submitted = true;
        this.loading = true;
        this.userService.registerUser(user)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error.error);
                    this.loading = false;
                });
                

    }

    loadLoginComponent() {
        this.router.navigate(['/login']);
    }
}
