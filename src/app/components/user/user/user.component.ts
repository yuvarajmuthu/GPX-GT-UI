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
    HostListener,
    isDevMode
} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

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
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    @Input() profileUserId: string = '';
    legisId: string = '';
    activeTemplate: string="upOffices";
    activeTemplatName:string = "Office";
    showDropDown : boolean = false;
    isInCircle: boolean;
    twitterHandle:string = null;
    twitterHandleExist:boolean = false;
    facebookHandle:string = '';

    public isCollapsed: boolean = false;
    public isCMCollapsed: boolean = false;
    public isPartiesCollapsed: boolean = false;
    public isProfilePrivate: boolean = false;
    public electedPersonsOld = [];
    public electedPersons: Array<Legislator>;
    public contestedPersons = [];
    public parties = [];
    public connections = [];
    templateType = [];
    private componentRef: ComponentRef<{}>;
    public userData:User = new User();
    private viewingUser = {};
    private firstName;
    private lastName;
    public profilesTemplates = [];
    public availableProfileTemplates = [];
    public profilesDatas = [];
    public isLegislator = false;
    operation: string = '';
    profileImage: string = '';
    profileSmImage: any; 
    bannerImage: any;
    isImageLoading: boolean = false;
    isProfileCollapsed: boolean = false;
    isActivityCollapsed: boolean = true;
    isTwitterActivityCollapsed: boolean = true;
    isFollowersCollapsed: boolean = true;
    isFollowingsCollapsed: boolean = true;
    isManagedByCollapsed:boolean = true;
    isSettingsCollapsed:boolean = true;
    externalUser:boolean;
    biodata:any=null;
    biodataTemplate={};
    contactsData = {};
    //displayName:string='';

    entityType:string=null;
    category:string=null;
    activities: number = 0;
    //private populationComponent: TemplatePopulationComponent;
    profileEditOption: string;

    following: boolean = false;
    requestedToFollow: boolean = false;
    requestAwaiting: boolean = false;
    followRequestRejected: boolean = false;

    currentUser: User = null;
    loggedUser: User = null;
    loggedUsername: string = null;
    isSelfProfile: boolean = false;
    //isProfileManaged: boolean = false;
    isEditable: boolean = false;

    postFormData: FormData;
    editLabel: string = null;
    inEditMode:boolean = false;
    followersCount:number = 0;
    followers: User[] = [];
    managedBy = [];
    followingsCount:number = 0;
    followings = [];
    selectedProfileSmImage: File;
    profileSmImageChanged: boolean = false;
    profileTabSelected: boolean = true;
    activitiesTabSelected: boolean = false;
    activitiesData: boolean = false;
    settings: boolean = false;
    isShowSettings: boolean = false;
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
    
    keywordUser = 'full_name';
    searchUserManagedBy:any;

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
    settingsForm = new FormGroup({
        accessRestriction: new FormControl()
      });

    header:any;
    sticky:any;
    deviceInfo = this.deviceService.getDeviceInfo();
    @HostListener('window:scroll', ['$event']) onScrollEvent($event){

       const isMobile = this.deviceService.isMobile();
       let lockPosition:number;
       let nameDiv = document.getElementById("name-for-lock");
       let newPost = document.getElementById("newpost-on-selfactivites");
        if(isMobile){
            lockPosition = 630;
            if (window.pageYOffset >= lockPosition) {
                nameDiv.classList.add("sticky-name");
                newPost.classList.add("sticky-new-post");
                this.header.classList.add("sticky");
                nameDiv.classList.remove("display-none");
             } else {
                nameDiv.classList.remove("sticky-name");
                newPost.classList.remove("sticky-new-post");
                this.header.classList.remove("sticky");
                nameDiv.classList.add("display-none");
              }
        }
        else{
            lockPosition = 410;
            let desksidebar = document.getElementById("sidebar-div-desktop");
            let tapsEl = document.getElementById("template-tabs");
            console.log(window.pageYOffset);
            if(window.pageYOffset >= lockPosition) {
                nameDiv.classList.add("sticky-name");
                nameDiv.classList.remove("display-none");
                if(window.pageYOffset >= 450)
                  newPost.classList.add("sticky-new-post");
                else
                newPost.classList.remove("sticky-new-post");
                
             } else {
                newPost.classList.remove("sticky-new-post");
               nameDiv.classList.remove("sticky-name");
                if(!isMobile)
                  nameDiv.classList.add("display-none");
             }
             if(window.pageYOffset >= 423) {
                this.header.classList.add("sticky");
                desksidebar.classList.add("sticky-sidebar");
                tapsEl.classList.add("margin-left-auto");
             }
             else{
                this.header.classList.remove("sticky");
                desksidebar.classList.remove("sticky-sidebar");
                tapsEl.classList.remove("margin-left-auto");
             }
        }


      
   }

    constructor(private  router: Router,
                private route: ActivatedRoute,
                private userService: UserService,
                private postService: PostService,
                private profileService: ProfileService,
                private communicationService: ComponentcommunicationService,
                private legislatorsService: LegislatorService,
                private datashareService: DatashareService,
                private deviceService: DeviceDetectorService,
                private formBuilder: FormBuilder,
                private config:NgbDropdownConfig) {
                  //  config.placement = 'top-left';
        this.currentUser = this.datashareService.getCurrentUser();

        communicationService.userProfileEditChanged$.subscribe(
            editmode => {
                console.log('Received edit-save Profile message ' + editmode);
                this.inEditMode = editmode;
            });
        
        communicationService.manageUserRemove$.subscribe(
            data => {
                this.removeMember(data);
        });
        
        communicationService.biodataChanged$.subscribe(
            data => {
                this.biodata = data;
        });

    }

    toggleEditDisplayname(){
        this.isEditDisplayname = !this.isEditDisplayname;
    }

    selectedUser(userDetails:any){
        this.addMember(userDetails.username);
     }
 
     saveChamber(userDetails:any){
         this.biodata.chamber = userDetails.full_name;
         this.isEditChamber = !this.isEditChamber;
      }
 
      saveDistrict(userDetails:any){
         this.biodata.district = userDetails.full_name;
         this.isEditDistrict = !this.isEditDistrict;
      }
 
      saveState(userDetails:any){
         this.biodata.state = userDetails.full_name;
         this.isEditState = !this.isEditState;
      }
 
      saveParty(userDetails:any){
         this.biodata.party = userDetails.full_name;
         this.isEditParty = !this.isEditParty;
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
        //reset
        this.userData = new User();
        this.bannerImage = 'assets/images/user-banner1.jpg';
        this.profileSmImage = 'assets/images/avatar1.png'; 
        //this.displayName = '';
        this.biodata = {};



        this.uploadForm = this.formBuilder.group({
            file: ['']
        });

        this.header = document.getElementById("myHeader");
        //this.sticky= document.getElementById("myHeader").offsetTop;

        this.loggedUsername = this.datashareService.getLoggedinUsername();

        this.route.params.subscribe((params: Params) => {
            this.communicationService.userProfileChanged(false);

            this.profileUserId = params['id'];
            console.log('from user.component route params changed ' + this.profileUserId);
                    

            this.loadComponent(this.profileUserId);

        });
    }

    //OBSOLETE
    loadBioData(){
        this.userService.getBiodata(this.profileUserId)
        .subscribe((response) => {
          console.log('loadBioData response ', response);  
          //this.entityType = response['entityType']; 
          this.biodata= response['data'];
          /*
          if(this.userData['displayName'] != null){
            this.displayName = this.userData['displayName'];
          }else if (this.biodata['firstName'] != null || this.biodata['lastName'] != null){
            this.displayName = this.biodata['firstName'] + ' ' + this.biodata['lastName'];
          }
*/
          console.log('biodata response data ', this.biodata);
          
          //this.createFormGroup();
        });  
      }

    //OBSOLETE
    loadBioDataTemplate(category:string){
    this.profileService.getProfileTemplateByCategory('upDefault', category)
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

    showActivities() {
        this.activitiesData = true;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = false;

        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isSettingsCollapsed = true;
        this.isTwitterActivityCollapsed = true;
        this.isActivityCollapsed = false;
        this.settings = false;
    }
    
    showTwitterActivities() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = false;

        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isSettingsCollapsed = true;
        this.isActivityCollapsed = true;
        this.isTwitterActivityCollapsed = false;
        this.settings = false;
    }

    showSettings(){
        this.settings = true;       
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = false;

        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;
        this.isTwitterActivityCollapsed = true;
        this.isSettingsCollapsed = false;
    
        //if(this.isUserLogged()){     
        //    this.getSettings();
        //}
    }

    Profiles(activeTemplatName) {
        this.activeTemplatName =activeTemplatName;
        this.activitiesData = false;
        this.profileData = true;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.isManagedByCollapsed = true;
        this.managedByActive = false;
        this.isFollowersCollapsed = true;
        this.isProfileCollapsed = false;
        this.isActivityCollapsed = true;
        this.isTwitterActivityCollapsed = true;
        this.isSettingsCollapsed = true;

        this.settings = false;

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
        this.isTwitterActivityCollapsed = true;
        this.isSettingsCollapsed = true;

        this.settings = false;


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
        this.isSettingsCollapsed = true;

        this.settings = false;


    }

    managedByUsers() {
        this.activitiesData = false;
        this.profileData = false;
        this.folow = false;
        this.followersActiveCss = false;
        this.followingsActiveCss = false;
        this.managedByActive = true;
        //this.getManagedBy(this.profileUserId);
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = false;
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = true;
        this.isTwitterActivityCollapsed = true;
        this.isSettingsCollapsed = true;

        this.settings = false;


    }

    loadComponent(id: string) {
        this.loggedUser = this.datashareService.getCurrentUser();

        this.viewingUser['userId'] = this.profileUserId;
        //this is allowed even for non-logged in user 
        //this.loadBioData();
        
        if (!isDevMode() && this.isUserLogged()) {
            this.getRelationStatus(this.loggedUser.username, this.profileUserId);
        } else {
            this.followCntrlLabel = 'Join to Follow';
            this.followCntrlCSS = 'btn btn-primary followers-button';
            this.followStatusCSS = 'fa fa-plus-circle';
        }

        this.getFollowersCount(this.profileUserId);
        this.getFollowingsCount(this.profileUserId);
        //this.getFollowers(this.profileUserId);

        //if(this.isUserLogged()){
            //this.isProfileEditable();

            this.userService.getUserData(this.profileUserId, this.loggedUsername).subscribe(
                data => { 
                    this.userData = data;

                    //this.userData.description = 'Tst desc';
                    console.log('User data from service: ', this.userData);

                    this.isSelfProfile = this.userData['selfProfile'];
                    //this.isProfileManaged = this.userData['profileManaged'];
                    this.entityType =  this.userData['userType'];
                    this.category = this.userData['category'];
                    this.managedBy = this.userData['members'];
                    this.isProfileEditable();

                    //Settings
                    this.isShowSettings = this.userData['showSettings'];
                    if(this.userData['settings'] && this.userData.settings['accessRestriction']){
                        this.settingsForm.setValue(this.userData.settings);
                        this.isProfilePrivate = this.userData.settings['accessRestriction'];
                    }
                    

                    if (this.userData['sourceSystem'] === 'GOVTRACK') {
                        this.viewingUser['external'] = true;
                        this.viewingUser['isLegislator'] = true;
                        this.viewingUser['isCongress'] = true;
                        this.externalUser = true;

                    } else if (this.userData['sourceSystem'] === 'OPENSTATE') {
                        this.viewingUser['external'] = true;
                        this.viewingUser['isLegislator'] = true;
                        this.viewingUser['isCongress'] = false;
                        this.externalUser = true;

                    }
                    
                    //load profile small image

                    this.profileSmImage = 'assets/images/avatar1.png'; 

                    if (!isDevMode()){
                        if(this.userData != null && this.userData['photoUrl'] != null){
                            this.profileSmImage = this.userData['photoUrl'];
                        }else{
                            this.getProfileSmImage(this.viewingUser['userId']);
                        }
                    }

                    //getting the available profile templates for this user type - publicUser
                    //this.profilesTemplates = this.viewingUser['profileTemplates'] = data['profile'];
                    // console.log("profile templates: ", this.profilesTemplates);

                    //getting the data for this user profile
                    //this.profilesData = this.viewingUser['profilesData'] = this.userData['profileData'];
                    this.profilesTemplates = this.userData['profileTemplates'];
                    this.viewingUser['profileTemplates'] = this.profilesTemplates;

                    //list the templates that are available to use, ignores the one that are already used
                    this.profileService.getAvailableProfileTemplatesForEntity(this.viewingUser['userId'], this.category).subscribe(
                        data => {
                            this.availableProfileTemplates = data;
                        });

                    this.profilesDatas = this.userData['profileDatas'];
                    console.log('profile data: ', this.userData);

                    //identifying the profile selected for this user profile, so those components shall be loaded
                    let compTypes = [];
                    for (let profileData of this.profilesDatas) {
                        console.log('loading template component: ', profileData['profileTemplateId']);
                        //check if the template has been already added, add only if not exist
                        if (compTypes.indexOf(profileData['profileTemplateId']) < 0) {
                            compTypes.push(profileData['profileTemplateId']);

                            //not required if profiletemplates is retrieved from user
                            //this.profilesTemplates.push(profileData);
                        }

                        //retrieving contacts
                        if(profileData['profileTemplateId'] === 'upOtherContacts'){
                            this.contactsData = profileData['data'];
                            if(this.contactsData && this.contactsData['Twitter']){
                                this.twitterHandle = "https://twitter.com/" + this.contactsData['Twitter'] +"?ref_src=twsrc%5Etfw";

                            }
                            console.log('this.twitterHandle ', this.twitterHandle);

                            if(this.contactsData && this.contactsData['Facebook']){
                                this.facebookHandle = this.contactsData['Facebook'];
                            }
                            
                        }

                    }

                    if(this.twitterHandle && this.twitterHandle.trim().length > 0){
                        this.twitterHandleExist = true;
                    }

                    if (compTypes.length > 0) {
                        this.templateType = compTypes;
                    }

                    //this.loadBioDataTemplate(this.category);
                    //setting here so it can be accessed globally
                    this.datashareService.setViewingUser(this.viewingUser);
                    console.log('this.dataShareService.getViewingUser() ' + JSON.stringify(this.datashareService.getViewingUser()));
                    
                    if(this.isUserLogged() && !this.isSelfProfile){
                        this.check4CircleStatus();
                    }
                }
            );


        //}

        
    }

    accessChange(){
        console.log('accessChange() ', this.settingsForm.value);

        let request = {};
        request['username'] = this.profileUserId;
        request['settings'] = this.settingsForm.value;
        request['modifiedBy'] = this.loggedUser.username;
        
        this.isProfilePrivate = this.settingsForm.value['accessRestriction'];

        let requestString: string = JSON.stringify(request);

        this.userService.updateSettings(requestString).subscribe(data => {

        }, error => {
            console.log('error in accessChange() ', error);
        });
    }

    getSettings(){
        this.userService.getSettings(this.profileUserId).subscribe(
            data => {
                this.isProfilePrivate = data['accessRestriction'];
            }, error => {
                console.log('error in getSettings() ', error);
            });
    }

    //OBSOLETE?
    showProfile() {
        this.isProfileCollapsed = false;
        this.isActivityCollapsed = true;
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isSettingsCollapsed = true;

        this.profileTabSelected = true;
        this.activitiesTabSelected = false;
        return false;
    }
    //OBSOLETE?
    showActivities_delete() {
        this.isProfileCollapsed = true;
        this.isActivityCollapsed = false;
        this.isFollowersCollapsed = true;
        this.isFollowingsCollapsed = true;
        this.isManagedByCollapsed = true;
        this.isSettingsCollapsed = true;

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
        this.datashareService.editProfile(true);
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

        this.datashareService.editProfile(false);
        this.communicationService.userProfileChanged(false);


    }

    isProfileEditable() {
        if(this.isSelfProfile){
            this.isEditable = true;
        }else{
            this.userService.isProfileEditable(this.profileUserId, this.loggedUsername).subscribe(
                (result) => {
                    this.isEditable = result; 
                },
                (err) => {
                    console.log('Error ', err);
                }); 
    
        }
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

    //OBSOLETE ?
    loadProfileTemplates(operation: string) {
        this.userService.getUserData(operation, this.loggedUsername).subscribe(
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
            let routePath: string = '/login';
            let returnUrl: string = '/user/' + this.profileUserId + '?follow';
            this.router.navigate(['login'], {queryParams: {returnUrl: returnUrl}});
        }

        var followURequest = {};
        var sourceEntity = {};
        var targetEntity = {};



        followURequest['sourceEntityId'] = this.loggedUser ? this.loggedUser.username : '';//this.datashareService.getCurrentUserId();
        followURequest['targetEntityId'] = this.profileUserId;
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
        } else if (this.requestAwaiting) {
            this.followCntrlLabel = 'Approval Pending';
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

    add2Circle() {

        if(!this.isUserLogged()){
            this.router.navigate(['login']);
        }else{
            var request = {};
            request['username'] = this.loggedUsername;
            request['modifiedBy'] = this.loggedUsername;
            request['circlememberUsername'] = this.profileUserId;

            console.log('add2Circle request ' + JSON.stringify(request));

            this.userService.add2Circle(JSON.stringify(request)).subscribe(
            (result) => {
                this.isInCircle = true; 
            },
            (err) => {
                console.log('Error ', err);
            }); 
        }

    }
    
    removeFromCircle() {
        
        if(!this.loggedUsername){
            this.router.navigate(['login']);
        }else{
            var request = {};
            request['username'] = this.loggedUsername;
            request['modifiedBy'] = this.loggedUsername;
            request['circlememberUsername'] = this.profileUserId;

            console.log('removeFromCircle request ' + JSON.stringify(request));

            this.userService.removeFromCircle(JSON.stringify(request)).subscribe(
            (result) => {
                this.isInCircle = false; 
            },
            (err) => {
                console.log('Error ', err);
            }); 
        }

    }

    check4CircleStatus() { 
        this.userService.isInCircle(this.profileUserId, this.loggedUsername).subscribe(
            (result) => {
                this.isInCircle = result; 
            },
            (err) => {
                console.log('Error ', err);
            }); 

    }
    

    addMember(userId:string) {
        var request = {};
        request['memberUsername'] = userId;
        request['modifiedBy'] = this.loggedUsername;
        request['username'] = this.profileUserId;

        console.log('addMember request ' + JSON.stringify(request));

        this.userService.addMember(JSON.stringify(request)).subscribe(
        (result) => {
            this.managedBy = result; 
        },
        (err) => {
            console.log('Error ', err);
        }); 
    }

    removeMember(userId:string) {
        var request = {};
        request['memberUsername'] = userId;
        request['modifiedBy'] = this.loggedUsername;
        request['username'] = this.profileUserId;

        console.log('removeMember request ' + JSON.stringify(request));

        this.userService.removeMember(JSON.stringify(request)).subscribe(
        (result) => {
            this.managedBy = result; 
        },
        (err) => {
            console.log('Error ', err);
        }); 
    }

    getRelationStatus(entity: string, profileId: string) {

        this.userService.getRelationStatus(entity, profileId)
            .subscribe(
                (result) => {
                    console.log('getRelationStatus response ' + result);

                    if (result == 'REQUESTED') {
                        this.requestedToFollow = true;
                    } else if (result == 'AWAITING') {
                        this.requestAwaiting = true;
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
                    this.followersCount =  Number(result);

                },
                (err) => {
                    console.log('Error ', err);
                }); 
    }

    getFollowers(profileId: string) {
        //this.userService.getFollowers(profileId)
        this.userService.getConnections(profileId, 'followers')

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
                    console.log('this.managedBy ', this.managedBy);

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
                    this.followingsCount = Number(result);

                },
                (err) => {
                    console.log('Error ', err);
                });
    }

    getFollowings(profileId: string) {
        //this.userService.getFollowings(profileId)
        this.userService.getConnections(profileId, 'followings')
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
       // localStorage.setItem('editMode', String(this.inEditMode));
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

    toggleTemplateDropDown(){
        this.showDropDown = !this.showDropDown;
        
    }

}
