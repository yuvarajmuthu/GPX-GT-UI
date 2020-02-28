import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CKEditor4} from 'ckeditor4-angular/ckeditor';

//import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TypeaheadComponent} from './components/typeahead/typeahead.component';

import {ComponentcommunicationService} from './services/componentcommunication.service';
import {DatashareService} from './services/datashare.service';
import {UserService} from './services/user.service';
import {AlertService} from './services/alert.service';
import {AuthenticationService} from './services/authentication.service';

import {User} from '../app/models/user';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    public editorData = '';
    /*CKEDITOR DATA FUNCTION STARAT*/
    public onChange(event: CKEditor4.EventInfo) {
        console.log(event.editor.getData());
    }

    /*CKEDITOR DATA FUNCTION END*/
    navigateList = ['searchLegislator', 'news', 'group', 'request'];
    //public tabSet: NgbTabset;

    title = 'gpx-ui';
    isUserLogged: boolean;
    isCollaped: boolean = true;
    profileSmImage: any = 'assets/images/avatar1.png';
    isImageLoading: boolean = false;

    constructor(private  router: Router,
                private missionService: ComponentcommunicationService,
                private dataShareService: DatashareService,
                private userService: UserService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService) {
        missionService.getAlert().subscribe(
            mission => {
                console.log('Alert message received ' + mission);
            });

        dataShareService.getCurrentUserObservable().subscribe(
            data => {
                console.log('Change in User object, in app.componen ');
                if (data && (Object.keys(data).length > 0) && localStorage.getItem('currentUserToken')) {
                    data.token = localStorage.getItem('currentUserToken');
                    this.isUserLogged = true;
                } else {
                    this.isUserLogged = false;
                }
            });

        missionService.loginChanged$.subscribe(
            data => {
                console.log('Received data from missionService.loginChanged$.subscribe ', data);
                this.isUserLogged = data;
                this.updateUserNavBar();
            });

        //SHOULD BE PART OF LOGIN PROCESS
        /*
        this.userService.getUserData(this.dataShareService.getCurrentUserId(), false).subscribe(
            data => {
              this.dataShareService.setCurrentUser(data);
              //console.log("this.dataShareService.getCurrentUser() " + JSON.stringify(this.dataShareService.getCurrentUser()));
            }
        );
        */
    }

    ngOnInit() {
        if (localStorage.getItem('currentUserToken')) {
            let user = new User();
            user.token = localStorage.getItem('currentUserToken');
            user.username = localStorage.getItem('currentUserName');
            this.dataShareService.setCurrentUser(user);

            this.getProfileSmImage(user.username);
        }
    }

    updateUserNavBar() {
        if (this.isUserLogged) {
            let user: User = this.dataShareService.getCurrentUser();
            this.getProfileSmImage(user.username);
        } else {
            this.profileSmImage = 'assets/images/avatar1.png';
        }
    }

    loadUser() {
        //e.preventDefault();
        let user: User = this.dataShareService.getCurrentUser();

        console.log('logged in user username  - ' + user.username);
        let routePath: string = '/user/' + user.username;
        this.router.navigate([routePath]);
        //return false;
    }

    clickTab(event: String) {
        console.log('tab button clicked - ' + event);
        //console.log("event.target.value " + event.target);
        if (event === 'District') {
            //localStorage.setItem('currentUser', JSON.stringify('Me'))
            //console.log("Test Localstorage - " + localStorage.getItem('currentUser'));
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/district/14']);
        } else if (event === 'News') {
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/news']);
        } else if (event === 'Post') {
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/post']);
        } else if (event === 'Search') {
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/']);
        } else if (event === 'Parties') {
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/parties']);
        } else if (event === 'Map') {
            console.log('Routing ' + event);
            //this.staticTabs.tabs[6].active = true;
            //this.router.navigate(['/map']);
        } else if (event === 'User') {
            console.log('Routing ' + event);
            //this.router.navigate(['/user/u001']);
        } else if (event === 'Party') {
            console.log('Routing ' + event);
            //this.router.navigate(['/partyProfile']);
        }
    }

    //OBSOLETE
    tabclick(evt: any) {
        console.log('tab clicked ', evt);
        if (evt.nextId) {
            if ('legislatorTab' === evt.nextId) {
                this.router.navigate(['searchLegislator']);
            } else if ('constitutionTab' === evt.nextId) {
                this.router.navigate(['group']);
            } else if ('socialTab' === evt.nextId) {
                this.router.navigate(['news']);
            }
        }
    }

    route(name: string) {
        let routePath: string = '/' + name;
        this.router.navigate([routePath]);
    }


    logout() {
        //    this.loading = true;
        this.authenticationService.logout();
        //this.missionService.loginChanged(false);
        //this.alertService.success('Logout successful', true);
        this.router.navigate(['/']);

        // this.authenticationService.login(this.model)
        //     .subscribe(
        //         data => {
        //             //store token from response in localstorage
        //             this.missionService.loginChanged(true);
        //             this.alertService.success('Login successful', true);
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });

    }

    createPage(event: String) {
        console.log('creating page - ' + event);
        //console.log("event.target.value " + event.target);
        if (event === 'District') {
            this.router.navigate(['/group/CREATE']);
        } else if (event === 'Legislator') {
            this.router.navigate(['/user/B001296']);
        } else if (event === 'User') {
            this.router.navigate(['/user/CREATE']);
        } else if (event === 'Party') {
            this.router.navigate(['/partyProfile']);
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

}
