import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
//import { ReactiveFormsModule }    from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
//import { HttpModule } from '@angular/http';
import {HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';

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
import {ConnectionModule} from './components/connection/connection.module';

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
        GAddressSearchComponent,
        //dateFormatPipe
        //UserComponent
        //GpxInputComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        FormsModule,
        ScrollingModule,
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
                whitelistedDomains: ['localhost:5000'],
                blacklistedRoutes: ['localhost:5000/login']
            }
        }),
        AngularFontAwesomeModule, //OBSOLETE
        SecurityModule,
        PostModule,
        UserModule,
        GpxUIComponentsModule,
        ConnectionModule
        // RouterModule.forRoot(
        //   appRoutes,
        //   { enableTracing: true } // <-- debugging purposes only
        // )
    ],
    providers: [
        /* ENABLE IT FOR MOCKING - OFFLINE OPERATION */ 
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MockHttpInterceptorService,
            multi: true
        },
        AuthenticationService,
        AuthGuard,
        //dateFormatPipe
        //MockHttpInterceptorService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
