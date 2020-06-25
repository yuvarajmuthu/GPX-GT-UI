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
import {PostService} from '../../../services/post.service';

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
    activeTemplate: string="upOffices";

    public isCollapsed: boolean = false;
    public isCMCollapsed: boolean = false;
    public isPartiesCollapsed: boolean = false;
    //private isProfileEditMode: boolean = false;
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
    isFollowingsCollapsed: boolean = true;
    isManagedByCollapsed:boolean = true;
    externalUser:boolean;
    biodata:any=null;
    biodataTemplate={};

    entityType:string=null;
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
    managedBy: User[] = [];
    followingsCount: string = null;
    followings: User[] = [];
    selectedProfileSmImage: File;
    profileSmImageChanged: boolean = false;
    paramUsername: string = '';
    profileTabSelected: boolean = true;
    activitiesTabSelected: boolean = false;
    isSelfProfile: boolean = false;
    activitiesData: boolean = false;
    tap: boolean = false;
    profileData: boolean = true;
    folow: boolean = false;
    followersActiveCss: boolean = false;
    followingsActiveCss: boolean = false;
    managedByActive:boolean = false;

    navTabs: boolean = false;

    followCntrlLabel: string = '';
    followCntrlCSS: string = '';
    followStatusCSS: string = '';
    uploadForm: FormGroup;
    compTypeTabs = [];

    isEditDisplayname:boolean = false;

    changeParty: boolean = false;
    isEditParty:boolean = false;
    searchUsers: any = [];
    keywordParty = 'firstName';
    editPartyInput : any;

    changeDistrict: boolean = false;
    isEditDistrict:boolean = false;
    keywordDistrict = 'firstName';
    editDistrictInput : any;

    changeChamber: boolean = false;
    isEditChamber:boolean = false;
    keywordChamber = 'firstName';
    editChamberInput : any;

    changeState: boolean = false;
    isEditState:boolean = false;
    keywordState = 'firstName';
    editStateInput : any;

    constructor(private  router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private postService: PostService,
                private profileService: ProfileService,
                private communicationService: ComponentcommunicationService,
                private legislatorsService: LegislatorService,
                private datashareService: DatashareService,
                private formBuilder: FormBuilder) {
        this.currentUser = this.datashareService.getCurrentUser();

        communicationService.userProfileEditChanged$.subscribe(
            editmode => {
                console.log('Received edit-save Profile message ' + editmode);
                this.inEditMode = editmode;
            });
        


    }

    toggleEditDisplayname(){
        this.isEditDisplayname = !this.isEditDisplayname;
    }

    toggleEditParty(){
        /*
        this.changeParty=false*/
        if(!this.isEditParty && this.biodata){
            this.editPartyInput = this.biodata.party;
        }
        else{
            if(typeof(this.editPartyInput) == 'object')
              this.biodata.party = this.editPartyInput.firstName;
        }
        
        this.isEditParty = !this.isEditParty;
    }

    toggleEditDistrict(){
        /*
        this.changeDistrict=false;*/
        if(!this.isEditDistrict && this.biodata){
            this.editDistrictInput = this.biodata.district;
        }
        else{
            if(typeof(this.editDistrictInput) == 'object')
              this.biodata.district = this.editDistrictInput.firstName;
        }
        
        this.isEditDistrict = !this.isEditDistrict;
    }

    toggleEditChamber(){
        /*
        this.changeChamber = false;*/
        if(!this.isEditChamber && this.biodata){
            this.editChamberInput = this.biodata.chamber;
        }
        else{
            if(typeof(this.editChamberInput) == 'object')
               this.biodata.chamber = this.editChamberInput.firstName;
        }
        
        this.isEditChamber = !this.isEditChamber;
    }

    toggleEditState(){
        /*
        this.changeState = false;*/
        if(!this.isEditState && this.biodata){
            this.editStateInput = this.biodata.state;
        }
        else{
            if(typeof(this.editStateInput) == 'object')
               this.biodata.state = this.editStateInput.firstName;
            else
                this.biodata.state = this.editStateInput;
        }
        this.isEditState = !this.isEditState;
    }
    
    mouseEnter(property:string){
        this.changeParty = true;
    }

    mouseOut(property:string){
        this.changeParty = false;
    }

    onChangeSearch(e){
        this.postService.getTagUsers(e)
        .subscribe((data:any) => {
            this.searchUsers = data;
        });
    }

    ngOnInit() {

        this.route.params.subscribe((params: Params) => {
            //this.datashareService.editProfile(false);
            this.communicationService.userProfileChanged(false);

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
        //if(this.paramUsername && this.paramUsername == 'external'){
        //    this.externalUser = true;  
         // }
      
          //this.loadDisplayProperties();     
        
          this.loadBioData();

    }

    loadBioData(){
        this.userService.getBiodata(this.profileUserId)
        .subscribe((response) => {
          this.entityType = response['entityType']; 
          this.biodata= response['data'];
          
          console.log('biodata response data ', this.biodata);
          
          //this.createFormGroup();
        });  
      }

      loadBioDataTemplate(type:string){
        this.profileService.getProfileTemplateByType('upDefault', type)
        .subscribe((response) => {
            this.biodataTemplate = response;

        });  
      }

      getPropertyDataType(propertyName:string){
        let type:string=null;  
        let properties:[] = this.biodataTemplate['properties'];
        for (let property of properties) {
            if(property['propId'] === propertyName){
                type = property['type'];
                break;
            }
        }

        return type;
      }

    Activities() {
        this.activitiesData = true;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = false;
        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = false;
    }

    Profiles() {
        this.activitiesData = false;
        this.profileData = true;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = false;
        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = false;
        this.isActivityCollapsed = true;
    }

    //OBSOLETE
    /*
    FollowingCount() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = true;
        this.followersActiveCss = false;
    }
    */

    Followers() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = true;
        this.followingsActiveCss = false;
        this.managedByActive = false;
        this.getFollowers(this.profileUserId);
        this.isFollowersCollapsed = false;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;

    }

    Followings() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = true;
        this.managedByActive = false;
        this.getFollowings(this.profileUserId);
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = false;
        this.isManagedByCollapsed = true;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;

    }

    managedByUsers() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = true;
        this.getManagedBy(this.profileUserId);
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = false;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;

    }

    loadComponent(id: string) {
        //this.profileEditOption = this.getPermission();
        this.loggedUser = this.datashareService.getCurrentUser();
        //this.editProfile();
        //let id = this.route.snapshot.paramMap.get('id');
        //this.editLabel = 'Edit Profile';

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
            
            //if (this.profileUserId == 'external') {
                
               //this.viewingUser['externalData'] = this.datashareService.getViewingUser();

/*
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
                */
               // this.viewingUser['external'] = true;
           // } else {
            //    this.isLegislator = false; // may not be required
             //   this.viewingUser['external'] = false;
              //  this.viewingUser['isLegislator'] = false;
            //}
            
            this.viewingUser['userId'] = this.profileUserId;
            //console.log("User isLegislator: ", this.viewingUser['isLegislator']);


            //the user that is being viewed
            //this.dataShareService.setViewingUserId(this.profileUserId);

            if (!isDevMode() && this.loggedUser && this.loggedUser.username) {
                this.getRelationStatus(this.loggedUser.username, this.profileUserId);
            } else {
                this.followCntrlLabel = 'Join to Follow';
                this.followCntrlCSS = 'btn btn-primary followers-button';
                this.followStatusCSS = 'fa fa-plus-circle';
            }

            this.getFollowersCount(this.profileUserId);
            this.getFollowingsCount(this.profileUserId);
            //this.getFollowers(this.profileUserId);

            this.userService.getUserData(this.viewingUser['userId']).subscribe(
                data => { 
                    this.userData = data;
                    console.log('User data from service: ', this.userData);

                    if (this.userData['userType'] === 'LEGISLATOR') {
                        this.viewingUser['external'] = true;
                        this.viewingUser['isLegislator'] = true;
                        if (this.userData['sourceSystem'] === 'OPENSTATE') {
                            this.viewingUser['isCongress'] = false;
                            this.externalUser = true;  

                        }else if (this.userData['sourceSystem'] === 'GOVTRACK') {
                            this.viewingUser['isCongress'] = true;
                            this.externalUser = true;  

                        }

                        if (isDevMode()) {
                            this.profileSmImage = 'assets/images/avatar1.png';//"assets/images/temp/user-avatar.jpg";
                        } else {
                            this.profileSmImage = this.userData['photoUrl'];
                        }
                        this.profileSmImage = 'assets/images/avatar1.png';//"assets/images/temp/user-avatar.jpg";

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
                    this.profileService.getAvailableProfileTemplatesForEntity(this.viewingUser['userId'], userType).subscribe(
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

                        //if (profileData['profileTemplateId'] === 'upCongressLegislatorExternal' ||
                        //    profileData['profileTemplateId'] === 'upDefault') {
                            //let profileItemData = profileData['data'][0];
                            //let profileItemData = profileData['data'];
                            //this.firstName = profileItemData['first_name'];
                            //this.lastName = profileItemData['last_name'];

                        //}
                    }

                    if (compTypes.length > 0) {
                        this.templateType = compTypes;
                    }

                    this.loadBioDataTemplate(this.userData['userType']);
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
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;

        this.profileTabSelected = true;
        this.activitiesTabSelected = false;
        return false;
    }

    showActivities() {
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = false;
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;

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

        //let edit: boolean = true;
/*
        if (this.editLabel) {//Enabling to update the profile
            edit = true;
        } else {//Saving profile
            edit = false;
        }
*/
  //      this.datashareService.editProfile(edit);
        this.communicationService.userProfileChanged(true);

/*
        if (edit) {
            this.editLabel = 'Save';
        } else {
            this.editLabel = 'Edit Profile';
        }
        */
        //this.communicationService.userProfileChanged(edit);

    }

    cancelEditProfile() {

 //       this.editLabel = 'Edit Profile';

   //     this.datashareService.editProfile(false);
        this.communicationService.userProfileChanged(false);


    }

    isProfileEditable() {
        //return (this.datashareService.isProfileEditable() && (this.isSelfProfile || this.userData['status'] === 'PASSIVE'));
        return (!this.isProfileInEditMode() && (this.isSelfProfile || this.userData['status'] === 'PASSIVE'));
        //TODO
        //if not logged in, clicking edit button should redirect to login        
    }

    isProfileInEditMode(){
        return this.inEditMode;
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
        this.userService.getUserData(operation).subscribe(
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
                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getManagedBy(profileId: string) {
        this.userService.getManagedBy(profileId)
            .subscribe(
                (result) => {
                    this.viewingUser['managedBy'] = this.managedBy = result;
                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getFollowingsCount(profileId: string) {
        this.userService.getFollowingsCount(profileId)
            .subscribe(
                (result) => {
                    console.log('getFollowingsCount response ' + result);
                    this.followingsCount = result;

                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getFollowings(profileId: string) {
        this.userService.getFollowings(profileId)
            .subscribe(
                (result) => {
                    console.log('getFollowings response ' + result);
                    this.viewingUser['followings'] = this.followings = result;
                    console.log('getFollowings response ' + this.followings);

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

    allowed(): boolean {
        let permission: boolean = this.datashareService.checkPermissions();
        //console.log("allowed() - " + permission);

        return permission;
    }

//load the template based on tab selection
    loadTemplate(type: string) {
        this.activeTemplate = type;
        this.tap = true;
        let compTypes = [];
        compTypes.push(type);
        this.templateType = compTypes;
        /*this.navTabs = true;*/
        console.log(this.templateType);
    }

//add the Profile based on user selection
    addProfileData(profileTemplateParam: any) {
        /*
            let profileTemplate = {
              "profileTemplateId":profileTemplateId,
              "name":"Biodata"
            };
          */
        let position: number = -1;
        this.availableProfileTemplates.forEach((profileTemplate, index) => {
            if (profileTemplate['profileTemplateId'] === profileTemplateParam['profileTemplateId']) {
                position = index;
            }
        });

        if (position > -1) {
            this.availableProfileTemplates.splice(position, 1);
        }

        this.profilesTemplates.push(profileTemplateParam);

        this.templateType.push(profileTemplateParam['profileTemplateId']);
        

    }

    deleteProfileData(profileTemplateParam:any){
        let position: number = -1;
        this.templateType.forEach((profileTemplate, index) => {
            if (profileTemplate['profileTemplateId'] === profileTemplateParam['profileTemplateId']) {
                position = index;
            }
        });

        if (position > -1) {
            this.templateType.splice(position, 1);
        }

        position = -1;
        this.profilesTemplates.forEach((profileTemplate, index) => {
            if (profileTemplate['profileTemplateId'] === profileTemplateParam['profileTemplateId']) {
                position = index;
            }
        });

        if (position > -1) {
            this.profilesTemplates.splice(position, 1);
        }

        //this.profilesTemplates.push(profileTemplate);

        this.availableProfileTemplates.push(profileTemplateParam);
    }
}
