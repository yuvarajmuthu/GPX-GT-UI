import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
//import { ReactiveFormsModule }    from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
//import { HttpModule } from '@angular/http';
import {HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import {AuthenticationService} from '../app/services/authentication.service';
import {AuthGuard} from '../app/auth/auth.guard';
//import {AppHttpInterceptor} from '../app/auth/app-http-interceptor';
import {MockHttpInterceptorService} from '../app/services/mock/mock-http-interceptor.service';

//import {NgbTabsetModule, NgbDropdownModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularFontAwesomeModule} from 'angular-font-awesome';

import {AppRoutingModule} from './app-routing.module';
import {SecurityModule} from './components/security/security.module';
import {PostModule} from './components/post/post.module';
import {UserModule} from './components/user/user.module';
import {GpxUIComponentsModule} from './components/gpx-uicomponents/gpx-uicomponents.module';
//import {ConnectionModule} from './components/connection/connection.module';

import {AutocompleteLibModule} from 'angular-ng-autocomplete';

import {AppComponent} from './app.component';
//import { CKEditorModule } from 'ckeditor4-angular';

import {BannerComponent} from './components/banner/banner.component';
import {TypeaheadComponent} from './components/typeahead/typeahead.component';
import {SearchlegislatorsComponent} from './components/searchlegislators/searchlegislators.component';
import {LegislatorComponent} from './components/legislator/legislator.component';
import {PositionComponent} from './components/position/position.component';
import {PartyComponent} from './components/party/party.component';
import {ProtectedComponent} from './components/protected/protected.component';
import {GAddressSearchComponent} from './components/g-address-search/g-address-search.component';

import {dateFormatPipe} from './util/pipes/dateformat.pipe';
import { CreatepageselectionComponent } from './components/security/createpage/createpageselection/createpageselection.component';
import { CircleComponent } from './components/circle/circle.component';
import { GpsGlobalSearchComponent } from './components/gps-global-search/gps-global-search.component';
import { HomeComponent } from './components/home/home.component';
//import {UserComponent} from './components/user/user/user.component';

//import { GpxInputComponent } from './gpx-input/gpx-input.component';

// const appRoutes: Routes = [
//   { path: 'user', component: TypeaheadComponent },
//   // { path: 'distrcit',      component: HeroDetailComponent },
//   // {
//   //   path: 'heroes',
//   //   component: HeroListComponent,
//   //   data: { title: 'Heroes List' }
//   // },
//   // { path: '',
//   //   redirectTo: '/heroes',
//   //   pathMatch: 'full'
//   // },
//   // { path: '**', component: PageNotFoundComponent }
//   { path: '**', component: SearchlegislatorsComponent }
// ];
export function tokenGetter() {
    return localStorage.getItem('currentUserToken');
}

let config = new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("300979965528-5oo12abv1dtekvh6ugtgmfvofm8h903p.apps.googleusercontent.com")
    },
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("1626630194177143")
    }
  ]);
  
  export function provideConfig() {
    return config;
  }

@NgModule({
    declarations: [
        AppComponent,
        BannerComponent,
        TypeaheadComponent,
        SearchlegislatorsComponent,
        LegislatorComponent,
        PositionComponent,
        PartyComponent,
        ProtectedComponent,
        // GAddressSearchComponent,
        CreatepageselectionComponent,
        CircleComponent,
        HomeComponent
        //dateFormatPipe
        //UserComponent
        //GpxInputComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DeviceDetectorModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        FormsModule,
        ScrollingModule,
        AutocompleteLibModule,
        SocialLoginModule,
        //CKEditorModule,
        //ReactiveFormsModule, // formGroup
        //NgbTabsetModule,
        //NgbDropdownModule,
        //NgbTypeaheadModule,
        //HttpModule,
        NgbModule,
        //Any requests sent using Angular's HttpClient will automatically have a token attached as an Authorization header.
        JwtModule.forRoot({
            config: {
                skipWhenExpired: true,
                //throwNoTokenError: true,
                tokenGetter: tokenGetter,
                //Authenticated requests should only be sent to whitelistedDomains
                whitelistedDomains: ['localhost:5000','gpxservice.xyz'],
                //specific routes that shouldn’t receive the JWT even if they are on a whitelisted domain
                blacklistedRoutes: ['https://www.gpxservice.xyz/login','https://www.gpxservice.xyz/user/tokenVerify']
            }
        }),
        AngularFontAwesomeModule, //OBSOLETE
        SecurityModule,
        PostModule,
        UserModule,
        GpxUIComponentsModule,
        //ConnectionModule
        // RouterModule.forRoot(
        //   appRoutes,
        //   { enableTracing: true } // <-- debugging purposes only
        // )
    ],
    exports:[GpxUIComponentsModule,
      SecurityModule,
      PostModule,
      UserModule],
    providers: [
      /*
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockHttpInterceptorService,
            multi: true
        },
        */
        AuthenticationService,
        AuthGuard,
        //dateFormatPipe
        //MockHttpInterceptorService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
