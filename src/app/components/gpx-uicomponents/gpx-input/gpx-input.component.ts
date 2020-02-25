import { Component, Input, EventEmitter, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-gpx-input',
  templateUrl: './gpx-input.component.html',
  styleUrls: ['./gpx-input.component.css'],
  host: {
    "(document: click)": "compareEvent($event)",
    "(click)": "trackEvent($event)"
  },
  outputs: ['save : onSave']
})
export class GpxInputComponent implements OnInit {
  @Input('placeholder') text;
  @Input('title') fieldName;
  originalText;
  tracker;
  el: ElementRef;
  show = false;
  save = new EventEmitter;
  @Input() permission = false;
  m: Number = 3;
  @Input() min = 0;
  @Input() max = 10000;
  @Input() error;
  @Input() regex;
  invalid = false;

  constructor(el: ElementRef) {
      this.el = el;
  }
  
  ngOnInit() {
      this.originalText = this.text;    //Saves a copy of the original field info.
  }

  validate(text) {
      if (this.regex) {
          var re = new RegExp('' + this.regex, "ig");
          if (re.test(text)) {
              this.invalid = false;
              //console.log('valid');
          }
          else {
              this.invalid = true;
          }
      }
      else {
          if ((text.length <= this.max) && (text.length >= this.min)) {
              this.invalid = false;
          }
          else {
              this.invalid = true;
          }
      }
      //console.log(this.invalid);
  }

  makeEditable() {
      if (this.show == false) {
          this.show = true;
      }
  }

  compareEvent(globalEvent) {
      if (this.tracker != globalEvent && this.show) {
          this.cancelEditable();
      }
  }

  trackEvent(newHostEvent) {
      this.tracker = newHostEvent;
  }

  cancelEditable() {
      this.show = false;
      this.invalid = false;
      this.text = this.originalText;
  }

  callSave() {
      if (!this.invalid) {
          var data = {};  //BUILD OBJ FOR EXPORT.
          data["" + this.fieldName] = this.text;
          var oldText = this.text;
          setTimeout(() => { this.originalText = oldText; this.text = oldText }, 0);  //Sets the field with the new text;
          this.save.emit(data);
          this.show = false;
      }
      
  }

}
