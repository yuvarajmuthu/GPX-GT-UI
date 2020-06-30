import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {AbstractTemplateComponent} from '../../abstractTemplateComponent';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

import {DatashareService} from '../../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../../services/componentcommunication.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-userbilltemplate',
  templateUrl: './userbilltemplate.component.html',
  styleUrls: ['./userbilltemplate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserbilltemplateComponent extends AbstractTemplateComponent implements OnInit {

  id = 'upBill';
  profileIcon = 'group';
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

      console.log('constructor() userbilltemplate.component');
      this.viewingUser = this.dataShareService2.getViewingUser();

      communicationService.userProfileEditChanged$.subscribe(
          editmode => {
              console.log('Received edit-save Profile message ' + editmode);
              this.inEditMode = editmode;
              this.changeDetector.detectChanges();

          });

  }

  ngOnInit() {
  }

}
