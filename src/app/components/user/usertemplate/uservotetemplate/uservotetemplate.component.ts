import {Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-uservotetemplate',
  templateUrl: './uservotetemplate.component.html',
  styleUrls: ['./uservotetemplate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UservotetemplateComponent extends AbstractTemplateComponent implements OnInit {
  //@Input() officeObj:{}; 
  //@Input() displayProperties: [];

  id = 'upVote';
  profileIcon = 'group';
  profileDatas: JSON[] = [];
  roles: JSON[] = [];
  displayProperties = [];
  displayObj = {};
  role = {};
  data = {};
  //viewingUser = {};
  editorData = '';
  isProfileInEditMode:boolean = false;
  inEditMode:boolean = false;
  roleTemplateForm: FormGroup; 
  closeResult: string; 

  constructor(private userService2: UserService,
              private dataShareService2: DatashareService,
              private communicationService: ComponentcommunicationService,
              private changeDetector: ChangeDetectorRef,
              private fbuilder: FormBuilder,
              private modalService: NgbModal 
  ) {

      super(dataShareService2, communicationService);

      console.log('constructor() uservotetemplate.component');
      //this.viewingUser = this.dataShareService2.getViewingUser();

      communicationService.userProfileEditChanged$.subscribe(
          editmode => {
              console.log('Received edit-save Profile message ' + editmode);
              this.inEditMode = editmode;
              this.changeDetector.detectChanges();

          });

  }

  ngOnInit() {
    console.log('ngOnInit() uservotetemplate.component');

    this.loadDisplayProperties();

    this.loadTemplateData();
    this.inEditMode = this.dataShareService2.isProfileEditable();
  }
  open(content, displayObj) { 
    if(displayObj === ''){
      displayObj = null;
    }
    this.displayObj = displayObj;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

public onChange(event: CKEditor4.EventInfo) {
    console.log(event.editor.getData());
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


loadDisplayProperties() {
    //TODO
    //profile template for this template shall also loaded instead of getting all the template properties
    for (let profileTemplates of this.viewingUser['profileTemplates']) {
        //console.log("reading template component properties: ", profileTemplates['profile_template_id']);
        //this.templateType.push(profileData['profile_template_id']);
        if (this.id == profileTemplates['profileTemplateId']) {
            this.displayProperties = profileTemplates['properties'];
            break;
        }
    }
}

loadTemplateData() {
    this.userService2.getVotes(this.profileUserId)
        .subscribe((data) => {

            this.profileDatas = data;
            this.createFormGroup();

        });

}

createFormGroup() {
    this.roleTemplateForm = this.fbuilder.group({});
/*
    this.displayProperties.forEach((element, index) => {
        let value = this.legislator[element['propId']];
        console.log('element[propId] ', element['propId'], ' this.legislator[element[propId]] ', this.legislator[element['propId']]);
        this.roleTemplateForm.setControl(element['propId'], new FormControl(value));
    });
    */
    this.changeDetector.detectChanges();
}

getFormData():any{
    console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.roleTemplateForm.value));
    const result: {} = Object.assign({}, this.roleTemplateForm.value);
    console.log("Role form ", result);
    return result;
}

saveProfile(){
    if(this.displayObj && this.displayObj['id']){
        this.data["id"] = this.displayObj['id']; //primary key
    }
    this.data["profileTemplateId"] = this.id; //unique key
    this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
    this.data["data"] = this.getFormData();
    console.log("Data " + JSON.stringify(this.data));
    this.userService2.updateProfileData(this.data).subscribe((response) => {
      console.log('Profile updated sucessfully');
      this.isProfileInEditMode = false;
      this.displayObj = this.data["data"];
      this.changeDetector.detectChanges();

    } 
    );

}


}
