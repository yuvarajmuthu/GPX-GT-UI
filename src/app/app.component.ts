import {Component, OnInit, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

//import {CKEditor4} from 'ckeditor4-angular/ckeditor'; 

//import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TypeaheadComponent} from './components/typeahead/typeahead.component';

import {ComponentcommunicationService} from './services/componentcommunication.service';
import {DatashareService} from './services/datashare.service';
import {UserService} from './services/user.service';
import {PostService} from './services/post.service';
import {SearchService} from './services/search.service';
import {AlertService} from './services/alert.service';
import {AuthenticationService} from './services/authentication.service';

import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import {User} from '../app/models/user';
import { IfStmt } from '@angular/compiler';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
    
    // public editorData = '';
    
    // public onChange(event: CKEditor4.EventInfo) {
    //     console.log(event.editor.getData());
    // }
    
    notifications:any;
    
    keyword = 'full_name';
    searchUsers: any =[];
    iscreateOptEnabled: boolean=false;
    
    model: any;
    searching = false;
    searchFailed = false;

    navigateList = ['searchLegislator', 'news', 'group', 'request'];
    activeTab:string;
    //public tabSet: NgbTabset;
    deviceInfo = this.deviceService.getDeviceInfo();
    isMobile = this.deviceService.isMobile();
    title = 'gpx-ui';
    isUserLogged: boolean;
    isCollaped: boolean = true;
    profileSmImage: any = 'assets/images/avatar1.png';
    isImageLoading: boolean = false;
    @HostListener('click', ['$event.target'])
    onClick(evt) {
      if(evt.id != 'dropdownMenuButton'){
            var element = document.getElementById("createpagemenu");
            element.classList.remove("createpage-option");
            this.iscreateOptEnabled = false;
      }
   }
   @HostListener('window:scroll', ['$event']) onScrollEvent($event){
       let postConent = document.getElementById("postContent");
       if(postConent){
            if(window.pageYOffset >= 250){
                document.getElementById("myBtn").style.display = "block";
            }
            else{
                document.getElementById("myBtn").style.display = "none";
            }
       }
   }

    constructor(private  router: Router,
                private missionService: ComponentcommunicationService,
                private dataShareService: DatashareService,
                private userService: UserService,
                private alertService: AlertService,
                private postService:PostService,
                private searchService:SearchService,
                private deviceService: DeviceDetectorService,
                private authenticationService: AuthenticationService) {
        missionService.getAlert().subscribe(
            mission => {
                console.log('Alert message received ' + mission);
            });

        // window.addEventListener("click", function(e){
        //     if( e.target && e.target.id && e.target.id != 'dropdownMenuButton'){
        //       var element = document.getElementById("createpagemenu");
        //       element.classList.remove("createpage-option");
        //     }


        // });

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

    // search = (text$: Observable<string>) =>
    // text$.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   tap(() => this.searching = true),
    //   switchMap(term =>
    //     this.postService.getTagUsers(term).pipe(
    //       tap(() => this.searchFailed = false),
    //       catchError(() => {
    //         this.searchFailed = true;
    //         return of([]);
    //       }))
    //   ),
    //   tap(() => this.searching = false)
    // )
  
    search = (text$: Observable<string>) => {
        return text$.pipe(      
            debounceTime(200), 
            distinctUntilChanged(),
            // switchMap allows returning an observable rather than maps array
            switchMap( (searchText) =>  this.searchService.getUsers(searchText) )
            // catchError(new ErrorInfo().parseObservableResponseError)              
        );                 
      }

      resultFormatBandListValue(value: any) {            
        return value.firstName +' '+value.lastName;
      } 

      inputFormatBandListValue(value: any)   {
        console.log(value);
        if(value.firstName)
          return value.firstName+' '+value.lastName
        return value;
      }

      onChangeSearch(e){
          this.postService.getTagUsers(e)
          .subscribe((data:any) => {
              this.searchUsers = data;
          });
      }

      getNotifications(){
        this.postService.getNotifications()
        .subscribe((data:any) => {
            this.notifications = data;
            console.log(this.notifications);
        });
    }

      selectEvent(e){
          console.log(e.username);
       let routePath= '/user/'+e.username+"/";
       this.router.navigate([routePath]);
     }



    ngOnInit() {
        if (localStorage.getItem('currentUserToken')) {
            let user = new User();
            user.token = localStorage.getItem('currentUserToken');
            user.username = localStorage.getItem('currentUserName');
            this.dataShareService.setCurrentUser(user);

            this.getProfileSmImage(user.username);
            this.getNotifications();
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

    clickedNav(){
        if(this.isMobile){
            this.isCollaped = !this.isCollaped;
        }
    }

    clickTab(event: string) {
        this.activeTab = event;
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
                //this.router.navigate(['group']);
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

    loadcreatepage(evt, opt){
        evt.preventDefault();
        this.router.navigate(['createpage'],{ queryParams: { 'opt': opt } });

    }

}
