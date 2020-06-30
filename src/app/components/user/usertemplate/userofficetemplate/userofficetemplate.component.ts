import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-userofficetemplate',
  templateUrl: './userofficetemplate.component.html',
  styleUrls: ['./userofficetemplate.component.css']
})
export class UserofficetemplateComponent extends AbstractTemplateComponent  implements OnInit  {
  id = "upOffices"; 
  profileIcon = "business";
  //offices:any = null;
  offices:JSON[] = [];
  displayProperties = [];
  inEditMode:boolean = false;
  officeTemplateForm: FormGroup; 
  closeResult: string;
  office = {};

  constructor(private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private communicationService: ComponentcommunicationService, 
    private changeDetector : ChangeDetectorRef,
    private fbuilder: FormBuilder,
    private modalService: NgbModal 
    ) {
  
      super(dataShareService2, communicationService);
  
      console.log("constructor() userofficetemplate.component");
      communicationService.userProfileEditChanged$.subscribe(
        editmode => {
            console.log('Received edit-save Profile message ' + editmode);
            this.inEditMode = editmode;
            this.changeDetector.detectChanges();

        });    
        
  }

  ngOnInit() {
    console.log("ngOnInit() userofficetemplate.component");
    /*
    this.userService2.getoffices(this.profileUserId).subscribe(
      result => {
        console.log(result.length);
        this.offices = result;
      });
      */
     this.loadDisplayProperties();     

      this.loadTemplateData();   
      this.inEditMode = this.dataShareService2.isProfileEditable();
      //this.changeDetector.detectChanges();
      

  }

  loadDisplayProperties(){
    for (let profileTemplates of this.viewingUser['profileTemplates']){
      //console.log("reading template component properties: ", profileTemplates['profile_template_id']);
      //this.templateType.push(profileData['profile_template_id']);
      if(this.id == profileTemplates['profileTemplateId']){
        this.displayProperties = profileTemplates['properties'];
        break;  
      }
    } 
  }

  loadTemplateData(){
  /*
    this.userService2.getoffices(this.profileUserId).subscribe(
      result => {
        console.log(result.length);
        this.offices = result;
        console.log(this.offices);

      });
      this.zone.run(() => {
        this.userService2.getoffices(this.profileUserId).toPromise().then((data) => {
            this.offices= data;
            console.log(this.offices);
        });
        })
*/
//this.zone.run(() => {

        this.userService2.getOffices(this.profileUserId, this.viewingUser["isCongress"])
        .subscribe((data) => {
          //console.log("offices count ", data.length);
          //this.office = JSON.parse(JSON.stringify(data[0]));
          //this.office['term'] = 'term';
          this.offices= data;
          //this.createFormGroup();

          this.changeDetector.detectChanges();
        }); 
          /*
          data.forEach(element => {
            this.offices.push(JSON.parse(JSON.stringify(element)));
            console.log(this.offices);
            this.office = JSON.parse(JSON.stringify(element));
              
          });
          */
//      });

  //  });
  }
  createFormGroup() { 
    //this.biodataTemplateForm = this.fbuilder.group({});
    //let struct:string = "\"{";//"new FormGroup({";
    this.officeTemplateForm = this.fbuilder.group({});

    this.displayProperties.forEach((element, index) => {
        let value = this.legislator[element['propId']];
        console.log('element[propId] ', element['propId'], ' this.legislator[element[propId]] ', this.legislator[element['propId']]);
        this.officeTemplateForm.setControl(element['propId'], new FormControl(value));
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

}