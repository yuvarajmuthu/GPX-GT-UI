import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-uservoteform',
  templateUrl: './uservoteform.component.html',
  styleUrls: ['./uservoteform.component.css']
})
export class UservoteformComponent implements OnInit {

  @Input() public votedetails;
  billname:string;
  rollcall:string;
  voted:boolean;
  date:any;

  constructor(private modal:NgbActiveModal) { }

  ngOnInit() {
    console.log(this.votedetails);
    this.billname = this.votedetails.billname;
    this.rollcall = this.votedetails.rollcall;
    this.voted = this.votedetails.voteoption;
    this.date = this.votedetails.date;
  }
  save(){
    this.modal.close('Ok click');
  }

}
