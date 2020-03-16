import {
    Component,
    ViewContainerRef,
    ViewChild,
    ElementRef,
    Renderer,
    ChangeDetectorRef,
    ComponentRef,
    Input,
    OnInit,
    isDevMode
} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

import {Legislator} from '../../../models/legislator';
import {User} from '../../../models/user';

import {UsertemplateComponent} from '../usertemplate/usertemplate.component';

import {DatashareService} from '../../../services/datashare.service';
import {UserService} from '../../../services/user.service';
import {ProfileService} from '../../../services/profile.service';

import {LegislatorService} from '../../../services/legislator.service';
import {ComponentcommunicationService} from '../../../services/componentcommunication.service';
import {AlertService} from '../../../services/alert.service';
import {stringify} from 'querystring';


@Component({
    selector: 'app-user',
    templateUrl: './user3.component.html',
    styleUrls: ['./user2.component.css']
})
export class UserComponent implements OnInit {

    @Input() profileUserId: string = '';
    legisId: string = '';

    public isCollapsed: boolean = false;
    public isCMCollapsed: boolean = false;
    public isPartiesCollapsed: boolean = false;
    private isProfileEditMode: boolean = false;
    public electedPersonsOld = [];
    public electedPersons: Array<Legislator>;
    public contestedPersons = [];
    public parties = [];
    public connections = [];
    templateType = [];
    private componentRef: ComponentRef<{}>;
    private userData = {};
    private viewingUser = {};
    private firstName;
    private lastName;
    public profilesTemplates = [];
    public availableProfileTemplates = [];
    public profilesDatas = [];
    public isLegislator = false;
    operation: string = '';
    profileImage: string = '';
    profileSmImage: any = 'assets/images/avatar1.png';
    bannerImage: any;
    isImageLoading: boolean = false;
    isProfileCollapsed: boolean = false;
    isActivityCollapsed: boolean = true;
    isFollowersCollapsed: boolean = true;
    externalUser:boolean;
    biodata={};

    activities: number = 0;
    //private populationComponent: TemplatePopulationComponent;
    profileEditOption: string;

    following: boolean = false;
    requestedToFollow: boolean = false;
    followRequestRejected: boolean = false;

    currentUser: User = null;
    loggedUser: User = null;
    postFormData: FormData;
    editLabel: string = null;
    inEditMode:boolean = false;
    followersCount: string = null;
    followers: User[] = [];
    selectedProfileSmImage: File;
    profileSmImageChanged: boolean = false;
    paramUsername: string = '';
    profileTabSelected: boolean = true;
    activitiesTabSelected: boolean = false;
    isSelfProfile: boolean = false;
    activitiesData: boolean = false;
    tap: boolean = false;
    profileData: boolean = false;
    folow: boolean = false;
    folowers: boolean = false;
    navTabs: boolean = false;

    followCntrlLabel: string = '';
    followCntrlCSS: string = '';
    followStatusCSS: string = '';
    uploadForm: FormGroup;
    compTypeTabs = [];

    constructor(private  router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private profileService: ProfileService,
                private missionService: ComponentcommunicationService,
                //private elementRef:ElementRef,
                //private renderer: Renderer,
                private legislatorsService: LegislatorService,
                //private peopleService: PeopleService,
                //private partyService: PartyService,
                private datashareService: DatashareService,
                private formBuilder: FormBuilder) {
        this.currentUser = this.datashareService.getCurrentUser();

        missionService.userProfileEditChanged$.subscribe(
            editmode => {
                console.log('Received edit-save Profile message ' + editmode);
                this.inEditMode = editmode;
                if (!editmode) {
                    this.saveProfile();
                }

            });

    }

    //MAY BE OBSOLETE
    //get invoked automatically before ngOnInit()
    //routerOnActivate(curr: RouteSegment): void {
    routerOnActivate(): void {
        // if(curr.getParam("id")){
        //   if(curr.getParam("id") == "CREATE"){
        //     this.operation = curr.getParam("id");
        //   }else{
        //     this.profileUserId = curr.getParam("id");
        //     //this.dataShareService.setSelectedLegislatorId(this.profileUserId);
        //     console.log("from userProfile Param value - id " + this.profileUserId);
        //   }
        // }

        /*    if(curr.getParam("legisId")){
              this.legisId = curr.getParam("legisId");
              this.profileUserId = this.legisId;
              console.log("from userProfile Param value - legisId " + this.legisId);
            }  */
        console.log('from user.component routerOnActivate()');

    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.paramUsername = params['id'];
            console.log('from user.component route params changed ' + this.paramUsername);
            this.loadComponent(this.paramUsername);

            this.loggedUser = this.datashareService.getCurrentUser();


            if (this.loggedUser && this.paramUsername === this.loggedUser.username) {
                this.isSelfProfile = true;
            }

        });

        this.bannerImage = 'assets/images/user-banner1.jpg';

        this.uploadForm = this.formBuilder.group({
            file: ['']
        });
//////////Biodata
        if(this.paramUsername && this.paramUsername == 'external'){
            this.externalUser = true;  
          }
      
          //this.loadDisplayProperties();     
        
          this.loadBioData();

    }

    loadBioData(){
        let userType:string = this.externalUser?"external": "internal";
        this.userService.getBiodata(this.profileUserId, userType)
        .subscribe((response) => {
          //this.profileDataId = response['id'];
          this.biodata= response['data'];
          
          console.log('biodata response data ', this.biodata);
          
          //this.createFormGroup();
        });  
      }
  
    Activities() {
        this.activitiesData = true;
        this.profileData = false;
        this.folow = false;
        this.folowers = false;

        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = false;
    }

    Profiles() {
        this.activitiesData = false;
        this.profileData = true;
        this.folow = false;
        this.folowers = false;

        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = false;
        this.isActivityCollapsed = true;
    }

    FollowingCount() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = true;
        this.folowers = false;
    }

    Followers() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.folowers = true;
        this.getFollowers(this.profileUserId);
        this.isFollowersCollapsed = false;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;

    }

    loadComponent(id: string) {
        this.profileEditOption = this.getPermission();
        this.loggedUser = this.datashareService.getCurrentUser();
        //this.editProfile();
        //let id = this.route.snapshot.paramMap.get('id');
        this.editLabel = 'Edit Profile';

        if (id) {
            if (id == 'CREATE') {
                this.operation = id;
            } else {
                this.profileUserId = id;
                //this.dataShareService.setSelectedLegislatorId(this.profileUserId);
                console.log('from userProfile Param value - id ' + this.profileUserId);
            }
        }

//    console.log("User type: ", this.userData['userType']);
        if (this.operation == 'CREATE') {
//      this.loadProfileTemplate();      
            this.datashareService.setPermission('Editor');

            this.loadProfileTemplates(this.operation);


        } else {
            if (this.profileUserId == 'external') {
                //TODO
                //determine congress or state legislator
                //get bioguide id
                this.isLegislator = true; // may not be required
                this.viewingUser['isLegislator'] = true;
                //*** LEGISLATOR SELECTED FROM SEARCH SCREEN IS SET AS VIEWINGUSER - IN LEGISLATOR.COMPONENT ***/
                this.viewingUser['externalData'] = this.datashareService.getViewingUser();


                if (!this.viewingUser['externalData']['leg_id']) { //CONGRESS
                    this.viewingUser['isCongress'] = true;
                    let photoUrl = this.viewingUser['externalData']['photo_url'];
                    let fileName = photoUrl.substring(photoUrl.lastIndexOf('/') + 1);
                    let bioguideId = fileName.substring(0, fileName.lastIndexOf('.'));
                    console.log('bioguideId ', bioguideId);
                    this.viewingUser['bioguideId'] = bioguideId;
                    this.profileUserId = bioguideId;


                } else {//OPENSTATE
                    this.viewingUser['isCongress'] = false;
                    this.profileUserId = this.viewingUser['externalData']['id'];
                }
                this.viewingUser['external'] = true;
                //this.viewingUser['userId'] = this.profileUserId;
            } else {
                this.isLegislator = false; // may not be required
                this.viewingUser['external'] = false;
                this.viewingUser['isLegislator'] = false;
            }
            this.viewingUser['userId'] = this.profileUserId;
            //console.log("User isLegislator: ", this.viewingUser['isLegislator']);


            //the user that is being viewed
            //this.dataShareService.setViewingUserId(this.profileUserId);

            if (this.loggedUser && this.loggedUser.username) {
                this.getRelationStatus(this.loggedUser.username, this.profileUserId);
            } else {
                this.followCntrlLabel = 'Join to Follow';
                this.followCntrlCSS = 'btn btn-primary';
                this.followStatusCSS = 'fa fa-plus-circle';
            }

            this.getFollowersCount(this.profileUserId);
            this.getFollowers(this.profileUserId);


            this.userService.getUserData(this.viewingUser['userId'], this.viewingUser['external']).subscribe(
                data => { 
                    this.userData = data;
                    console.log('User data from service: ', this.userData);

                    //this may not be required as getRelationStatus() can be used
                    //this.viewingUser['connections'] = this.userData['connections'];


                    //this.viewingUser['followers'] = this.userData['followers'];

                    if (this.viewingUser['external']) { // and not persisted
                        if (isDevMode()) {
                            this.profileSmImage = 'assets/images/avatar1.png';//"assets/images/temp/user-avatar.jpg";
                        } else {
                            this.profileSmImage = this.userData['photo_url'];
                        }
                    } else {
                        this.getProfileSmImage(this.viewingUser['userId']);
                    }

                    //getting the available profile templates for this user type - publicUser
                    //this.profilesTemplates = this.viewingUser['profileTemplates'] = data['profile'];
                    // console.log("profile templates: ", this.profilesTemplates);

                    //getting the data for this user profile
                    //this.profilesData = this.viewingUser['profilesData'] = this.userData['profileData'];
                    this.profilesTemplates = this.userData['profileTemplates'];
                    this.viewingUser['profileTemplates'] = this.profilesTemplates;

                    let userType: string = this.viewingUser['isLegislator'] ? 'legislator' : 'public';
                    this.profileService.getAvailableProfileTemplates(userType).subscribe(
                        data => {
                            this.availableProfileTemplates = data;
                        });

                    this.profilesDatas = this.userData['profileDatas'];
                    console.log('profile data: ', this.userData);

                    //identifying the profile selected for this user profile, so those components shall be loaded
                    let compTypes = [];
                    for (let profileData of this.profilesDatas) {
                        console.log('loading template component: ', profileData['profileTemplateId']);
                        //this.templateType.push(profileData['profile_template_id']);
                        if (compTypes.indexOf(profileData['profileTemplateId']) < 0) {
                            compTypes.push(profileData['profileTemplateId']);

                            //not required if profiletemplates is retrieved from user
                            //this.profilesTemplates.push(profileData);
                        }

                        if (profileData['profileTemplateId'] === 'upCongressLegislatorExternal' ||
                            profileData['profileTemplateId'] === 'upDefault') {
                            //let profileItemData = profileData['data'][0];
                            let profileItemData = profileData['data'];
                            this.firstName = profileItemData['first_name'];
                            this.lastName = profileItemData['last_name'];

                        }
                    }

                    if (compTypes.length > 0) {
                        this.templateType = compTypes;
                    }

                    //setting here so it can be accessed globally
                    this.datashareService.setViewingUser(this.viewingUser);
                    console.log('this.dataShareService.getViewingUser() ' + JSON.stringify(this.datashareService.getViewingUser()));
                }
            );
        }

    }

    showProfile() {
        this.isProfileCollapsed = false;
        this.isActivityCollapsed = true;
        this.profileTabSelected = true;
        this.activitiesTabSelected = false;
        return false;
    }

    showActivities() {
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = false;
        this.profileTabSelected = false;
        this.activitiesTabSelected = true;
        return false;
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


    editProfile() {
        //loggedin? and edited?, then set edit as true
        //loggedin? and not edited?, then set edit as false

        let edit: boolean = false;
        if (this.editLabel === 'Edit Profile') {//Enabling to update the profile
            edit = true;
        } else {//Saving profile
            edit = false;
        }

        this.datashareService.editProfile(edit);

        if (edit) {
            this.editLabel = 'Save';
        } else {
            this.editLabel = 'Edit Profile';
        }
        this.missionService.userProfileChanged(edit);

    }

    cancelEditProfile() {

        this.editLabel = 'Edit Profile';

        this.datashareService.editProfile(false);
        this.missionService.userProfileChanged(false);


    }

    //MAY NOT BE REQUIRED
    isProfileEditable() {
        return this.datashareService.isProfileEditable() && this.loggedUser;//and     //logged in?
    }

    isUserLogged() {
        return (this.loggedUser != null && this.loggedUser['token'] != null); // and token expired ?
    }

    onProfileSmImageSelected(event) {
        console.log('file object ', event);
        let reader = new FileReader();
//      let formData = new FormData();  


        if (event.target.files && event.target.files[0]) {
            this.selectedProfileSmImage = event.target.files[0];
            this.uploadForm.get('file').setValue(this.selectedProfileSmImage);

            reader.readAsDataURL(this.selectedProfileSmImage);
            reader.onload = (event) => {
                this.profileSmImage = event.target['result'];
            };
            this.profileSmImageChanged = true;
        }
    }

    loadProfileTemplates(operation: string) {
        this.userService.getUserData(operation, false).subscribe(
            data => {
                this.userData = data;
                console.log('loadTemplate()::userprofile.template - User data from service: ', this.userData);


                //getting the available profile templates for this user type
                this.profilesTemplates = this.viewingUser['profileTemplates'] = this.userData['profile'];
                console.log('loadTemplate()::userprofile.template - profile templates: ', this.profilesTemplates);

                //indicate the dynamic loaded to load th default template
                let compTypes = [];
                compTypes.push('upCongressLegislatorDefault');

                if (compTypes.length > 0) {
                    this.templateType = compTypes;
                }

                this.viewingUser['operation'] = this.operation;
                //setting here so it can be accessed globally
                this.datashareService.setViewingUser(this.viewingUser);


            }
        );
    }

    saveProfile() {
        console.log('Saving user.component Profile');
        //if image got change, submit that image
        if (this.profileSmImageChanged) {
            const uploadFormData = new FormData();
            let userData: any = {};
            userData['username'] = this.viewingUser['userId'];
            //WORKAROUND
            //PROFILETEMPLATE SHOULD HAVE ONLY profileTemplateId AND NOT profile_template_id
            if (this.viewingUser['profileTemplates'] && this.viewingUser['profileTemplates'][0]) {
                let profileTemplate: any = {};
                profileTemplate['profileTemplateId'] = this.viewingUser['profileTemplates'][0]['profile_template_id'];
                this.viewingUser['profileTemplates'][0] = profileTemplate;
                userData['profileTemplates'] = this.viewingUser['profileTemplates'];

            }
            //uploadFormData.append("file", this.selectedProfileSmImage, this.selectedProfileSmImage.name);
            uploadFormData.append('file', this.uploadForm.get('file').value);
            uploadFormData.append('post', JSON.stringify(userData));

            this.userService.updateUserSmProfileImage(uploadFormData)
                .subscribe(data => {
                    console.log('User profile image got uploaded successfully, ', this.viewingUser);
                });
        }
    }

    getData(): string {
        let data = {};
        data['firstName'] = this.firstName;
        data['lastName'] = this.lastName;


        let dataString: string = JSON.stringify(data);
        console.log('TemplateIntroductionComponent data ' + dataString);
        return dataString;
    }

    followEntity() {
        if (this.loggedUser == null || !this.loggedUser.username) {
            //let routePath:string = "/secure";
            let routePath: string = '/login';
//      this.router.navigate([routePath]);
            let returnUrl: string = '/user/' + this.profileUserId + '?follow';
            this.router.navigate(['login'], {queryParams: {returnUrl: returnUrl}});

            //this.router.navigate([routePath, {followEntityId:this.profileUserId, isLegislator:this.viewingUser['isLegislator']}]);

        }

        var followURequest = {};
        var sourceEntity = {};
        var targetEntity = {};

        /*MAY NOT BE REQUIRED - BEGIN */
        followURequest['userId'] = this.loggedUser ? this.loggedUser.username : '';// this.datashareService.getCurrentUserId();
        followURequest['connectionUserId'] = this.profileUserId;
        /*MAY NOT BE REQUIRED - END */

        followURequest['sourceEntityId'] = this.loggedUser ? this.loggedUser.username : '';//this.datashareService.getCurrentUserId();
        //followURequest["sourceEntityType"] = "USER";
        followURequest['targetEntityId'] = this.profileUserId;

        if (this.viewingUser['isLegislator']) {
            /*
            if(this.viewingUser['isCongress']){

            }else{
            }
            */
            followURequest['targetEntityType'] = 'LEGISLATOR';

        } else {
            followURequest['targetEntityType'] = 'PUBLICUSER';
        }
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
    }

    setFollowCntrlLabel() {

        if (this.requestedToFollow) {
            this.followCntrlLabel = 'Request Sent';
        } else if (this.following) {
            this.followCntrlLabel = 'Following';
        } else if (this.followRequestRejected) {
            this.followCntrlLabel = 'Request Rejected';
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

    test() {
        console.log('Cancel Follow');
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
                    }
                    this.setFollowCntrlLabel();
                    this.setFollowCntrlCSS();
                    this.setFollowStatusCSS();

                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getFollowersCount(profileId: string) {
        this.userService.getFollowersCount(profileId)
            .subscribe(
                (result) => {
                    console.log('getFollowersCount response ' + result);
                    this.followersCount = result;

                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getFollowers(profileId: string) {
        this.userService.getFollowers(profileId)
            .subscribe(
                (result) => {
                    console.log('getFollowers response ' + result);
                    this.viewingUser['followers'] = this.followers = result;
                    console.log('getFollowers response ' + this.followers);
                    if (this.followers) {
                        this.followers.forEach(follower => {
                            //get the profilesmimage
                            //this.getProfileSmImage(follower.username);
                        });
                    }
                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    //NOT USED
    getRelation(entity: string, profileId: string) {
        this.requestedToFollow = false;
        this.following = false;
        this.followRequestRejected = false;
        var isProfileRelated = false;

        console.log('this.viewingUser[\'connections\'].length ', this.viewingUser['connections'].length);

        this.viewingUser['connections'].forEach(connection => {
            if ((entity === 'user' && connection['users']) ||
                (entity === 'group' && connection['groups']) ||
                (entity === 'position' && connection['positions'])) {

                let connectedEntities = null;
                if ((entity === 'user' && connection['users'])) {
                    connectedEntities = connection['users'];
                } else if ((entity === 'group' && connection['groups'])) {
                    connectedEntities = connection['groups'];
                } else if ((entity === 'position' && connection['positions'])) {
                    connectedEntities = connection['positions'];
                }

                connectedEntities.forEach(connectedEntity => {
                    if (connectedEntity['entityId'] === profileId) {
                        isProfileRelated = true;

                        if (connectedEntity['connectionStatus'] == 'REQUESTED') {
                            this.requestedToFollow = true;
                        } else if (connectedEntity['connectionStatus'] == 'FOLLOWING') {
                            this.following = true;
                        } else if (connectedEntity['connectionStatus'] == 'REJECTED') {
                            this.followRequestRejected = true;
                        }

                    }

                    if (isProfileRelated) {
                        //exit the for loop
                    }
                });
                //exit the for loop
            }
        });
    }

    getPermission(): string {
        //console.log("calling getter");
        let data = this.datashareService.getPermission();
        //console.log("getPermission() " + data);
        return data;
    }

    setPermission(data: string) {
        //console.log("calling setter");
        this.datashareService.setPermission(data);
        this.profileEditOption = data;
    }

    isEditable() {
        //should be logged in
        //additional Role ?
    }

    allowed(): boolean {
        let permission: boolean = this.datashareService.checkPermissions();
        //console.log("allowed() - " + permission);

        return permission;
    }

//load the template based on tab selection
    loadTemplate(type: string) {
        this.tap = true;
        let compTypes = [];
        compTypes.push(type);
        this.templateType = compTypes;
        /*this.navTabs = true;*/
        console.log(this.templateType);
    }

//add the template based on user selection
    addTemplate(profileTemplateParam: any) {
        /*
            let profileTemplate = {
              "profileTemplateId":profileTemplateId,
              "name":"Biodata"
            };
          */
        let position: number = -1;
        this.availableProfileTemplates.forEach((profileTemplate, index) => {
            if (profileTemplateParam['profileTemplateId'] === profileTemplate['profileTemplateId']) {
                position = index;
            }
        });

        if (position > -1) {
            this.availableProfileTemplates.splice(position, 1);
        }

        this.profilesTemplates.push(profileTemplateParam);
    }
}
