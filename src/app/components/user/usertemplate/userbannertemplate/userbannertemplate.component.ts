import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {AbstractTemplateComponent} from '../../abstractTemplateComponent';

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService}     from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-userbannertemplate',
  templateUrl: '../userbiodatatemplate/userbiodatatemplate.component.html',//'./userbannertemplate.component.html',
  styleUrls: ['./userbannertemplate.component.css']
})
export class UserbannertemplateComponent extends AbstractTemplateComponent implements OnInit {

  id = "upDefault";
  bioObjId:string="";
  profileIcon = "person";
  firstName:string = "";//"Pennsylvania's 14th congressional district";
  lastName:string = "";//"Pennsylvania's 14th congressional district includes the entire city of Pittsburgh and parts of surrounding suburbs. A variety of working class and majority black suburbs located to the east of the city are included, such as McKeesport and Wilkinsburg. Also a major part of the district are number of middle class suburbs that have historic Democratic roots, such as Pleasant Hills and Penn Hills. The seat has been held by Democrat Mike Doyle since 1995. In the 2006 election, he faced Green Party candidate Titus North and returned to the house with 90% of the vote.";
  userName:string = "";
  emailId = "";
  imageUrl:string = "";
  
  data = {};
  biodata={};
  private userData = {};
  public profilesData = [];
  public profilesTemplates = [];
  isProfileInEditMode:boolean = false;
  private templateProperties = [];
  private templateData = [];
  //group:FormGroup; 
  biodataTemplateForm: FormGroup; // may not be needed
  bioEditForm: FormGroup;
  closeResult: string;

  externalUser:boolean;

  //legislator: Legislator;
  //resultop:any;
  //keys = [];
  
  
  //called before ngOnInit()
  constructor(    private changeDetector : ChangeDetectorRef,
    private fbuilder: FormBuilder,
    private modalService: NgbModal,
    private userService2:UserService, 
    private dataShareService2:DatashareService, 
    private missionService2: ComponentcommunicationService) {
  
      super(dataShareService2, missionService2);
  
      console.log("constructor() userbannertemplate");      

      //OBSOLETE?
      missionService2.missionAnnounced$.subscribe(
      mission => {
        console.log("Received save Profile message from parent for district " + mission);
  
        this.saveProfile();
      });

      missionService2.userProfileEditChanged$.subscribe(
        data => {
          console.log("Received user profile edit status " + data);
          this.isProfileInEditMode = data;
          this.changeDetector.detectChanges();

          if(!data){//Save Profile
            this.saveProfile();
          }

        });
  
  
    }

    //called after the constructor
  ngOnInit(): void {
    console.log("ngOnInit() userbannertemplate.component");
    if(this.viewingUser['external']){
      this.externalUser = true;  
    }

    this.loadDisplayProperties();     
  
    this.loadTemplateData();   
    this.biodataTemplateForm = this.fbuilder.group({});

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
      this.userService2.getBiodata(this.profileUserId)
      .subscribe((response) => {
        this.biodata= response['data'];
        if(response['id']){
          this.bioObjId = response['id']; //primary key
        }
        console.log('biodata response data ', this.biodata);
        this.changeDetector.detectChanges();
      });

      /*
        this.userService2.getUserData(this.profileUserId, true).subscribe(
          data => {
          this.userData = data;
          console.log("User data from service: ", this.userData);
  
  
            //getting the available profile templates for this user type
            this.profilesTemplates = this.userData['profile'];
            console.log("profile templates: ", this.profilesTemplates);
            for (let profileTemplates of this.profilesTemplates){
              console.log("reading template component properties: ", profileTemplates['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileTemplates['profile_template_id']){
                this.templateProperties = profileTemplates['properties'];
                break;  
              }
            }
  
  
            //getting the data for this user profile
            this.profilesData = this.userData['profileData'];
            console.log("profile data: ", this.profilesData);
  
            for (let profileData of this.profilesData){
              console.log("loading template component: ", profileData['profile_template_id']);
              //this.templateType.push(profileData['profile_template_id']);
              if(this.id == profileData['profile_template_id']){
                this.templateData = profileData['data'];
                break;  
              }
            }
  
            for (let dataObj of this.templateData){
              let keys = [];
              keys = Object.keys(dataObj);
              console.log("Template data keys " + keys[0] + ":" + dataObj[keys[0]]);
              this[keys[0]] = dataObj[keys[0]];
            }
  
          }
      );
      */
  
    }

    open(content, objData) {
//      if(office === ''){
 //         office = null;
  //    }
   //   this.office = office;
      this.createFormGroup();

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

    allowed():boolean{
        let permission:boolean = this.dataShareService2.checkPermissions();
        //console.log("allowed() - " + permission);
  
        return permission;
    }
    
    createFormGroup() {
      this.bioEditForm = this.fbuilder.group({});
  
      this.displayProperties.forEach((element, index) => {
          let value = this.biodata[element['propId']];
          console.log('element[propId] ', element['propId'], ' this.biodata[element[propId]] ', this.biodata[element['propId']]);
          this.bioEditForm.setControl(element['propId'], new FormControl(value));
      });
      this.changeDetector.detectChanges();
    }

    
    getDisplay(){
      console.log("Object.assign({}, this.biodataTemplateForm.value) ", Object.assign({}, this.biodataTemplateForm.value));
      //const result: Legislator = Object.assign({}, this.biodataTemplateForm.value);
      //console.log("Legislator form ", result.first_name);

    }

    //OBSOLETE, though part of AbstractTemplateComponent
    getData(): string {

      return '';
    }
  
    getFormData():any{
      console.log("Object.assign({}, this.officeForm.value) ", Object.assign({}, this.bioEditForm.value));
      const result: {} = Object.assign({}, this.bioEditForm.value);
      console.log("office form ", result);
      return result;
    }
   
    saveProfile(){
      if(this.bioObjId){
        this.data["id"] = this.bioObjId; //primary key
      }
      this.data["profileTemplateId"] = this.id; //unique key
      this.data["entityId"] = this.profileUserId; // how about for user updating other passive profile ?
      this.data["data"] = this.getFormData();
      console.log("Data " + JSON.stringify(this.data));
      this.userService2.updateProfileData(this.data).subscribe((response) => {
        console.log('Profile updated sucessfully');
        this.isProfileInEditMode = false;
        this.biodata = this.data["data"];
        this.changeDetector.detectChanges();

      } 
      );
    }
  
}
