import { Component, OnInit, Input} from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-usereventform',
  templateUrl: './usereventform.component.html',
  styleUrls: ['./usereventform.component.css']
})
export class UsereventformComponent implements OnInit {

  @Input() public eventdetails;
  full_name:string;
  description:string;
  location:string;
  date:string;

  constructor(private modal:NgbActiveModal) { }

  ngOnInit() {
    console.log(this.eventdetails);
    this.full_name = this.eventdetails.full_name;
    this.description = this.eventdetails.description;
    this.location = this.eventdetails.location_name;
    this.date = this.eventdetails.date;
  }

}
