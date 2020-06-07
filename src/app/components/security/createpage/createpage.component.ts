import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createpage',
  templateUrl: './createpage.component.html',
  styleUrls: ['./createpage.component.css']
})
export class CreatepageComponent implements OnInit {

  createUserPageForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    party: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    chamber: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
  });
  createEntityPageForm = new FormGroup({
    entityName: new FormControl('', Validators.required),
    entityDescr: new FormControl('', Validators.required),
  });
  isCreatepage4user: boolean = true;
  page:string = 'user';

  constructor(private route: ActivatedRoute) { }
   
  ngOnInit() {
    this.route
    .queryParams
    .subscribe(params => {
      let page = params['opt'] || 'user';
      this.isCreatepage4user = true;
      if(page == 'entity')
       this.isCreatepage4user = false;
    });
  }
  createUserpage(){
    console.log(this.createUserPageForm.value);
  }
  createEntitypage(){
    console.log(this.createEntityPageForm.value);
  }

}
