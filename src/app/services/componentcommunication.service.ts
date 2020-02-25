import { Injectable, ViewContainerRef, EmbeddedViewRef, ViewRef } from '@angular/core';

import { Observable, Subject } from 'rxjs';

//import {TemplatePopulationComponent} from './../constitution.template.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentcommunicationService {
   
  // Observable string sources
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<ViewRef>();
  private missionAlertSource = new Subject<string>();
  //private newProfileTemplateAddedPopulation = new Subject<TemplatePopulationComponent>();
  private loginAlertSource = new Subject<boolean>();
  private userProfileEditSource = new Subject<boolean>();

  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionProfileTemplateRemoved$ = this.missionConfirmedSource.asObservable();
  public missionAlert$ = this.missionAlertSource.asObservable();
  //missionNewProfileTemplateAdded$ = this.newProfileTemplateAddedPopulation.asObservable();
  loginChanged$ = this.loginAlertSource.asObservable();
  userProfileEditChanged$ = this.userProfileEditSource.asObservable();
  
  // Service message commands
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  loginChanged(value: boolean) {
    this.loginAlertSource.next(value); 
  }

  userProfileChanged(value: boolean) {
    this.userProfileEditSource.next(value);
  }

  public announceAlertMission(mission: string) {
    this.missionAlertSource.next(mission);
    console.log('alerted');
  }
 
  getAlert(): Observable<any> {
    return this.missionAlertSource.asObservable();
  }

//for group profile template - TemplatePopulationComponent
  // newProfileTemplateAddedMission(populationComponent: TemplatePopulationComponent) {
  //   this.newProfileTemplateAddedPopulation.next(populationComponent);
  // }

  // removeProfileTemplateMission(viewRef: ViewRef) {
  //   this.missionConfirmedSource.next(viewRef);
  // }
}
