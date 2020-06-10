import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public USERTYPE_LEGISLATOR = "LEGISLATOR";
    public USERTYPE_PUBLICUSER = "PUBLICUSER";
    public USERTYPE_LEGISLATIVE_DISTRICT = "LEGISLATIVE_DISTRICT";
    public USERTYPE_POLITICAL_PARTY = "POLITICAL_PARTY";
    public USERTYPE_GROUP = "GROUP";
}