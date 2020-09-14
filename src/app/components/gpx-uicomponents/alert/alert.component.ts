import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {Alert, AlertType} from '../../../models/alert';

import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  /** Number in milliseconds, after which alert will be closed */
  @Input() dismissOnTimeout: number | string;
  @Output() onClose = new EventEmitter<AlertComponent>();
  /** This event fires when alert closed, $event is an instance of Alert component */
  @Output() onClosed = new EventEmitter<AlertComponent>();

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
        console.log('Alert ' + alert + alert.message + alert.type);
        if (!alert) {
            // clear alerts when an empty alert is received
            this.alerts = [];
            return;
        }

        // add alert to array
        this.alerts.push(alert);

        if (this.dismissOnTimeout) {
          // if dismissOnTimeout used as attr without binding, it will be a string
          setTimeout(
            () => this.removeAlert(alert),
            parseInt(this.dismissOnTimeout as string, 10)
          );
        }
    });

  }

  removeAlert(alert: Alert) {
      this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
      if (!alert) {
          return;
      }

      // return css class based on alert type
      switch (alert.type) {
          case AlertType.Success:
              return 'alert alert-success';
          case AlertType.Error:
              return 'alert alert-danger';
          case AlertType.Info:
              return 'alert alert-info';
          case AlertType.Warning:
              return 'alert alert-warning';
      }
  }
}
