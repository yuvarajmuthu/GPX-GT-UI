import { Injectable, ViewContainerRef, EmbeddedViewRef, ViewRef } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

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
  // private userProfileEditSource = new BehaviorSubject<boolean>(true);

  private manageUserRemove = new Subject<string>();
  private biodataChange = new Subject<any>();
  private connectionAcceptSource = new Subject<string>();
  private connectionRequestCancelSource = new Subject<string>();
  // Observable string streams
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionProfileTemplateRemoved$ = this.missionConfirmedSource.asObservable();
  public missionAlert$ = this.missionAlertSource.asObservable();
  //missionNewProfileTemplateAdded$ = this.newProfileTemplateAddedPopulation.asObservable();
  loginChanged$ = this.loginAlertSource.asObservable();
  userProfileEditChanged$ = this.userProfileEditSource.asObservable();
  connectionAcceptChanged$ = this.connectionAcceptSource.asObservable();
  connectionRequestCancelChanged$ = this.connectionRequestCancelSource.asObservable(); 
  manageUserRemove$ = this.manageUserRemove.asObservable();
  biodataChanged$ = this.biodataChange.asObservable();

  // Service message broadcast
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }

  loginChanged(value: boolean) {
    this.loginAlertSource.next(value); 
  }

  manageUserRemoved(value: string) {
    this.manageUserRemove.next(value); 
  }
  
  biodataChanged(value: any) {
    this.biodataChange.next(value); 
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

  connectionAcceptUpdate(value: string) {
    this.connectionAcceptSource.next(value);
  }
  connectionRequestCancelUpdate(value: string) {
    this.connectionRequestCancelSource.next(value);
  }
//for group profile template - TemplatePopulationComponent
  // newProfileTemplateAddedMission(populationComponent: TemplatePopulationComponent) {
  //   this.newProfileTemplateAddedPopulation.next(populationComponent);
  // }

  // removeProfileTemplateMission(viewRef: ViewRef) {
  //   this.missionConfirmedSource.next(viewRef);
  // }
}
