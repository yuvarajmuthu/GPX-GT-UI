import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-usermembertemplate',
  templateUrl: './usermembertemplate.component.html',
  styleUrls: ['./usermembertemplate.component.css']
})
export class UsermembertemplateComponent  extends AbstractTemplateComponent  implements OnInit  {
  id = "upMember"; 
  profileIcon = "business";
  //offices:any = null;
  offices:JSON[] = [];
  displayProperties = [];
  inEditMode:boolean = false;
  officeTemplateForm: FormGroup; 
  closeResult: string;
  office = {};
  members:string[] = [];

  constructor(private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private communicationService: ComponentcommunicationService, 
    private changeDetector : ChangeDetectorRef,
    private fbuilder: FormBuilder,
    private modalService: NgbModal 
    ) {
  
      super(dataShareService2, communicationService);
  
      console.log("constructor() usermembertemplate.component");
      communicationService.userProfileEditChanged$.subscribe(
        editmode => {
            console.log('Received edit-save Profile message ' + editmode);
            this.inEditMode = editmode;
            this.changeDetector.detectChanges();

        });    
        
  }

  ngOnInit() {
    console.log("ngOnInit() usermembertemplate.component");

     //this.loadDisplayProperties();     

      //this.loadTemplateData();   
      this.inEditMode = this.dataShareService2.isProfileEditable();
      //this.changeDetector.detectChanges();
      this.members = this.viewingUser.members;

  }

 
  createFormGroup() { 
    //this.biodataTemplateForm = this.fbuilder.group({});
    //let struct:string = "\"{";//"new FormGroup({";
    this.officeTemplateForm = this.fbuilder.group({});
    // console.log(this.displayProperties);

    this.displayProperties.forEach((element, index) => {
       // let value = this.legislator[element['propId']];
        this.officeTemplateForm.setControl(element['propId'], new FormControl(''));
        //this.biodataTemplateForm.setControl(element['propId'], null);
    });
    this.changeDetector.detectChanges();
}
getFormData():any{
  console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.officeTemplateForm.value));
  const result: {} = Object.assign({}, this.officeTemplateForm.value);
  console.log("office form ", result);
  return result;
}

  open(content, office) { 
    if(office === ''){
        office = null;
    }
    this.office = office;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
       // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

}
