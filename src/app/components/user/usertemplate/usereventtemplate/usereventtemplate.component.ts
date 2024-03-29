import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { UsereventformComponent } from './usereventform/usereventform.component';


import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-usereventtemplate',
  templateUrl: './usereventtemplate.component.html',
  styleUrls: ['./usereventtemplate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsereventtemplateComponent extends AbstractTemplateComponent implements OnInit {

  id = 'upEvent';
  profileIcon = 'group';
  roles: JSON[] = [];
  displayProperties = [];
  role = {};
  data = {};
  editorData = '';
  isProfileInEditMode:boolean = false; 
  inEditMode:boolean = false;
  roleTemplateForm: FormGroup; 
  closeResult: string;
  events:any;

  constructor(private userService2: UserService,
              private dataShareService2: DatashareService,
              private communicationService: ComponentcommunicationService,
              private changeDetector: ChangeDetectorRef,
              private fbuilder: FormBuilder,
              private modalService: NgbModal 
  ) {

      super(dataShareService2, communicationService);

      console.log('constructor() usereventtemplate.component');

      communicationService.userProfileEditChanged$.subscribe(
          editmode => {
              console.log('Received edit-save Profile message ' + editmode);
              this.inEditMode = editmode;
              this.changeDetector.detectChanges();

          });

  }

  open(event) {
    const modalRef = this.modalService.open(UsereventformComponent);
    modalRef.componentInstance.eventdetails = event;
  }


  ngOnInit() {
    this.inEditMode = this.dataShareService2.isProfileEditable();
    this.loadDisplayProperties();     

    this.loadTemplateData();  
    
  }

  loadDisplayProperties(){
    for (let profileTemplates of this.viewingUser['profileTemplates']){

      if(this.id == profileTemplates['profileTemplateId']){
        this.displayProperties = profileTemplates['properties'];
        break;  
      }
    } 
  }

  loadTemplateData(){


        this.userService2.getEvents(this.profileUserId)
        .subscribe((data) => {

          this.events= data;


          this.changeDetector.detectChanges();
        }); 

  }
}
