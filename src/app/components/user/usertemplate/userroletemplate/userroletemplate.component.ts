import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
    selector: 'app-userroletemplate',
    templateUrl: './userroletemplate.component.html',
    styleUrls: ['./userroletemplate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class UserroletemplateComponent extends AbstractTemplateComponent implements OnInit { 
    id = 'upRole';
    profileIcon = 'group';
    //roles:any = null;
    roles: JSON[] = [];
    displayProperties = [];
    role = {};
    data = {};
    viewingUser = {};
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

        console.log('constructor() userroletemplate.component');
        this.viewingUser = this.dataShareService2.getViewingUser();

        communicationService.userProfileEditChanged$.subscribe(
            editmode => {
                console.log('Received edit-save Profile message ' + editmode);
                this.inEditMode = editmode;
                this.changeDetector.detectChanges();

            });

    }

    ngOnInit() {
        console.log('ngOnInit() userroletemplate.component');
        /*
        this.userService2.getRoles(this.profileUserId).subscribe(
          result => {
            console.log(result.length);
            this.roles = result;
          });
          */
        this.loadDisplayProperties();

        this.loadTemplateData();
        this.inEditMode = this.dataShareService2.isProfileEditable();

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
        /*
          this.userService2.getRoles(this.profileUserId).subscribe(
            result => {
              console.log(result.length);
              this.roles = result;
              console.log(this.roles);

            });
            this.zone.run(() => {
              this.userService2.getRoles(this.profileUserId).toPromise().then((data) => {
                  this.roles= data;
                  console.log(this.roles);
              });
              })
      */
//this.zone.run(() => {

        this.userService2.getRoles(this.profileUserId, this.viewingUser['isCongress'])
            .subscribe((data) => {
                //console.log("roles count ", data.length);
                //this.role = JSON.parse(JSON.stringify(data[0]));
                //this.role['term'] = 'term';
                this.roles = data;
                this.createFormGroup();
                this.changeDetector.detectChanges();

            });
        /*
        data.forEach(element => {
          this.roles.push(JSON.parse(JSON.stringify(element)));
          console.log(this.roles);
          this.role = JSON.parse(JSON.stringify(element));

        });
        */
//      });

        //  });
    }

    createFormGroup() {
        this.roleTemplateForm = this.fbuilder.group({});
        this.displayProperties.forEach((element, index) => {
            //let value = this.legislator[element['propId']];
            this.roleTemplateForm.setControl(element['propId'], new FormControl(''));
        });
        
        this.changeDetector.detectChanges();
    }

    getFormData():any{
        console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.roleTemplateForm.value));
        const result: {} = Object.assign({}, this.roleTemplateForm.value);
        console.log("Role form ", result);
        return result;
      }

    saveProfile(){
        if(this.role && this.role['id']){
            this.data["id"] = this.role['id']; //primary key
        }
        this.data["profileTemplateId"] = this.id; //unique key
        this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
        this.data["data"] = this.getFormData();
        console.log("Data " + JSON.stringify(this.data));
        this.userService2.updateProfileData(this.data).subscribe((response) => {
          console.log('Profile updated sucessfully');
          this.isProfileInEditMode = false;
          this.role = this.data["data"];
          this.changeDetector.detectChanges();
  
        } 
        );
  
      }


}
