import {Component, OnInit, Input, isDevMode} from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../../../services/user.service';
import {DatashareService} from '../../../services/datashare.service';


import {User} from '../../../models/user';

@Component({
    selector: 'app-usercard1',
    templateUrl: './usercard1.component.html',
    styleUrls: ['./usercard1.component.css']
})
export class Usercard1Component implements OnInit {
    @Input() user: User;
    @Input() username: string;
    profileSmImage: any;
    isImageLoading: boolean = false;
    loggedUser: User = null;

    following: boolean = false;
    requestedToFollow: boolean = false;
    followRequestRejected: boolean = false;
    awaitingRequest: boolean = false;

    followCntrlLabel: string = '';
    followCntrlCSS: string = '';
    followStatusCSS: string = '';


    constructor(private  router: Router,
                private userService: UserService, private datashareService: DatashareService) {
    }

    ngOnInit() {
        if (this.username) {
            if (isDevMode()) {
                /*this.profileSmImage = "assets/images/avatar-male.png";*/
                this.profileSmImage = 'assets/images/avatar1.png';//"assets/images/temp/user-avatar.jpg";
            } else {
                this.getProfileSmImage(this.username);
            }
            //this.profileSmImage = 'assets/images/avatar1.png';//"assets/images/temp/user-avatar.jpg";

        }

        this.loggedUser = this.datashareService.getCurrentUser();

        if (this.loggedUser && this.loggedUser.username) {
            this.getRelationStatus(this.loggedUser.username, this.username);
        } else {
            this.followCntrlLabel = 'Join to Follow';
            this.followCntrlCSS = 'btn btn-primary';
            this.followStatusCSS = 'fa fa-plus-circle';
        }

    }

    getProfileSmImage(userId: string) {
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
        reader.addEventListener('load', () => {
            this.profileSmImage = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    loadUser() {
        let url = '/user/' + this.username;
        this.router.navigate([url]);
        return false;
    }

    getRelationStatus(entity: string, profileId: string) {

        this.userService.getRelationStatus(entity, profileId)
            .subscribe(
                (result) => {
                    console.log('getRelationStatus response ' + result);

                    if (result == 'REQUESTED') {
                        this.requestedToFollow = true;
                    } else if (result == 'FOLLOWING') {
                        this.following = true;
                    } else if (result == 'REJECTED') {
                        this.followRequestRejected = true;
                    } else if (result == 'AWAITING') {
                        this.awaitingRequest = true;
                    }
                    this.setFollowCntrlLabel();
                    this.setFollowCntrlCSS();
                    this.setFollowStatusCSS();

                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    followEntity() {

        var followURequest = {};
        var sourceEntity = {};
        var targetEntity = {};


        followURequest['sourceEntityId'] = this.loggedUser ? this.loggedUser.username : '';//this.datashareService.getCurrentUserId();
        followURequest['targetEntityId'] = this.username;
        followURequest['status'] = 'REQUESTED';
        console.log('Profile data ' + JSON.stringify(followURequest));

        this.userService.followPerson(JSON.stringify(followURequest))
            .subscribe(
                (result) => {
                    console.log('followDistrict response ' + result);

                    if (result.status == 'REQUESTED') {
                        this.requestedToFollow = true;
                    } else if (result.status == 'FOLLOWING') {
                        this.following = true;
                    } else if (result.status == 'REJECTED') {
                        this.followRequestRejected = true;
                    }
                    this.setFollowCntrlLabel();
                    this.setFollowCntrlCSS();
                    this.setFollowStatusCSS();
                },
                (err) => {
                    console.log('Error ', err);
                });
        return false;
    }

    setFollowCntrlLabel() {

        if (this.requestedToFollow) {
            this.followCntrlLabel = 'Request Sent';
        } else if (this.following) {
            this.followCntrlLabel = 'Following';
        } else if (this.followRequestRejected) {
            this.followCntrlLabel = 'Request Rejected';
        } else if (this.awaitingRequest) {
            this.followCntrlLabel = 'Accept/Reject';
        } else {
            this.followCntrlLabel = 'Follow';
        }


    }

    setFollowStatusCSS() {

        if (this.requestedToFollow) {
            this.followStatusCSS = 'fa fa-exclamation-circle';
        } else if (this.following) {
            this.followStatusCSS = 'fa fa-check-circle';
        } else if (this.followRequestRejected) {
            this.followStatusCSS = 'fa fa-thumbs-down';
        } else {
            this.followStatusCSS = 'fa fa-plus-circle';
        }


    }

    setFollowCntrlCSS() {

        if (this.requestedToFollow) {
            this.followCntrlCSS = 'btn btn-outline-warning glyphicon glyphicon-ok';
        } else if (this.following) {
            this.followCntrlCSS = 'btn btn-outline-success glyphicon glyphicon-ok';
        } else if (this.followRequestRejected) {
            this.followCntrlCSS = 'btn btn-outline-danger glyphicon glyphicon-ok';
        } else {
            this.followCntrlCSS = 'btn btn-outline-primary';
        }

    }

}
