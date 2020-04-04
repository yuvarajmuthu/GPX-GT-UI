import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {AbstractTemplateComponent} from '../../../abstractTemplateComponent';
import {UserService} from '../../../../../services/user.service';
import {DatashareService} from '../../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../../services/componentcommunication.service';

@Component({
  selector: 'app-useroffice',
  templateUrl: './useroffice.component.html',
  styleUrls: ['./useroffice.component.css']
})
export class UserofficeComponent extends AbstractTemplateComponent implements OnInit {
  id = 'upOffice';

  @Input() officeObj:{}; 
  @Input() displayProperties: [];

  office: {};
  closeResult: string;
  officeForm: FormGroup;
  data = {};
  isProfileInEditMode:boolean = false; 
  inEditMode:boolean = false;


  constructor(private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private dataShareService2:DatashareService, 
    private fbuilder: FormBuilder,
    private userService: UserService,
    private communicationService: ComponentcommunicationService,
    ) { 
      super(null, dataShareService2, null);
      communicationService.userProfileEditChanged$.subscribe(
        editmode => {
            console.log('Received edit-save Profile message ' + editmode);
            this.inEditMode = editmode;
            this.changeDetector.detectChanges();

        });    

  }

  ngOnInit() {
    //this.office = this.officeObj['data'];
    this.office = this.officeObj;
    this.createFormGroup();
    this.inEditMode = this.dataShareService2.isProfileEditable();

  }

  createFormGroup() {
    //this.biodataTemplateForm = this.fbuilder.group({});
    //let struct:string = "\"{";//"new FormGroup({";
    this.officeForm = this.fbuilder.group({});

    this.displayProperties.forEach((element, index) => {
        let value = this.office[element['propId']];
        console.log('element[propId] ', element['propId'], ' this.office[element[propId]] ', this.office[element['propId']]);
        this.officeForm.setControl(element['propId'], new FormControl(value));
    });
    this.changeDetector.detectChanges();
  }

  open(content, office) {
    if(office === ''){
        office = null;
    }
    this.office = office;
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

  //OBSOLETE, though part of AbstractTemplateComponent
  getData(): string {

    return '';
  }

  getFormData():any{
    console.log("Object.assign({}, this.officeForm.value) ", Object.assign({}, this.officeForm.value));
    const result: {} = Object.assign({}, this.officeForm.value);
    console.log("office form ", result);
    return result;
  }


saveProfile(){
    if(this.officeObj && this.officeObj['id']){
        this.data["id"] = this.officeObj['id']; //primary key
    }
    this.data["profileTemplateId"] = this.id; //unique key
    this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
    this.data["data"] = this.getFormData();
    console.log("Data " + JSON.stringify(this.data));
    this.userService.updateProfileData(this.data).subscribe((response) => {
      console.log('Profile updated sucessfully');
      this.isProfileInEditMode = false;
      this.office = this.data["data"];
      this.changeDetector.detectChanges();

    } 
    );

  }  

}
