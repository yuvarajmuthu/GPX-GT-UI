import { Component, OnInit, ChangeDetectorRef, Input, isDevMode } from '@angular/core';
import {Router} from '@angular/router';

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
  @Input() username: string;
  @Input() relationStatus: string;

  loggedUsername: string = null;
  public user:any;

  profileSmImage: any = 'assets/images/avatar1.png'; 
  isImageLoading:boolean = false;
  followersCount: string = null;

  constructor(private  router: Router,
    private userService:UserService, 
    private datashareService:DatashareService,
    private alertService: AlertService, 
    private changeDetector : ChangeDetectorRef) { 
      console.log("constructor() connectionrequest.component");

    }

  ngOnInit() {
    this.loggedUsername = this.datashareService.getLoggedinUsername();
    
    this.userService.getUserData(this.username, this.loggedUsername).subscribe(
      data => {
        this.user = data;

       }
      );

      this.getFollowersCount(this.username);

    if(!isDevMode()){
      //this.getProfileSmImage(this.username);
    }  

  }

  getFollowersCount(username: string) {
    this.userService.getFollowersCount(username)
        .subscribe(
            (result) => {
                console.log('getFollowersCount response ' + result);
                this.followersCount = result;

            },
            (err) => {
                console.log('Error ', err);
            }); 
  }

  acceptRequest(){
    let request = new Connection();
    console.log("Accepted connection ", request);
    request.sourceEntityId = this.username;
    request.targetEntityId = this.loggedUsername;

    request.status = "FOLLOWING";
      this.userService.updateConnectionAction(request)
      .subscribe((response) => {
        this.relationStatus = "FOLLOWING";
        //console.log('updated ConnectionRequests response data ', response);
        this.alertService.success('Connected !!!', true);

      });
  }

  denyRequest(){
    let request = new Connection();
    console.log("Accepted connection ", request);
    request.sourceEntityId = this.username;
    request.targetEntityId = this.loggedUsername;
    request.status = "REJECTED";
      this.userService.updateConnectionAction(request)
      .subscribe((response) => {
        this.relationStatus = "REJECTED";
        //console.log('updated ConnectionRequests response data ', response);
        this.alertService.success('Updated !!!', true);

      });
  }

  cancelRequest(){
    let request = new Connection();
    console.log("Cancel connection request ", request);
    request.sourceEntityId = this.loggedUsername;
    request.targetEntityId = this.username;
    request.status = "CANCELLED";
      this.userService.updateConnectionAction(request)
      .subscribe((response) => {
        this.relationStatus = "CANCELLED";

        //console.log('updated ConnectionRequests response data ', response);
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

  gotoUser(): void {

    this.router.navigate(['/user', this.username]);

  }

}
