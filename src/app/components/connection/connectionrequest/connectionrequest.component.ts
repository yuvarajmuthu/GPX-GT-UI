import { Component, OnInit, ChangeDetectorRef, Input, isDevMode } from '@angular/core';

import {User} from '../../../models/user'; 
import {Connection} from '../../../models/connection';

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-connectionrequest',
  templateUrl: './connectionrequest.component.html',
  styleUrls: ['./connectionrequest.component.css']
})
export class ConnectionrequestComponent implements OnInit {
  @Input() connection: Connection;
  loggedUser:User;
  connectionRequest:Connection[];
  profileSmImage: any = 'assets/images/avatar1.png'; 
  isImageLoading:boolean = false;

  constructor(private userService:UserService, 
    private dataShareService:DatashareService,
    private alertService: AlertService, 
    private changeDetector : ChangeDetectorRef) { 
      console.log("constructor() connectionrequest.component");

    }

  //sourceEntityId is the entity that sent the connection request  
  ngOnInit() {
    console.log("ngOnInit() connectionrequest.component");

    this.loggedUser = this.dataShareService.getCurrentUser();
    //this.loadConnectionRequests();

    if(!isDevMode() && this.connection && this.connection.sourceEntityId){
      this.getProfileSmImage(this.connection.sourceEntityId);
    }  

  }

  //NOT USED
  loadConnectionRequests(){
    this.userService.getConnectionRequests(this.loggedUser.username)
    .subscribe((response) => {
      this.connectionRequest= response;
      console.log('ConnectionRequests response data ', this.connectionRequest);
      //this.changeDetector.detectChanges();
    });
  }

  acceptRequest(request:Connection){
    console.log("Accepted connection ", request);
    request.status = "FOLLOWING";
      this.userService.updateConnectionAction(request)
      .subscribe((response) => {
        //console.log('updated ConnectionRequests response data ', response);
        this.connection = response;
        this.alertService.success('Connected !!!', true);

      });
  }

  denyRequest(request:Connection){
    console.log("Accepted connection ", request);
    request.status = "DENIED";
      this.userService.updateConnectionAction(request)
      .subscribe((response) => {
        //console.log('updated ConnectionRequests response data ', response);
        this.connection = response;
        this.alertService.success('Updated !!!', true);

      });
  }

  getProfileSmImage(userId:string) {
    this.isImageLoading = true;
    this.userService.getImage(userId).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
    });
  } 
  
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.profileSmImage = reader.result;
    }, false);
  
    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
