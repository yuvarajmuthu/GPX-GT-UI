import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {
  showBrand:boolean = false;
  showSearch:boolean = false;
  
  constructor() { }

  ngOnInit() {
  }

}
