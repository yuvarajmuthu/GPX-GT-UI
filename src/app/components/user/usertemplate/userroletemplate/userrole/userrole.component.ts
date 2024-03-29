import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {AbstractTemplateComponent} from '../../../abstractTemplateComponent';
import {UserService} from '../../../../../services/user.service';
import {DatashareService} from '../../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../../services/componentcommunication.service';

import {ProfileData} from '../../../../../models/profiledata';
import {User} from '../../../../../models/user';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.css']
})
export class UserroleComponent extends AbstractTemplateComponent implements OnInit {
  id = 'upRole';
  @Input() roleObj:ProfileData; 
  @Input() displayProperties: [];
  
  role: {};
  closeResult: string;
  roleForm: FormGroup;
  data = {};
  isProfileInEditMode:boolean = false;
  inEditMode:boolean = false;
  loggedUsername: string = null;
  userData:User = new User();
  //userData:User = null;



  constructor(private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private dataShareService2:DatashareService, 
    private fbuilder: FormBuilder,
    private userService: UserService,
    private communicationService: ComponentcommunicationService,
    ) { 
      super(dataShareService2, null);
      communicationService.userProfileEditChanged$.subscribe(
        editmode => {
            console.log('Received edit-save Profile message ' + editmode);
            this.inEditMode = editmode;
            this.changeDetector.detectChanges();

        });    

  }

  ngOnInit() {
    this.userData = new User();

    this.loggedUsername = this.dataShareService2.getLoggedinUsername();

    this.role = this.roleObj['data'];
    if(this.roleObj.entityType === 'LEGISLATIVE COMMITTEE'){
      this.userService.getUserData(this.roleObj.data['committeeId'], this.loggedUsername).subscribe(
        data => {
          //console.log('committee data ', data);
          this.userData = data;
          console.log('committee userData ', this.userData);
          this.changeDetector.detectChanges();
  
          });
    }else{
      this.createFormGroup();
    }
    this.inEditMode = this.dataShareService2.isProfileEditable();

  }

  createFormGroup() {
    //this.biodataTemplateForm = this.fbuilder.group({});
    //let struct:string = "\"{";//"new FormGroup({";
    this.roleForm = this.fbuilder.group({});

    this.displayProperties.forEach((element, index) => {
        let value = this.role[element['propId']];
        console.log('element[propId] ', element['propId'], ' this.role[element[propId]] ', this.role[element['propId']]);
        this.roleForm.setControl(element['propId'], new FormControl(value));
    });
    this.changeDetector.detectChanges();
  }

  open(content, role) {
    if(role === ''){
        role = null;
    }
    this.role = role;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.isProfileInEditMode = true;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return  `with: ${reason}`;
    }
  }

  getFormData():any{
    console.log("Object.assign({}, this.roleForm.value) ", Object.assign({}, this.roleForm.value));
    const result: {} = Object.assign({}, this.roleForm.value);
    console.log("Role form ", result);
    return result;
  }


saveProfile(){
    if(this.roleObj && this.roleObj['id']){
        this.data["id"] = this.roleObj['id']; //primary key
    }
    this.data["profileTemplateId"] = this.id; //unique key
    this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
    this.data["data"] = this.getFormData();
    console.log("Data " + JSON.stringify(this.data));
    this.userService.updateProfileData(this.data).subscribe((response) => {
      console.log('Profile updated sucessfully');
      this.isProfileInEditMode = false;
      this.role = this.data["data"];
      this.changeDetector.detectChanges();

    } 
    );

  }  

}
