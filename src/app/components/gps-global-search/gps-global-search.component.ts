import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {PostService} from '../../services/post.service';

@Component({
  selector: 'app-gps-global-search',
  templateUrl: './gps-global-search.component.html',
  styleUrls: ['./gps-global-search.component.css']
})
export class GpsGlobalSearchComponent implements OnInit {

  @Input() placeholder: string;
  @Input() userType:string;
  @Input() inputvalue:string;
  @Output() valueChange = new EventEmitter();
  @Output() valueSave = new EventEmitter();

  keywordUser = 'full_name';
  selectedUser:any;
  selectedDetails:any;
  searchUsers:any;

  constructor(private postService:PostService) { }

  ngOnInit() {
    this.selectedUser = this.inputvalue;
  }

  onChangeSearch(e){
    this.postService.getTagUsers(e)
    .subscribe((data:any) => {
        this.searchUsers = data;
    });
   }

   valueChanged(selectedDetails:string){
      console.log(selectedDetails);
      this.selectedDetails = selectedDetails;
      this.valueChange.emit(selectedDetails);
   }

   editProfile(evt){
     if(this.selectedDetails == '' || this.selectedDetails == null || this.selectedDetails == undefined){
        this.selectedDetails = {};
        this.selectedDetails['full_name'] = this.selectedUser;
     }
    this.valueSave.emit(this.selectedDetails);
   }
   

}
