import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConstants {
    public USERTYPE_LEGISLATOR = "LEGISLATOR";
    public USERTYPE_PUBLICUSER = "PUBLICUSER";
    public USERTYPE_CONGRESS_LEGISLATOR = "CONGRESS LEGISLATOR";
    public USERTYPE_LEGISLATIVE_DISTRICT = "LEGISLATIVE DISTRICT";
    public USERTYPE_POLITICAL_PARTY = "POLITICAL PARTY";
    public USERTYPE_GROUP = "GROUP";
}