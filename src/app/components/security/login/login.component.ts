import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpResponse} from '@angular/common/http';

import {first} from 'rxjs/operators';

import {AlertService} from '../../../services/alert.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {DatashareService} from '../../../services/datashare.service';
import {ComponentcommunicationService} from '../../../services/componentcommunication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private datashareService: DatashareService,
        private componentcommunicationService: ComponentcommunicationService
    ) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) {
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

// convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    login() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        /*console.log(this.loginForm.value);*/
        this.loading = true;
        this.authenticationService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                () => {

                    //console.log("res.headers.get('Authorization') ", res.headers.get('Authorization'));
                    //localStorage.setItem('currentUserToken', res.headers.get('Authorization'));
                    /*
                            let main_headers = {};
                            const keys = res.headers.keys();
                            let headers = keys.map(key => {
                              `${key}: ${res.headers.get(key)}`
                                main_headers[key] = res.headers.get(key)
                               }
                              );
                              console.log("JSON.stringify(main_headers) ", JSON.stringify(main_headers));
                    */

                    // this.componentcommunicationService.loginChanged(true);
                    this.alertService.success('Login successful', true);

                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    loadRegisterComponent() {
        this.router.navigate(['/register']);
    }
}
