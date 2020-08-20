import { Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
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
  location_name:string;
  time:string;
  address: string = '300 Chatham Park Drive,Pittsburgh, PA 15220';

  constructor(public modal:NgbActiveModal, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.eventdetails);
    this.full_name = this.eventdetails.full_name;
    this.description = this.eventdetails.description;
    this.location = this.eventdetails.location_name;
    this.date = this.eventdetails.date;
  }

  getAddress(addressEvent: Event) {
    console.log('Address - ' + addressEvent['formatted_address']);
    this.address = addressEvent['formatted_address'];
    this.changeDetector.detectChanges();
  }

}
