/// <reference types="@types/googlemaps" />

import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl  } from '@angular/forms';
//import { } from '@types/googlemaps';
//import { } from 'googlemaps';
//declare var google: any;

@Component({
  selector: 'app-g-address-search',
  templateUrl: './g-address-search.component.html',
  styleUrls: ['./g-address-search.component.css']
})
export class GAddressSearchComponent implements OnInit, AfterViewInit {
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;
  @Input()
  autocompleteInput: string;
  //@Input() control: FormControl;
  queryWait: boolean;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.getPlaceAutocomplete();
}

private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
            componentRestrictions: { country: 'US' },
            types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
        });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.invokeEvent(place);
    });
}

invokeEvent(place: Object) {
    this.setAddress.emit(place);
}
}
