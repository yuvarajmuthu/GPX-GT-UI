import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
	@Input() imageUrl:string;
	@Input() height:string; //= "50px";
  @Input() width:string; //= "50";
  
  constructor() { }

  ngOnInit() {
  }

}
